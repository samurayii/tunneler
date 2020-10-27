import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import * as Ajv from "ajv";
import jtomler from "jtomler";
import json_from_schema from "json-from-default-schema";
import * as auth_user_schema from "./schemes/auth_user.json";
import * as tunnel_schema from "./schemes/tunnel.json";
import * as config_schema from "./schemes/config.json";
import { IAppConfig } from "./config.interface";
import { ITunnelConfig } from "./tunnel";
import { execSync } from "child_process";
 
const pkg = finder(__dirname).next().value;

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file.");

program.parse(process.argv);

if (process.env["TUNNELER_CONFIG_PATH"] === undefined) {
	if (program.config === undefined) {
		console.error(chalk.red("[ERROR] Not set --config key"));
		process.exit(1);
	}
} else {
	program.config = process.env["TUNNELER_CONFIG_PATH"];
}

const full_config_path = path.resolve(process.cwd(), program.config);

if (!fs.existsSync(full_config_path)) {
    console.error(chalk.red(`[ERROR] Config file ${full_config_path} not found`));
    process.exit(1);
}

const config: IAppConfig = <IAppConfig>json_from_schema(jtomler(full_config_path), config_schema);

for (const item of config.authorization.users) {

    const ajv = new Ajv();
    const validate = ajv.compile(auth_user_schema);

    if (!validate(item)) {
        console.error(chalk.red(`[ERROR] Config authorization.users parsing error. Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`));
        process.exit(1);
    }

}

const names = [];
let index = 0;

for (let item of config.tunnels) {

    if (names.includes(item.name) === true) {
        console.error(`${chalk.red("[ERROR]")} Tunnel name "${item.name}" already exist`);
        process.exit(1);
    }

    names.push(item.name);

    item = <ITunnelConfig>json_from_schema(item, tunnel_schema);

    const ajv = new Ajv();
    const validate = ajv.compile(tunnel_schema);

    if (!validate(item)) {
        console.error(`${chalk.red("[ERROR]")} Config tunnels parsing error. Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`);
        process.exit(1);
    }

    config.tunnels[index] = item;

    ++index;

}

const ajv = new Ajv();
const validate = ajv.compile(config_schema);

if (!validate(config)) {
    console.error(chalk.red(`${chalk.red("[ERROR]")} Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`));
    process.exit(1);
}

try { 
    execSync("sshpass -V");
} catch (error) {
    console.error(`${chalk.red("[ERROR]")} Can not exec command "sshpass -V", error: ${error}`);
    process.exit(1);
}

export default config;
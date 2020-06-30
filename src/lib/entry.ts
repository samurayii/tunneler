import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import * as Ajv from "ajv";
import jtomler from "jtomler";
import json_from_schema from "json-from-default-schema";
import * as config_schema from "./config_schema.json";
 
const pkg = finder(__dirname).next().value;

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file.");

program.parse(process.argv);

if (program.config === undefined) {
    console.error(chalk.red("Not set --config key"));
    process.exit(1);
}

const full_config_path = path.resolve(process.cwd(), program.config);

if (!fs.existsSync(full_config_path)) {
    console.error(chalk.red(`Config file ${full_config_path} not found`));
    process.exit(1);
}

const config = json_from_schema(jtomler(full_config_path), config_schema);

const ajv = new Ajv();
const validate = ajv.compile(config_schema);

const valid = validate(config);

if (!valid) {
    throw new Error(`Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`);
}

export default config;
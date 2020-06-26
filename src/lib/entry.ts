import { program } from "commander";
import * as pkg from "../package.json";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

program.version(pkg.version);
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

export default program;
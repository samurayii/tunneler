#!/usr/bin/env node
import { program } from "commander";
import * as chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import * as finder from "find-package-json";
import jtomler from "jtomler";
import * as config_schema from "./lib/schemes/config.json";
import { IAppConfig } from "./lib/config.interface";
import json_from_schema from "json-from-default-schema";
import { DockerHealthcheck } from "./lib/docker-healthcheck";

const pkg = finder(__dirname).next().value;

program.version(`version: ${pkg.version}`, "-v, --version", "output the current version.");
program.name(pkg.name);
program.option("-c, --config <type>", "Path to config file.");

program.parse(process.argv);

if (process.env["TEMPLATE_CONFIG_PATH"] === undefined) {
	if (program.config === undefined) {
		console.error(chalk.red("[ERROR] [Docker-healthcheck] Not set --config key"));
		process.exit(1);
	}
} else {
	program.config = process.env["TEMPLATE_CONFIG_PATH"];
}

const full_config_path = path.resolve(process.cwd(), program.config);

if (!fs.existsSync(full_config_path)) {
    console.error(chalk.red(`[ERROR] [Docker-healthcheck] Config file ${full_config_path} not found`));
    process.exit(1);
}

const config: IAppConfig = <IAppConfig>json_from_schema(jtomler(full_config_path), config_schema);

const docker_healthcheck = new DockerHealthcheck(config.docker_healthcheck, config.api);
docker_healthcheck.run();

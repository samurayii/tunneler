import axios, { AxiosRequestConfig } from "axios";
import { IDockerHealthcheckConfig, IDockerHealthcheck } from "./interfaces";
import { IApiServerConfig } from "../../api";
import * as chalk from "chalk";

export * from "./interfaces";

export class DockerHealthcheck implements IDockerHealthcheck {
    
    private readonly _options: AxiosRequestConfig

    constructor (
        private readonly _config: IDockerHealthcheckConfig,
        private readonly _api_config: IApiServerConfig
    ) { 

        this._options = {
            timeout: this._config.timeout * 1000,
            method: "get"
        };
        
        const reg = /([a-zA-Z]{1}[-a-zA-Z0-9.]{0,255}|[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|\*)\:([0-9]{1,5})/;
        const arg = this._api_config.listening.match(reg);
        
        if (arg) {
            const port = parseInt(arg[2]);
            this._options.url = `http://localhost:${port}/healthcheck`;
        } else {
            this._options.url = "http://localhost/healthcheck";
        }

    }

    run (): void {

        if (this._config.enable !== true) {
            process.exit();
        }

        axios(this._options).then( () => {
            console.log("[Docker-healthcheck] app is heathy");
            process.exit();
        }).catch( (error: Error) => {
            console.error(chalk.red(`[Docker-healthcheck] Healthcheck error: ${error.message}`));
            process.exit(1);
        });
    }

}
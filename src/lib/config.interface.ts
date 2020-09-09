import { IApiServerConfig } from "../http";
import { ILoggerConfig } from "logger-flx";
import { IAuthorizationConfig } from "./authorization";
import { IDockerHealthcheckConfig } from "./docker-healthcheck";

export interface IAppConfig {
    logger: ILoggerConfig
    api: IApiServerConfig
    authorization: IAuthorizationConfig
    docker_healthcheck: IDockerHealthcheckConfig
}
import { IApiServerConfig } from "../api";
import { ILoggerConfig } from "./logger";
import { IAuthorizationConfig } from "./authorization";
import { IDockerHealthcheckConfig } from "./docker-healthcheck";

export interface IAppConfig {
    logger: ILoggerConfig
    api: IApiServerConfig
    authorization: IAuthorizationConfig
    docker_healthcheck: IDockerHealthcheckConfig
}
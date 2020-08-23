import { IApiServerConfig } from "../api";
import { ILoggerConfig } from "./logger";
import { IAuthorizationConfig } from "./authorization";

export interface IAppConfig {
    logger: ILoggerConfig
    api: IApiServerConfig
    authorization: IAuthorizationConfig
}
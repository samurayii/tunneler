import config from "./lib/entry";
import { Logger } from "logger-flx";
import { Singleton } from "di-ts-decorators";
import { KoaD } from "koa-ts-decorators";
import { Authorization } from "./lib/authorization";

import "./http";
import { TunnelController } from "./lib/tunnel-controller";

const logger = new Logger(config.logger);
const authorization = new Authorization(config.authorization);
const tunnel_controller = new TunnelController(config.tunnels, logger);

Singleton(Logger.name, logger);

const api_server = new KoaD(config.api, "api-server");

const bootstrap = async () => {

    const close_app = () => {
        api_server.close();
        tunnel_controller.stop().finally( () => {
            process.exit();
        });
    };

    try {

        api_server.context.authorization = authorization;

        await api_server.listen( () => {
            logger.info(`[api-server] listening on network interface ${api_server.config.listening}${api_server.prefix}`);
        });

        await tunnel_controller.on("close", () => {
            close_app();
        });

        await tunnel_controller.on("error", () => {
            process.exit(1);
        });

        await tunnel_controller.run();

        process.on("SIGTERM", () => {
            logger.log("Termination signal received");
            close_app();
        });

    } catch (error) {
        logger.error(error.message);
        logger.log(error.stack);
        process.exit(1);
    }

};

bootstrap();
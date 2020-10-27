import { ILogger } from "logger-flx";
import { Tunnel } from "../tunnel";
import { ITunnel, ITunnelConfig } from "../tunnel/interfaces";
import { EventEmitter } from "events";

export * from "./interfaces";

export class TunnelController extends EventEmitter implements TunnelController {

    private readonly _tunnel_list: {
        [key: string]: ITunnel
    }

    constructor (
        tunnels_config: ITunnelConfig[],
        private readonly _logger: ILogger
    ) {

        super();

        this._tunnel_list = {};

        for (const tunnel_config of tunnels_config) {

            const tunnel = new Tunnel(tunnel_config, this._logger);

            tunnel.on("error", (tunnel_name) => {
                this.emit("error", tunnel_name);
            });

            tunnel.on("close", (tunnel_name) => {
                this.emit("close", tunnel_name);
            });

            this._tunnel_list[tunnel.name] = tunnel;

        }

    }

    async stop (): Promise<void> {

        this._logger.log("Stopping all tunnels", "dev");

        for (const tunnel_name in this._tunnel_list) {
            const tunnel = this._tunnel_list[tunnel_name];
            await tunnel.stop();
        }

    }

    async run (): Promise<void> {

        this._logger.log("Running all tunnels", "dev");

        for (const tunnel_name in this._tunnel_list) {
            const tunnel = this._tunnel_list[tunnel_name];
            await tunnel.run();
        }

    }

}
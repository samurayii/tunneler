import * as chalk from "chalk";
import { EventEmitter } from "events";
import { ILogger, ILoggerConfig } from "./interfaces";

export * from "./interfaces";

export class Logger extends EventEmitter implements ILogger {

    private _modes: string[];

    constructor ( 
        private readonly _config: ILoggerConfig 
    ) {

        super();

        this._modes = [
            "prod",
            "dev",
            "debug"
        ];

        if (!this._modes.includes(this._config.mode)) {
            throw Error(`Mode must be ${this._modes.join()}`);
        }

        if (this._config.mode === "debug") {
            console.log(chalk.cyan("[LOGGER] Debug mode activated"));
        }

        if (this._config.mode === "dev") {
            console.log(chalk.cyan("[LOGGER] Developer mode activated"));
        }

    }

    private _print (message: unknown, color: string, type: string, mode: string, error: boolean = false): void {

        this.emit("message", message, type, mode);

        if (this._config.enable !== true) {
            return;
        }

        if (mode !== "prod") {
            if (mode !== this._config.mode) {
                if (this._config.mode === "dev" && mode === "debug") {
                    return;
                }
            }
        }

        let total_message: unknown = message;

        if (this._config.type === true) {
            if (type === "info") {
                total_message = `[INFO] ${total_message}`;
            } else if (type === "error") {
                total_message = `[ERROR] ${total_message}`;
            } else if (type === "warning") {
                total_message = `[WARNING] ${total_message}`;
            }
        }

        if (this._config.timestamp === true) {
            const now = new Date();
            total_message = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${total_message}`;
        }

        if (color === "cyan") {
            total_message = chalk.cyan(total_message);
        } else if (color === "red") {
            total_message = chalk.red(total_message);
        } else if (color === "yellow") {
            total_message = chalk.yellow(total_message);
        } else if (color === "green") {
            total_message = chalk.green(total_message);
        }

        if (error === true) {
            console.error(total_message);
        } else {
            console.log(total_message);
        }

    }

    log (message: unknown, mode: string = "prod"): void {
        this._print(message, "none", "log", mode);
    }

    info (message: unknown, mode: string = "prod"): void {
        this._print(message, "cyan", "info", mode);
    }

    error (message: unknown, mode: string = "prod"): void {
        this._print(message, "red", "error", mode, true);
    }

    warn (message: unknown, mode: string = "prod"): void {
        this._print(message, "yellow", "warning", mode);
    }

    red (message: unknown, mode: string = "prod"): void {
        this._print(message, "red", "log", mode);
    }

    yellow (message: unknown, mode: string = "prod"): void {
        this._print(message, "yellow", "log", mode);
    }

    cyan (message: unknown, mode: string = "prod"): void {      
        this._print(message, "cyan", "log", mode);
    }

    green (message: unknown, mode: string = "prod"): void {      
        this._print(message, "green", "log", mode);
    }

}
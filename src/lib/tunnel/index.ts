import { ILogger } from "logger-flx";
import { ITunnel, ITunnelConfig } from "./interfaces";
import { EventEmitter } from "events";
import { spawn, execSync } from "child_process";

export * from "./interfaces";

export class Tunnel extends EventEmitter implements ITunnel {

    private _running_flag: boolean
    private _restarting_flag: boolean
    private _app: ReturnType<typeof spawn>
    private _id_interval: ReturnType<typeof setTimeout>

    constructor (
        private readonly _config: ITunnelConfig,
        private readonly _logger: ILogger
    ) {
        super();

        this._running_flag = false;
        this._restarting_flag = false;

        this._logger.log(`Tunnel "${this._config.name}" created`, "dev");
    }

    async run (): Promise<void> {

        if (this._running_flag === true || this._config.enable === false) {
            return;
        }

        this._logger.log(`Running tunnel "${this._config.name}"`);

        this._running_flag = true;
        this._restarting_flag = false;

        try {

            const test_command = `sshpass -p ${this._config.password} ssh -p ${this._config.ssh_port} -o stricthostkeychecking=no ${this._config.user}@${this._config.remote_host} "hostname -A"`;
            const command = `sshpass -p ${this._config.password} ssh -p ${this._config.ssh_port} -L ${this._config.destination_host}:${this._config.destination_port}:${this._config.target_host}:${this._config.target_port} -o stricthostkeychecking=no ${this._config.user}@${this._config.remote_host}`;

            this._logger.log(`[Tunnel:${this._config.name}] exec: ${test_command.replace(/sshpass -p .* ssh/ig, "/sshpass -p XXXXX ssh").replace(/=no .+@/ig,"=no XXXXX@")}`, "debug");

            const stdout = execSync(test_command);
            this._logger.log(`[Tunnel:${this._config.name}] ${stdout.toString().trim()}`);

            this._logger.log(`[Tunnel:${this._config.name}] exec: ${command.replace(/sshpass -p .* ssh/ig, "/sshpass -p XXXXX ssh").replace(/=no .+@/ig,"=no XXXXX@")}`, "debug");

            const executer = command.split(" ").splice(0, 1);
            const args = command.split(" ").splice(1, command.split(" ").length - 1);
    
            this._app = spawn(`${executer}`, args, {
                cwd: process.cwd(),
                env: process.env
            });
    
            this._app.stdout.on("data", (data) => {
                this._logger.log(`[Tunnel:${this._config.name}] ${data.toString().trim()}`);
            });
    
            this._app.stderr.on("data", (data) => {
                const message = data.toString().trim();
                if (message.includes("will not be allocated because stdin is not a terminal")) {
                    return;
                }
                this._logger.log(`[Tunnel:${this._config.name}] ${message}`);
            });
    
            this._app.on("close", (code) => {

                this._closeEvent(code);
    
            });
    
            this._app.on("error", (error) => {
                this._errorEvent(error);
            });

        } catch (error) {
            this._errorEvent(error);
        }

    }

    async stop (): Promise<void> {
        
        if (this._running_flag === false) {
            return;
        }

        this._running_flag = false;
        this._restarting_flag = false;

        clearTimeout(this._id_interval);

        this._app.kill();

    }

    _closeEvent (code: number): void {

        this._logger.log(`Tunnel "${this._config.name}" closed, with code ${code}`, "dev");

        if (this._config.critical === true) {
            this._logger.warn(`Tunnel "${this._config.name}" is critical`, "dev");
            this.emit("close", this._config.name);
            return;
        }

        if (this._config.restart === false) {
            this._running_flag = false;
            this.emit("close", this._config.name);
            return;
        }

        this._restart();
    }

    _errorEvent (error: Error): void {

        this._logger.error(`Tunnel "${this._config.name}" error.`);
        this._logger.log(error.message.replace(/sshpass -p .* ssh/ig, "/sshpass -p XXXXX ssh").replace(/=no .+@/ig,"=no XXXXX@"));

        if (this._config.restart === true) {
            this._restart();
            return;
        }

        this._running_flag = false;
        this.emit("error", this._config.name);

    }

    _restart (): void {

        this._restarting_flag = true;
    
        this._logger.log(`Restarting tunnel "${this._config.name}", after ${this._config.restart_interval} sec`);

        this._id_interval = setTimeout( () => {
            this._running_flag = false;
            this.run();
        }, this._config.restart_interval * 1000);

    }

    get name (): string {
        return this._config.name;
    }

    get enable (): boolean {
        return this._config.enable;
    }

}
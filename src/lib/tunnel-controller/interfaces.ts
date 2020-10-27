import { EventEmitter } from "events";

export interface ITunnelController extends EventEmitter {
    run: () => Promise<void>
    stop: () => Promise<void>
}
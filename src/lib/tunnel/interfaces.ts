import { EventEmitter } from "events";

export interface ITunnelConfig {
    name: string
    enable: boolean
    user: string
    password: string
    remote_host: string
    destination_host: string
    destination_port: number
    target_host: string
    target_port: number
    ssh_port: number
    critical: boolean
    restart: boolean
    restart_interval: number
}

export interface ITunnel extends EventEmitter {
    run: () => Promise<void>
    stop: () => Promise<void>
    readonly name: string
    readonly enable: boolean
}
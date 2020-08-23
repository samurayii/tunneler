import { EventEmitter } from "events";

export interface ILogger extends EventEmitter {
    log: (message: unknown, mode?: string) => void
    info: (message: unknown, mode?: string) => void
    error: (message: unknown, mode?: string) => void
    warn: (message: unknown, mode?: string) => void
    red: (message: unknown, mode?: string) => void
    yellow: (message: unknown, mode?: string) => void
    green: (message: unknown, mode?: string) => void
    cyan: (message: unknown, mode?: string) => void
}

export interface ILoggerConfig {
    mode: string
    enable: boolean
    timestamp: boolean
    type: boolean
}
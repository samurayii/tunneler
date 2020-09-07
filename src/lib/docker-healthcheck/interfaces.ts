export interface IDockerHealthcheck {
    run: () => void
}

export interface IDockerHealthcheckConfig {
    enable: boolean
    timeout: number
}
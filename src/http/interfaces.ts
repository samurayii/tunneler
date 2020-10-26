export interface IApiServerConfig {
    listening: string
    enable: boolean
    auth: boolean
    prefix: string
    proxy: boolean
    subdomain_offset: number
    proxy_header: string
    ips_count: number
}
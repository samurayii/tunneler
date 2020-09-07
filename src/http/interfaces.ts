export interface IApiServerConfig {
    listening: string
    enable: boolean
    auth: boolean
    prefix: string
    proxy: boolean
    subdomain_offset: number
    proxy_header: string
    ips_count: number
    parsing: {
        enable: boolean
        encoding: string
        form_limit: string
        json_limit: string
        text_limit: string
        text: boolean
        json: boolean
        multipart: boolean
        include_unparsed: boolean
        urlencoded: boolean
        json_strict: boolean
        methods: string[]
    }
}
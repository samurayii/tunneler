export interface IAuthorization {
    checkPassword: (username: string, password: string) => Promise<boolean>
    checkToken: (token: string) => Promise<boolean>
}

export interface IAuthorizationUser {
    username?: string
    password?: string
    token?: string
}

export interface IAuthorizationConfig {
    users: IAuthorizationUser[]
}
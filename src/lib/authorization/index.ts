import { 
    IAuthorizationConfig, 
    IAuthorization 
} from "./interfaces";

export * from "./interfaces";

export class Authorization implements IAuthorization {

    private readonly _list_users: {
        [key: string]: {
            type: string
            password?: string
        }
    }

    constructor (
        private readonly _config: IAuthorizationConfig
    ) {

        this._list_users = {};

        for (const item of this._config.users) {

            if (item.username !== undefined && item.password !== undefined) {
                this._list_users[item.username] = {
                    type: "basic",
                    password: item.password
                };
            }
            
            if (item.token !== undefined) {
                this._list_users[item.token] = {
                    type: "bearer"
                };
            }

        }

    } 

    checkPassword (username: string, password: string): Promise<boolean> {

        return new Promise( (resolve) => {

            if (this._list_users[username] === undefined) {
                return resolve(false);
            }

            const record = this._list_users[username];

            if (record.type !== "basic") {
                return resolve(false);
            }

            if (record.password !== password) {
                return resolve(false);
            }

            resolve(true);

        });

    }

    checkToken (token: string): Promise<boolean> {

        return new Promise( (resolve) => {

            if (this._list_users[token] === undefined) {
                return resolve(false);
            }

            const record = this._list_users[token];

            if (record.type !== "bearer") {
                return resolve(false);
            }

            resolve(true);

        });

    }

}
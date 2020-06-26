/* eslint-disable @typescript-eslint/ban-types */
import * as Ajv from "ajv";

export const validator = (config: object, schema: object): void => {

    if (typeof config === undefined) {
        throw new Error("Config is undefined");
    }

    if (typeof schema !== "object") {
        throw new Error("Schema must be object");
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(config);

    if (!valid) {
        throw new Error(`Schema errors:\n${JSON.stringify(validate.errors, null, 2)}`);
    }

};
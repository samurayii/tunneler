import * as fs from "fs";
import * as path from "path";
import * as TOML from "@iarna/toml";

// eslint-disable-next-line @typescript-eslint/ban-types
export const jtomler = (file_path: string): object => {

    if (typeof file_path !== "string") {
        throw new Error("File path must be string");
    }

    const full_file_path = path.resolve(process.cwd(), file_path);

    if (!fs.existsSync(full_file_path)) {
        throw new Error(`File ${full_file_path} not found.`);
    }

    const file_content = fs.readFileSync(full_file_path).toString();

    try {

        const result_json = JSON.parse(file_content);
        return result_json;

    } catch (error) {

        try {

            return TOML.parse(file_content);
    
        } catch (error) {
            throw new Error(`Parsing file ${full_file_path} failed. Error: ${error.message}`);
        }

    }

};
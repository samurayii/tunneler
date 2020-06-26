import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import options from "./lib/entry";
import * as path from "path";
import {jtomler} from "./helpers/jtomler";
import {validator} from "./helpers/schema-validator";
import * as config_schema from "./lib/config_schema.json";


const full_config_path = path.resolve(process.cwd(), options.config);
const config = jtomler(full_config_path);

validator(config, config_schema);

console.log(config);

const bootstrap = async () => {

  const app = await NestFactory.create(AppModule);

  await app.listen(3000);

};

bootstrap();

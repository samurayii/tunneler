import { NestFactory } from "@nestjs/core";
import config from "./lib/entry";








console.log(config);



const bootstrap = async () => {

  const app = await NestFactory.create(AppModule);

  await app.listen(3000);

};

bootstrap();
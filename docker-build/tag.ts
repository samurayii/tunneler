import { spawn } from "child_process";
import * as pkg from "./package.json";

const docker_cmd = spawn("docker", ["tag", `${pkg.docker_image}:${pkg.version}`, `${pkg.docker_image}:latest`], {
    cwd: __dirname
});

docker_cmd.stdout.on("data", (data) => {
  console.log(`${data.toString().trim()}`);
});

docker_cmd.stderr.on("data", (data) => {
  console.error(`${data.toString().trim()}`);
  process.exit(1);
});

docker_cmd.on("error", (error) => {
    console.log(error);
});
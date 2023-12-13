import { spawn } from "child_process";

export const runCode = (code: string): Promise<string> => {
  return new Promise((resolve) => {
    const child = spawn("python", ["-c", code]);

    let result = "";
    child.stdout.on("data", (data: Buffer | string) => {
      result += data.toString();
    });

    child.stderr.on("data", (data: Buffer | string) => {
      result += data.toString();
    });

    child.on("close", () => {
      resolve(result);
    });
  });
};

import { join } from "path";

const templateGlob = new Bun.Glob("**/*.ts");

const templatesDir = new URL("templates", import.meta.url).pathname;
const projectRoot = new URL("../..", import.meta.url).pathname;

type TemplateRenderer = (data: any) => Promise<string> | string;

const isTemplateRenderer = (template: any): template is TemplateRenderer => {
    return typeof template === "function";
};

for await (const file of templateGlob.scan({
    cwd: templatesDir,
})) {
    const { default: renderer } = await import(`${templatesDir}/${file}`);
    if (!isTemplateRenderer(renderer)) {
        console.log("Skipping", file);
        continue;
    }
    const data = { name: "John Doe" };

    let result = await renderer(data);
    if (file.endsWith(".md.ts")) {
        result = `<!-- This file was automatically generated. Do not edit it directly. -->\n${result}`;
    }
    const output = join(projectRoot, file.replace(/\.ts$/, ""));

    await Bun.write(output, result);
    console.log(`Generated ${output}`);
}

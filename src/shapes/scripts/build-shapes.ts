import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const modulesDir = join(process.cwd(), "src/shapes/modules");
const outputFile = join(process.cwd(), "src/shapes/odrl-shapes.ttl");

const files = readdirSync(modulesDir)
    .filter((file) => file.endsWith(".ttl"))
    .sort();

const mergedContent = files
    .map((file) => {
        const filePath = join(modulesDir, file);
        const content = readFileSync(filePath, "utf8").trim();
        return [
            "",
            content,
            ""
        ].join("\n");
    })
    .join("\n");

writeFileSync(outputFile, mergedContent, "utf8");

console.log(`Merged ${files.length} files into ${outputFile}`);
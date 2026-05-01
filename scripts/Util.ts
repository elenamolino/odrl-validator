import * as fs from "fs";


export function getConfigSync(path: string) {
    const data = fs.readFileSync(path, 'utf8');
    return JSON.parse(data);
}

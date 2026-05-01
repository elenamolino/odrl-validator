import * as path from "path"
import * as fs from "fs"
import { combineNotation3Files } from "./N3Util";
import { getConfigSync } from "./Util";

const ruleDir = path.join(path.dirname(__filename), "..", "src", "rules");

// initialize the rules as a ts file (constant)such that it can be used in the browser
function rules() {
    // load config
    const configPath = path.join(path.dirname(__filename), 'config.json');
    const config = getConfigSync(configPath);
    const fileNames: string[] = config.rules;
    const rulePaths = fileNames.map(fileName => path.join(ruleDir, fileName));
    
    // combine N3, unfortunately, no proper support yet
    const combinedRules = combineNotation3Files(rulePaths); 
    const rules = `export const RULES: string = \`${combinedRules}\`;`;
    fs.writeFileSync(path.join(ruleDir, "Rules.ts"), rules);
}

rules()


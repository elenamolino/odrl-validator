import * as path from "path"
import * as fs from "fs"
import { write } from "@jeswr/pretty-turtle"
import { Parser } from "n3"
import { Quad } from "@rdfjs/types";
import { getConfigSync } from "./Util";

const shapeDir = path.join(path.dirname(__filename), "..", "src", "shapes");

// initialize the shapes as a ts file (constant) such that it can be used in the browser
async function shapes() {
    // load config
    const configPath = path.join(path.dirname(__filename), 'config.json');
    const config = getConfigSync(configPath);
    const fileNames: string[] = config.shapes;
    const shapePaths = fileNames.map(fileName => path.join(shapeDir, fileName));


    // parse shapes
    const shapes: Quad[] = [];
    const parser = new Parser()
    for (const shapePath of shapePaths) {
        const shape = fs.readFileSync(shapePath, 'utf-8')
        // assuming ttl, yes I know there exist better parsers thanks to Ruben T
        shapes.push(...parser.parse(shape))
    }

    // write shape to string
    const shapeTSContent = `export const SHAPES: string = \`${await write(shapes, {
        prefixes: {
            cr: "https://w3id.org/force/compliance-report#",
            dct: "http://purl.org/dc/terms/",
            ex: "http://example.org/",
            foaf: "http://xmlns.com/foaf/0.1/",
            odrl: "http://www.w3.org/ns/odrl/2/",
            schema: "https://schema.org/",
            xsd: "http://www.w3.org/2001/XMLSchema#",
            dpv: "https://w3id.org/dpv#",
            sotw: "https://w3id.org/force/sotw#",
            sh: "http://www.w3.org/ns/shacl#"

        }
    })}\``;

    // write shapes to a ts file, this way we can use our library in the browser.
    // We could later also just host the shapes as well on some CDN, but that would make would introduce a dependency
    fs.writeFileSync(path.join(shapeDir, "Shapes.ts"), shapeTSContent);
}
shapes()


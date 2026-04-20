import { DataFactory, Writer } from "n3";
import { reason } from "eyeling";
const {quad,namedNode} = DataFactory
async function main(){
    const data = [
        quad(namedNode("http://example.org/socrates#Socrates"), namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), namedNode("http://example.org/socrates#Human")),
        quad(namedNode("http://example.org/socrates#Human"), namedNode("http://www.w3.org/2000/01/rdf-schema#subClassOf"), namedNode("http://example.org/socrates#Mortal")),
    ]
    const rules = `
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix : <http://example.org/socrates#>.
{
    ?S a ?A.
    ?A rdfs:subClassOf ?B.
} => {
    ?S a ?B.
}.
    `

    console.log(reason({ proofComments: false}, new Writer().quadsToString(data) + "\n" + rules))
    
}

main()
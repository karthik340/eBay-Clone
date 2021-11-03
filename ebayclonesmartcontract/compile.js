const path = require('path');
const eBayClonePath =path.resolve(__dirname,'contracts','EbayClones.sol');
const fs = require('fs');
const solc = require('solc');
const source = fs.readFileSync(eBayClonePath, 'utf8');
var input = {
    language: 'Solidity',
    sources: {
        'EbayClones.sol' : {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': [ '*' ]
            }
        }
    }
}; 
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const interface = output.contracts['EbayClones.sol'].EbayClone.abi;
const bytecode = output.contracts['EbayClones.sol'].EbayClone.evm.bytecode.object;
module.exports = {
    interface,
    bytecode,
}
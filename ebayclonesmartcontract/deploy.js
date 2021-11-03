const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile.js')
const provider = new HDWalletProvider(
    'kiss animal glove smoke hollow orange kitten property library orphan dynamic follow',
    'https://rinkeby.infura.io/v3/e5e9354dc8f142ed8d0cacb4702a0ecc'
);
const web3 = new Web3(provider)
let accounts;

const deploy = async () => {
    accounts=await web3.eth.getAccounts();
    console.log('attempting to deploy from account ',accounts[0])
    const result = await new web3.eth.Contract(interface)
    .deploy({data:'0x'+bytecode})
    .send({gas:'1000000',from:accounts[0]});
    console.log(interface);
    console.log('contract deployed to',result.options.address);
}

deploy();
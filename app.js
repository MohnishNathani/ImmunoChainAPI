// import * as ethers from "ethers";
// import * as express from "express";

// const app = express()

// const CONTRACT_ADDRESS = ""
// const ABI = require('./abi.json');

const ethers = require('ethers');
const ABI = require('./abi.json'); // Contract ABI
const provider = ethers.getDefaultProvider('goerli');

const inter = new ethers.utils.Interface(ABI);

(async() => {
  const tx = await provider.getTransaction('0xc4132266c1aa3b35bd834458eb5e53659c1e41043c266910ee365449bc7d2485');
    const decodedInput = inter.parseTransaction({ data: tx.data, value: tx.value});
    

    // Decoded Transaction
    // console.log({
    //     function_name: decodedInput.name,
    //     from: tx.from,
    //     to: decodedInput.args[0],
    //     erc20Value: Number(decodedInput.args[1])
    //   });  
    console.log(decodedInput);      
})();
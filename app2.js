const ethers = require('ethers');
const express = require('express');

const app = express()

const CONTRACT_ADDRESS = "0x7400313b94f5487fccb9f73bce25dc533bb47047";
const ABI = require('./abi.json'); 



app.get('/get', async(req, res)=>{
    const provider = ethers.getDefaultProvider('goerli');
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    try {
        const value = await contract.returnMed();
        res.send(value);
    } catch(e){
        res.send(e);
    }
})

app.get('/add', async (req, res)=>{
    const provider = ethers.getDefaultProvider('goerli');
    const wallet = ethers.Wallet.fromMnemonic("regret zoo shed luggage tackle above reunion afraid dinosaur matrix orphan river").connect(provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
    try {
        await contract.addMed("12-12-2020","mkn","4","1","10","ok","man");
        res.send("Successfully updated");
    } catch(e){
        res.send(e);
    }
})

app.get('/transactions',async(req,res)=>{
    const provider = ethers.getDefaultProvider('goerli');
    const wallet = ethers.Wallet.fromMnemonic("regret zoo shed luggage tackle above reunion afraid dinosaur matrix orphan river").connect(provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const inter = new ethers.utils.Interface(ABI);
    // provider.getTransaction('0xfc02c05c7cd09349afb913ef1059d0780211651c534ad914c5b6cb6253deabe6').then(function(tx) {
    //          const de = inter.parseTransaction({data:tx.data, value:tx.value});
    //          console.log(de); 
    //         });
    provider.getLogs({address:CONTRACT_ADDRESS}).then((mylog)=>{
        // const decodedEvents = inter.decodeEventLog("Update",mylog[0].data);
        // const decodedEvents = mylog.map(async (log) => await inter.decodeEventLog("Update",log.data)) ;
        // console.log(decodedEvents);
        mylog.forEach((log)=>{console.log(inter.decodeEventLog(log.topics[0],log.data))});
    })
    
})



app.listen(5000);
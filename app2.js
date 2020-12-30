const ethers = require('ethers');
const express = require('express');

const app = express()

const CONTRACT_ADDRESS = "0x2c53e24933a56efd33338db401cabceaea10659a";
const ABI = require('./abi.json'); 
const provider = ethers.getDefaultProvider('goerli');
const inter = new ethers.utils.Interface(ABI);
const wallet = ethers.Wallet.fromMnemonic("regret zoo shed luggage tackle above reunion afraid dinosaur matrix orphan river").connect(provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);


app.get('/getmed/:uuid', async(req, res)=>{
    try {
        const value = await contract.getMed(req.params.uuid);
        console.log("Get data of uuid : "+req.params.uuid);
        res.send(value);
    } catch(e){
        res.send(e);
    }
})

app.get('/getbatch/:batchid', async(req, res)=>{
    try {
        const value = await contract.getBatch(req.params.batchid);
        console.log("Get batch of uuid : "+req.params.batchid);
        const count = parseInt(value[1],16).toString();
        const temp = parseInt(value[2],16).toString()
        res.send({"uuid":value[0], "count":count, "temperature":temp});
    } catch(e){
        res.send(e);
    }
})

app.get('/add/:batchid', async (req, res)=>{

    try {
        const value = await contract.getBatch(req.params.batchid);
        const count = parseInt(value[1],16).toString();
        const uuid = await contract.addMed(req.params.batchid,"Ovesh","1-10-20",5);
        console.log("Added successfully");
        res.send("Successfully updated");
    } catch(e){
        res.send(e);
    }
})

app.get('/transactions/:uuid',async(req,res)=>{

        var mylog = [];
        var count = 1;
        while(mylog.length==0){
            console.log("Log attempt: "+count);
            mylog = await provider.getLogs({address:CONTRACT_ADDRESS})
            count++;
        }
        console.log("Logs Fetched Successfully");

        var logarray = [];
        mylog.forEach((log)=>{
        var logdata = inter.decodeEventLog(log.topics[0],log.data)
        if(logdata.uuid  === req.params.uuid){
            logarray.push(logdata);
        }
    })
    res.send(logarray);
})

app.listen(5000);

// provider.getTransaction('0xfc02c05c7cd09349afb913ef1059d0780211651c534ad914c5b6cb6253deabe6').then(function(tx) {
//          const de = inter.parseTransaction({data:tx.data, value:tx.value});
//          console.log(de); 
//         });

// const decodedEvents = inter.decodeEventLog("Update",mylog[0].data);
// const decodedEvents = mylog.map(async (log) => await inter.decodeEventLog("Update",log.data)) ;
// console.log(decodedEvents);

// provider.getLogs({address:CONTRACT_ADDRESS}).then((mylog)=>{
//     var logarray = [];
//     mylog.forEach((log)=>{
//         var logdata = inter.decodeEventLog(log.topics[0],log.data)
//         if(logdata.uuid  === req.params.uuid){
//             logarray.push(logdata);
//         }
//     });
//     res.send(logarray);
// })
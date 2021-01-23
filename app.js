const ethers = require('ethers');
const express = require('express');
var bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());

const CONTRACT_ADDRESS = "0x178c8C469D2F926CF9820daa624997BB6d5805A6";
const ABI = require('./abi.json'); 
const provider = ethers.getDefaultProvider('rinkeby');
const inter = new ethers.utils.Interface(ABI);
const wallet = ethers.Wallet.fromMnemonic("regret zoo shed luggage tackle above reunion afraid dinosaur matrix orphan river").connect(provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);


app.get('/getmed', async(req, res)=>{
    try {
        const value = await contract.getMed(req.query.uuid);
        console.log("Get data of uuid : "+req.query.uuid);
        const temp = parseInt(value[4],16).toString();
        res.send({"uuid":value[0], "batch_uuid":value[1],"name":value[2],"timestamp":value[3],"temperature":temp});
    } catch(e){
        res.send(e);
    }
})

app.get('/getbatch', async(req, res)=>{
    try {
        const value = await contract.getBatch(req.query.batchid);
        console.log("Get batch of uuid : "+req.query.batchid);
        const count = parseInt(value[1],16).toString();
        const temp = parseInt(value[2],16).toString();
        res.send({"uuid":value[0], "count":count, "temperature":temp});
    } catch(e){
        res.send(e);
    }
})

app.post('/track', async(req, res)=>{
    try {
        var batchid = req.body.batchid;
        var temperature = req.body.temperature;
        var pressure = req.body.pressure;
        var lat = req.body.latitude;
        var long = req.body.longitude;
        var authority = req.body.authority;
        var timestamp = req.body.timestamp;
        var healthscore = req.body.healthscore;

        await contract.addLog(batchid,temperature,pressure,lat,long,authority,timestamp,healthscore);
        console.log("Tracking Post request submitted");
        res.send("Tracking Post request submitted succesfully");
    } catch(e){
        res.send(e);
    }
})

app.post('/add', async (req, res)=>{

    try {
        var batchid = req.body.batchid;
        var uuid = req.body.uuid;
        var name = req.body.name;
        var timestamp = req.body.mfd;
        var temperature = req.body.temperature;
        await contract.addMed(uuid,batchid,name,timestamp,temperature);
        console.log("Added successfully");
        res.send("Successfully updated");
    } catch(e){
        res.send(e);
    }
})

app.get('/transactions',async(req,res)=>{

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
        if(logdata.uuid  === req.query.uuid){
            // logarray.push(logdata);
            logarray.push({"uuid":logdata[0], "name":logdata[1], "message":logdata[2]});
        }
    })
    res.send(logarray);
})

app.get('/transactions/batch',async(req,res)=>{

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
    if(logdata.uuid  === req.query.batchid){
        // logarray.push(logdata);
        var temp = parseInt(logdata[1],16).toString();
        var pressure = parseInt(logdata[2],16).toString();
        var healthscore = parseInt(logdata[7],16).toString();
        logarray.push({"batch_uuid":logdata[0], "temperature":temp, "pressure":pressure,"latitude":logdata[3],"longitude":logdata[4],"authority":logdata[5], "timestamp":logdata[6],"healthscore":healthscore});
    }
})
res.send(logarray);
console.log(logarray);
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
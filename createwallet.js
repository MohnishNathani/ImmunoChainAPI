const fs = require("fs");
const wallet = require("ethereumjs-wallet").default;

const pk = new Buffer.from('0135a92676c6d02390830e98866b10149b833147909032c2a036244850974aa9', 'hex'); // replace by correct private key
const account = wallet.fromPrivateKey(pk);
const password = 'insane' // will be required to unlock/sign after importing to a wallet like MyEtherWallet
account.toV3(password).then((val)=>{
    const content = JSON.stringify(val);
    // writes to a file
const address = account.getAddress().toString('hex')
const file = `insanewallet`;
fs.writeFileSync(file, content);
})


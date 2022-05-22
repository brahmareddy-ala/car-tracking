'use strict';

const fs = require('fs');
const { Wallets } = require('fabric-network');
const testNetworkPath = path.resolve(require('os').homedir(),'go/src/github.com/hyperledger/fabric-samples/test-network');

async function main() {

    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');
        const adminUserPath = path.join(testNetworkPath, '/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com');
        const mspFolderPath = path.join(adminUserPath, '/msp');

        const certFile = path.join(mspFolderPath, '/signcerts/', fs.readdirSync(path.join(mspFolderPath, '/signcerts'))[0]);
        const keyFile = path.join(mspFolderPath, '/keystore/', fs.readdirSync(path.join(mspFolderPath, '/keystore'))[0]);
        
        const cert = fs.readFileSync(certFile).toString();
        const key = fs.readFileSync(keyFile).toString();
  
        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org2MSP',
            type: 'X.509',
        };
  
        await wallet.import("admin", identity);

    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

module.exports.execute = main;
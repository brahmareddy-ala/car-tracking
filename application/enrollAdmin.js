'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const testNetworkPath = path.resolve(require('os').homedir(),'go/src/github.com/hyperledger/fabric-samples/test-network');

async function main() {
    try {
        const wallet = await Wallets.newFileSystemWallet('./wallet');

		let connectionProfile = JSON.parse(fs.readFileSync(
			path.join(testNetworkPath, 
				'organizations/peerOrganizations/org1.example.com/connection-org1.json'), 'utf8')
		);

        const ca = new FabricCAServices(connectionProfile['certificateAuthorities']['ca.org1.example.com'].url);

        const existingIdentity = await wallet.get('admin');
        if (existingIdentity) {
            throw new Error('An identity for the admin user already exists in the wallet');
        }
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', identity);
    } catch (error) {
        console.error(`Failed to enroll admin user: ${error}`);
    }
}

module.exports.execute = main;
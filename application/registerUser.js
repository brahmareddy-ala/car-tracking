'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
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

        const userIdentity = await wallet.get('user1');
        if (userIdentity) {
            console.log('An identity for the user1 already exists in the wallet');
            return;
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            throw new Error('An identity for the admin user does not exist in the wallet. Run the enrollAdmin.js application before retrying');
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        const secret = await ca.register({
            enrollmentID: 'user1',
            role: 'client'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: 'user1',
            enrollmentSecret: secret
        });
        const identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('user1', identity);
        console.log('Successfully registered and enrolled user1 and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user: ${error}`);
        throw new Error(error);
    }
}

module.exports.execute = main;

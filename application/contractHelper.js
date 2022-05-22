'use strict';

const fs = require('fs');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

let gateway;

const testNetworkRoot = path.resolve(require('os').homedir(),'go/src/github.com/hyperledger/fabric-samples/test-network');

async function getContractInstance() {
	try {
		gateway = new Gateway();
		const wallet = await Wallets.newFileSystemWallet('./wallet');

		let connectionProfile = JSON.parse(fs.readFileSync(
			path.join(testNetworkRoot, 
				'organizations/peerOrganizations/org1.example.com/connection-org1.json'), 'utf8')
		);
		
		let connectionOptions = {
			identity: "admin",
			wallet: wallet,
			discovery: {enabled: true, asLocalhost: true}
		};

		await gateway.connect(connectionProfile, connectionOptions);
		const network = await gateway.getNetwork('mychannel');

		return network.getContract('CarTracking');
	} catch (error) {
		console.log(`Error getting contract instance. ${error}`);
		console.log(error.stack);
	}
}

function disconnect() {
	console.log('Disconnecting from Fabric Gateway');
	gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;
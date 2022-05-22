'use strict';

const contractHelper = require('./contractHelper');

async function main(id, owner) {
	try {
        const carTrackingContract = await contractHelper.getContractInstance();        
		const response = await carTrackingContract.submitTransaction('sellCar', id, owner);
		if (`${response}` !== '') {
            console.log(`Response from sellCar: ${response}`);
        }
		return response;

	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	}
}

module.exports.execute = main;
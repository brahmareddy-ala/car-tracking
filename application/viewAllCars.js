'use strict';

const contractHelper = require('./contractHelper');

async function main() {
	try {
        const carTrackingContract = await contractHelper.getContractInstance();        
		const response = await carTrackingContract.submitTransaction('viewAllCars');
		if (`${response}` !== '') {
            console.log(`Response from viewAllCars: ${response}`);
        }
		return response;

	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	}
}

module.exports.execute = main;
'use strict';

const contractHelper = require('./contractHelper');

async function main(id) {
	try {
        const carTrackingContract = await contractHelper.getContractInstance();        
		const response = await carTrackingContract.submitTransaction('viewCar', id);
		if (`${response}` !== '') {
            console.log(`Response from viewCar: ${response}`);
        }
		return response;

	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	}
}

module.exports.execute = main;
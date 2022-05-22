'use strict';

const contractHelper = require('./contractHelper');

async function main(id, color, make, model, owner) {
	try {
        const carTrackingContract = await contractHelper.getContractInstance();
		const response = await carTrackingContract.submitTransaction('createCar', id, color, make, model, owner);
		if (`${response}` !== '') {
            console.log(`Response from createCar: ${response}`);
        }
		return response;

	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	}
}

module.exports.execute = main;
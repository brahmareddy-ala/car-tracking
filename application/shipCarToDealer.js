'use strict';

const contractHelper = require('./contractHelper');

async function main(id, dealer) {
	try {
        const carTrackingContract = await contractHelper.getContractInstance();        
		const response = await carTrackingContract.submitTransaction('shipCarToDealer', id, dealer);
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
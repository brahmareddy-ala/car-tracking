'use strict';

const {Contract} = require('fabric-contract-api');

const CarStatus = Object.freeze({CREATED: 1, READY_FOR_SALE: 2, SOLD: 3});
const objType = 'Car';

class CarTracking extends Contract {

    constructor() {
        super("org.car-tracking-network.carnet");
    }

    async viewCar(ctx, objType, id) {
        return await this._getCar(ctx, objType, id);
    }

    async createCar(ctx, id, make, model, color, owner) {
        if ("Org1MSP" !== ctx.clientIdentity.getMSPID()) {
            throw new Error(`unauthorized access: only manufaturer can add a new car`);
        }
        if (await this._carExists(ctx,objType, id)) {
            throw new Error(`the assset ${objType} with Id ${id} already exists`);
        }

        const car = {
            color: color,
            make: make,
            model: model,
            owner: owner,
            status: CarStatus.CREATED
        };

        await this._putCar(ctx, objType, car);
    }

    async shipCarToDealer(ctx, id, dealer) {
        if ("Org1MSP" !== ctx.clientIdentity.getMSPID()) {
            throw new Error(`unauthorized access: only manufaturer can ship the car to dealer`);
        }
        let car = await this._getCar(ctx, objType, id);
        car.owner = dealer;
        car.status = CarStatus.READY_FOR_SALE;
        await this._putCar(ctx, objType, car);
    }

    async sellCar(ctx, id, owner) {
        if ("Org2MSP" !== ctx.clientIdentity.getMSPID()) {
            throw new Error(`unauthorized access: only dealers can sell the car`);
        }
        let car = await this._getCar(ctx, objType, id);
        car.owner = owner;
        car.status = CarStatus.SOLD;
        await this._putCar(ctx, objType, car);
    }

    async viewAllCars(ctx) {
        const iteratorPromise = ctx.stub.getStateByPartialCompositeKey(this.getName().join(":").join(objType), []); 
     
        let results = [];
        for await (const res of iteratorPromise) {
            const splitKey = ctx.stub.splitCompositeKey(res.key);
            results.push({
                objType: splitKey.objectType,
                key: splitKey.attributes[0],
                value: res.value.toString()
            });
        }
     
        return JSON.stringify(results);
     }

     async getCarHistory(ctx, id) {
        const compositeKey = this._createCompositeKey(ctx, objType, id);

        const iteratorPromise = ctx.stub.getHistoryForKey(compositeKey);
        let history = [];
        for await(const res of iteratorPromise) {
            history.push({
                txId: res.txId,
                value: res.value.toString(),
                isDelete: res.isDelete
            });
        }

        return JSON.stringify({
            objectType: objType,
            key: key,
            values: history
        });
    }

    async _carExists(ctx, objType, id) {
        const compositeKey = this._createCompositeKey(objType,[id]);

        let carBytes = await ctx.stub.getState(compositeKey);
        return carBytes && carBytes.length > 0;
    }

    async _getCar(ctx, objType, id) {
        const compositeKey = this._createCompositeKey(objType,[id]);

        let carBytes = await ctx.stub.getState(compositeKey);
        if(!carBytes || carBytes.length == 0) {
            throw new Error(`the car with Id ${id} does not exist`);
        }
        return JSON.parse(carBytes.toString());
    }

    async _putCar(ctx, objType, car) {
        const compositeKey = this._createCompositeKey(objType,[car.id]);
        await ctx.stub.putState(compositeKey, Buffer.from(JSON.stringify(asset)));
    }

    _createCompositeKey(ctx, objType, key) {
        if (!key || key === "") {
            throw new Error(`A key should be a non-empty string`);
        }
        if (objType === "") {
            return key;
        }
        return ctx.stub.createCompositeKey(this.getName().join(":").join(objType), [key]);
    }
}

module.exports = CarTracking;
'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const addToWallet_Manufacturer = require('./addToWallet_Manufacturer');
const addToWallet_Dealer = require('./addToWallet_Dealer');
const enrollAdmin = require('./enrollAdmin');
const registerUser = require('./registerUser');
const addCar = require('./addCar');
const shipCarToDealer = require('./shipCarToDealer');
const sellCar = require('./sellCar');
const viewCarHistory = require('./viewCarHistory');
const viewCarState = require('./viewCarState');
const viewAllCars = require('./viewAllCars');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('title', 'Car Tracking App');

app.get('/', (req, res) => res.send('Car Tracking App'));

app.post('/addToWallet', (req, res) => {
	addToWallet_Manufacturer.execute()
    .then(() => {
        console.log('Manufacturer credentials successfully added to wallet');
        const result = {
            status: 'success',
            message: 'Manufacturer credentials successfully added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/addToWallet', (req, res) => {
	addToWallet_Dealer.execute()
    .then(() => {
        console.log('Dealer credentials successfully added to wallet');
        const result = {
            status: 'success',
            message: 'Dealer credentials successfully added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/enrollAdmin', (req, res) => {
	enrollAdmin.execute()
    .then(() => {
        console.log('Admin credentials successfully added to wallet');
        const result = {
            status: 'success',
            message: 'Admin credentials successfully added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/registerUser', (req, res) => {
	registerUser.execute()
    .then(() => {
        console.log('User credentials successfully added to wallet');
        const result = {
            status: 'success',
            message: 'User credentials successfully added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/addCar', (req, res) => {
	addCar.execute(req.body.id, req.body.color, req.body.make, req.body.model, req.body.owner)
    .then((car) => {
        const result = {
            status: 'success',
            message: 'New Car Added',
            car: car
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/shipCarToDealer', (req, res) => {
	shipCarToDealer.execute(req.body.id, req.body.dealer)
    .then((car) => {
        const result = {
            status: 'success',
            message: 'Car Shipped to Dealer',
            car: car
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/sellCar', (req, res) => {
	sellCar.execute(req.body.id, req.body.owner)
    .then((car) => {
        const result = {
            status: 'success',
            message: 'Car Sold to owner',
            car: car
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/viewCarHistory', (req, res) => {
	viewCarHistory.execute(req.body.id)
    .then((car) => {
        const result = {
            status: 'success',
            message: 'Car History',
            car: car
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/viewCarState', (req, res) => {
	viewCarState.execute(req.body.id)
    .then((car) => {
        const result = {
            status: 'success',
            message: 'Car Current State',
            car: car
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/viewAllCars', (req, res) => {
	viewAllCars.execute()
    .then((cars) => {
        const result = {
            status: 'success',
            message: 'All Cars',
            cars: cars
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.listen(port, () => console.log(`Car Tracking App listening on port ${port}!`));
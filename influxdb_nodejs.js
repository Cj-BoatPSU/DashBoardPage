const express = require('express');
const app = express();
const Influx = require('influxdb-nodejs');
const client = new Influx(`http://mydb:cjboat@127.0.0.1:8086/db_version2`);
const cors = require('cors');
const fs = require('fs');
const { Server } = require('./modules/config.js');

app.use(express.static('public'));
app.use(express.json());
app.use(cors({ origin: true }));


fs.readFile("modules/config.js", 'utf-8', function(err, data) {
    // Check for errors 
    if (err) throw err;
    console.log(Server.ip_address);
    // console.log(FIREBASE_CONFIG.appId);

});



app.post('/save-config-device', (req, res) => {
    let all_devices = [];
    all_devices = req.body;
    fs.writeFile("config_device.json", JSON.stringify(all_devices), err => {

        // Checking for errors 
        if (err) throw err;

        console.log("Done writing"); // Success 
    });
    res.send('save config_device.json success!!');
});


app.get('/init-config-device', (req, res) => {

    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        // Converting to JSON 
        const users = JSON.parse(data);
        res.json(users);
        // console.log(users);   
    });
});

app.post('/postJSON-config-device', (req, res) => {
    console.log("POST DATA success!!");
    console.log(req.body[0]);
    console.log(typeof req.body[0].device_name);
    // res.json(req.body);
});


app.get('/Queryinfluxdb', (req, res) => {
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        // console.log(config_device[0].location);
        let reader = Query_influxDB(config_device);
        reader.then(data => {
            console.info(data);
            res.json(data);
        }).catch(err => {
            console.error(err);
        });
    });

});

async function Query_influxDB(config_device) {
    let tmp = [];
    console.log(`Config device : ${config_device.length}`);
    for (let i = 0; i < config_device.length; i++) {
        // console.log(config_device[i].location);
        const reader = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'front rack');
        reader.order = 'desc';
        let temp_front = await reader.then(function(data) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return data.results[0].series[0].values[0];
            })
            .catch(err => console.log('Request Failed', err));
        let reader1 = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'behind rack');
        reader1.order = 'desc';
        let temp_behind = await reader1.then(function(data) {

                return data.results[0].series[0].values[0];
            })
            .catch(err => console.log('Request Failed', err));
        let reader2 = client.query('humidity').where('location', `${config_device[i].location}`);
        reader2.order = 'desc';
        let humidity = await reader2.then(function(data) {

                return data.results[0].series[0].values[0];
            })
            .catch(err => console.log('Request Failed', err));


        tmp.push(temp_front);
        tmp.push(temp_behind);
        tmp.push(humidity);
    }

    return tmp;
}


app.listen(8081, function() {
    console.log("Welcome to influxdb-nodejs listen port 8081");
})
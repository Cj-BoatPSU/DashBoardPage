const express = require('express');
const app = express();
const Influx = require('influxdb-nodejs');
const client = new Influx('http://mydb:cjboat@127.0.0.1:8086/db_version2');
const cors = require('cors');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.json());
app.use(cors({ origin: true }));


app.get('/influxdb/rack1/temperature/frontrack', (req, res) => {
    const reader = client.query('temperature').where('location', 'rack1').where('position', 'front rack');
    reader.order = 'desc';
    reader.then(data => {
        console.info(data.results[0].series[0].values[0]);
        // res.send('OK');
        res.json({
            location: data.results[0].series[0].values[0][1],
            position: data.results[0].series[0].values[0][2],
            value: data.results[0].series[0].values[0][3]
        });
    }).catch(err => {
        console.error(err);
    });

});

app.get('/influxdb/rack1/temperature/behindrack', (req, res) => {
    const reader = client.query('temperature').where('location', 'rack1').where('position', 'behind rack');
    reader.order = 'desc';
    reader.then(data => {
        console.info(data.results[0].series[0].values[0]);
        // res.send('OK');
        res.json({
            location: data.results[0].series[0].values[0][1],
            position: data.results[0].series[0].values[0][2],
            value: data.results[0].series[0].values[0][3]
        });
    }).catch(err => {
        console.error(err);
    });

});

app.get('/influxdb/rack1/humidity', (req, res) => {
    const reader = client.query('humidity').where('location', 'rack1');
    reader.order = 'desc';
    reader.then(data => {
        console.info(data.results[0].series[0].values[0]);
        // res.send('OK');
        res.json({
            location: data.results[0].series[0].values[0][1],
            value: data.results[0].series[0].values[0][2],
        });
    }).catch(err => {
        console.error(err);
    });

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

    fs.readFile("config_device.json", function(err, data) {
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





app.listen(8081, function() {
    console.log("Welcome to influxdb-nodejs listen port 8081");
})
const express = require('express');
const app = express();
const Influx = require('influxdb-nodejs');
const client = new Influx('http://mydb:cjboat@127.0.0.1:8086/db_version2');
const cors = require('cors');

app.use(express.static('public'));
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




app.listen(8081, function() {
    console.log("Welcome to influxdb-nodejs listen port 8081");
})
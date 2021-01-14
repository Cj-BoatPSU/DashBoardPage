const fetch = require("node-fetch");

fetch('http://127.0.0.1:8081/influxdb/lack1/temperature/frontlack')
    .then(response => response.json())
    .then((json_value) => {
        console.log(json_value);

    }).catch(err => console.log('Request Failed', err));
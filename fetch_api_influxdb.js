const fetch = require("node-fetch");

fetch('http://127.0.0.1:8081/influxdb/rack1/temperature/frontrack')
    .then(response => response.json())
    .then((json_value) => {
        console.log(json_value);

    }).catch(err => console.log('Request Failed', err));
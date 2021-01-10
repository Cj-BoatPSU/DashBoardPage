fetch('http://127.0.0.1:8081/influxdb/lack1')
    // .then(response => JSON.stringify(response))
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(err => console.log('Request Failed', err));
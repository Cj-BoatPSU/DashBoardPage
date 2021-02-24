const express = require('express');
const app = express();
const Influx = require('influxdb-nodejs');
const cors = require('cors');
const fs = require('fs');
const LineAPI = require('line-api');
var nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const serviceAccount = require('./modules/serviceAccountKey.json');

const { Server, FIREBASE_CONFIG } = require('./modules/config.js');
const client = new Influx(`http://mydb:cjboat@${Server.ip_address}:${Server.port}/db_version2`);
// const client = new Influx(`http://mydb:cjboat@127.0.0.1:8086/db_version2`);
// const client = new Influx(`http://mydb:cjboat@10.100.100.200:8086/db_version2`);
app.use(express.static('public'));
app.use(express.json());
app.use(cors({ origin: true }));

//Global variable
var time_hours_start = ["00:00:00Z", "00:10:00Z", "00:20:00Z", "00:30:00Z", "00:40:00Z", "00:50:00Z",
    "01:00:00Z", "01:10:00Z", "01:20:00Z", "01:30:00Z", "01:40:00Z", "01:50:00Z",
    "02:00:00Z", "02:10:00Z", "02:20:00Z", "02:30:00Z", "02:40:00Z", "02:50:00Z",
    "03:00:00Z", "03:10:00Z", "03:20:00Z", "03:30:00Z", "03:40:00Z", "03:50:00Z",
    "04:00:00Z", "04:10:00Z", "04:20:00Z", "04:30:00Z", "04:40:00Z", "04:50:00Z",
    "05:00:00Z", "05:10:00Z", "05:20:00Z", "05:30:00Z", "05:40:00Z", "05:50:00Z",
    "06:00:00Z", "06:10:00Z", "06:20:00Z", "06:30:00Z", "06:40:00Z", "06:50:00Z",
    "07:00:00Z", "07:10:00Z", "07:20:00Z", "07:30:00Z", "07:40:00Z", "07:50:00Z",
    "08:00:00Z", "08:10:00Z", "08:20:00Z", "08:30:00Z", "08:40:00Z", "08:50:00Z",
    "09:00:00Z", "09:10:00Z", "09:20:00Z", "09:30:00Z", "09:40:00Z", "09:50:00Z",
    "10:00:00Z", "10:10:00Z", "10:20:00Z", "10:30:00Z", "10:40:00Z", "10:50:00Z",
    "11:00:00Z", "11:10:00Z", "11:20:00Z", "11:30:00Z", "11:40:00Z", "11:50:00Z",
    "12:00:00Z", "12:10:00Z", "12:20:00Z", "12:30:00Z", "12:40:00Z", "12:50:00Z",
    "13:00:00Z", "13:10:00Z", "13:20:00Z", "13:30:00Z", "13:40:00Z", "13:50:00Z",
    "14:00:00Z", "14:10:00Z", "14:20:00Z", "14:30:00Z", "14:40:00Z", "14:50:00Z",
    "15:00:00Z", "15:10:00Z", "15:20:00Z", "15:30:00Z", "15:40:00Z", "15:50:00Z",
    "16:00:00Z", "16:10:00Z", "16:20:00Z", "16:30:00Z", "16:40:00Z", "16:50:00Z",
    "17:00:00Z", "17:10:00Z", "17:20:00Z", "17:30:00Z", "17:40:00Z", "17:50:00Z",
    "18:00:00Z", "18:10:00Z", "18:20:00Z", "18:30:00Z", "18:40:00Z", "18:50:00Z",
    "19:00:00Z", "19:10:00Z", "19:20:00Z", "19:30:00Z", "19:40:00Z", "19:50:00Z",
    "20:00:00Z", "20:10:00Z", "20:20:00Z", "20:30:00Z", "20:40:00Z", "20:50:00Z",
    "21:00:00Z", "21:10:00Z", "21:20:00Z", "21:30:00Z", "21:40:00Z", "21:50:00Z",
    "22:00:00Z", "22:10:00Z", "22:20:00Z", "22:30:00Z", "22:40:00Z", "22:50:00Z",
    "23:00:00Z", "23:10:00Z", "23:20:00Z", "23:30:00Z", "23:40:00Z", "23:50:00Z"
];
var time_hours_end = ["00:10:00Z", "00:20:00Z", "00:30:00Z", "00:40:00Z", "00:50:00Z",
    "01:00:00Z", "01:10:00Z", "01:20:00Z", "01:30:00Z", "01:40:00Z", "01:50:00Z",
    "02:00:00Z", "02:10:00Z", "02:20:00Z", "02:30:00Z", "02:40:00Z", "02:50:00Z",
    "03:00:00Z", "03:10:00Z", "03:20:00Z", "03:30:00Z", "03:40:00Z", "03:50:00Z",
    "04:00:00Z", "04:10:00Z", "04:20:00Z", "04:30:00Z", "04:40:00Z", "04:50:00Z",
    "05:00:00Z", "05:10:00Z", "05:20:00Z", "05:30:00Z", "05:40:00Z", "05:50:00Z",
    "06:00:00Z", "06:10:00Z", "06:20:00Z", "06:30:00Z", "06:40:00Z", "06:50:00Z",
    "07:00:00Z", "07:10:00Z", "07:20:00Z", "07:30:00Z", "07:40:00Z", "07:50:00Z",
    "08:00:00Z", "08:10:00Z", "08:20:00Z", "08:30:00Z", "08:40:00Z", "08:50:00Z",
    "09:00:00Z", "09:10:00Z", "09:20:00Z", "09:30:00Z", "09:40:00Z", "09:50:00Z",
    "10:00:00Z", "10:10:00Z", "10:20:00Z", "10:30:00Z", "10:40:00Z", "10:50:00Z",
    "11:00:00Z", "11:10:00Z", "11:20:00Z", "11:30:00Z", "11:40:00Z", "11:50:00Z",
    "12:00:00Z", "12:10:00Z", "12:20:00Z", "12:30:00Z", "12:40:00Z", "12:50:00Z",
    "13:00:00Z", "13:10:00Z", "13:20:00Z", "13:30:00Z", "13:40:00Z", "13:50:00Z",
    "14:00:00Z", "14:10:00Z", "14:20:00Z", "14:30:00Z", "14:40:00Z", "14:50:00Z",
    "15:00:00Z", "15:10:00Z", "15:20:00Z", "15:30:00Z", "15:40:00Z", "15:50:00Z",
    "16:00:00Z", "16:10:00Z", "16:20:00Z", "16:30:00Z", "16:40:00Z", "16:50:00Z",
    "17:00:00Z", "17:10:00Z", "17:20:00Z", "17:30:00Z", "17:40:00Z", "17:50:00Z",
    "18:00:00Z", "18:10:00Z", "18:20:00Z", "18:30:00Z", "18:40:00Z", "18:50:00Z",
    "19:00:00Z", "19:10:00Z", "19:20:00Z", "19:30:00Z", "19:40:00Z", "19:50:00Z",
    "20:00:00Z", "20:10:00Z", "20:20:00Z", "20:30:00Z", "20:40:00Z", "20:50:00Z",
    "21:00:00Z", "21:10:00Z", "21:20:00Z", "21:30:00Z", "21:40:00Z", "21:50:00Z",
    "22:00:00Z", "22:10:00Z", "22:20:00Z", "22:30:00Z", "22:40:00Z", "22:50:00Z",
    "23:00:00Z", "23:10:00Z", "23:20:00Z", "23:30:00Z", "23:40:00Z", "23:50:00Z", "23:59:59Z"
];

console.log("Server InfluxDB IP : " + Server.ip_address);
console.log("Server InfluxDB Port : " + Server.port);
//initial Cloud firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://datacenterdashborad-project-default-rtdb.firebaseio.com"
});
const db = admin.firestore();
var profileInfo = db.collection("profileUser").doc("profile-info");

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


app.get('/Queryinfluxdb', (req, res) => {
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        var date = new Date();
        var date_str = date.toISOString().substr(0, 10);
        // var date_str1 = date.toISOString().substring(0, 10);
        // console.log(date_str1);
        // console.log(config_device[0].location);
        let reader = Query_influxDB_Gauge(config_device, date_str);
        reader.then(data => {
            console.info('/Queryinfluxdb');
            console.info(data);
            res.json(data);
        }).catch(err => {
            console.error(err);
        });
    });

});

app.get('/Queryinfluxdb_HistoryGraph', (req, res) => {
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        var date = new Date();
        var date_str = date.toISOString().substr(0, 10);
        // var date_str1 = date.toISOString().substring(0, 11);
        // console.log(date_str1);
        console.info('/Queryinfluxdb_HistoryGraph');
        let reader = Query_influxDB_HistoryGraph_OlderDay(config_device, date_str);
        reader.then(data => {
            let results = separate_value(data);
            res.json(results);
        }).catch(err => {
            console.error(err);
        });
    });
});

app.get('/Queryinfluxdb_HistoryGraph_OlderDay', (req, res) => {
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        console.info('/Queryinfluxdb_HistoryGraph_OlderDay');
        let reader = Query_influxDB_HistoryGraph_OlderDay(config_device, "2021-01-13");
        reader.then(data => {
            // console.info(data);
            let results = separate_value(data);
            res.json(results);
        }).catch(err => {
            console.error(err);
        });
    });
});


app.get('/Queryinfluxdb_HistoryGraph_Month', (req, res) => {
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        console.info('/Queryinfluxdb_HistoryGraph_Month');
        let reader = Query_influxDB_HistoryGraph_OlderDay(config_device, "2021-01-13");
        reader.then(data => {
            // console.info(data);
            let results = separate_value(data);
            res.json(results);
        }).catch(err => {
            console.error(err);
        });
    });
});


app.post('/search-history', (req, res) => {
    var date = req.body;
    var date_json_str = JSON.stringify(date.date_history);
    var date_str = date_json_str.slice(1, date_json_str.length - 1);
    console.log("-----------------------------");
    console.log(date_str);
    console.info('/search-history');
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);

        let reader = Query_influxDB_HistoryGraph_OlderDay(config_device, date_str);
        reader.then(data => {

            if (data.length > 0) {
                console.log("Data found");
                let results = separate_value(data);
                res.json(results);
            } else {
                console.log("Data not found");
                let message_json = { message: "Data not found" };
                res.json(message_json);
            }

        }).catch(err => {
            console.error(err);
        });
    });

});

app.post('/Query-of-Month', (req, res) => {
    var date = req.body;
    var date_json_str = JSON.stringify(date.month_history);
    var date_str = date_json_str.slice(1, date_json_str.length - 1);
    // var date_str = "2021-02";
    var year = parseInt(date_str.substring(0, 4));
    var month = parseInt(date_str.substring(6));
    console.log("-----------------------------");
    // console.log(year + "-" + month);
    // console.info('/Query-of-Month');

    // res.send(year + "-" + month);
    fs.readFile("config_device.json", 'utf-8', function(err, data) {
        // Check for errors 
        if (err) throw err;
        const config_device = JSON.parse(data);
        // res.json(config_device);
        let reader = daysInMonth(month, year, date_str, config_device);
        reader.then(data => {
            if (data.length > 0) {
                console.log("Data found");
                let results = separate_value_mean(data);
                res.json(results);
            } else {
                console.log("Data not found");
                let message_json = { message: "Data not found" };
                res.json(message_json);
            }

        }).catch(err => {
            console.error(err);
        });
    });

});

app.get('/notification', (req, res) => {
    console.log("/notification");
    console.log(req.query);
    var tmp_message = { message: "fffffffffffffff" };
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            Line_Notify(req.query, doc.data().LineNotifyToken);
            Send_notify_Email(req.query, doc.data().ContactEmail);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    res.send("Notification");
    // if (typeof req.query.message != "undefined") {
    // } else {
    // }
});


app.get('/Send-Email', (req, res) => {
    console.log("Send-Email");
    var tmp_message = { message: "fffffffffffffff" };
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            console.log(doc.data().ContactEmail);
            Send_notify_Email(tmp_message, doc.data().ContactEmail);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    res.send("Send to Email");
});


app.get('/Line-Notify', (req, res) => {
    console.log("Line-Notify");
    var tmp_message = { message: "fffffffffffffff" };
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            console.log(doc.data().LineNotifyToken);
            Line_Notify(tmp_message, doc.data().LineNotifyToken);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    res.send("Send to Email");
});


async function Query_influxDB_Gauge(config_device, date) {
    let tmp = [];
    let temp_front = [];
    let temp_behind = [];
    let humidity = [];
    console.log(`Config device : ${config_device.length}`);
    for (let i = 0; i < config_device.length; i++) {
        // console.log(config_device[i].location);
        const reader = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'front rack');
        reader.order = 'desc';
        reader.set({
            start: date,
            limit: 1,
        });
        temp_front = await reader.then(function(data) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                objectLenght = Object.keys(data.results[0]).length;
                // console.log(objectLenght);
                if (objectLenght === 2) {
                    return data.results[0].series[0].values[0];
                }
            })
            .catch(err => console.log('Request Failed', err));
        let reader1 = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'behind rack');
        reader1.order = 'desc';
        reader1.set({
            start: date,
            limit: 1,
        });
        temp_behind = await reader1.then(function(data) {
                objectLenght = Object.keys(data.results[0]).length;
                // console.log(objectLenght);
                if (objectLenght === 2) {
                    return data.results[0].series[0].values[0];
                }
            })
            .catch(err => console.log('Request Failed', err));
        let reader2 = client.query('humidity').where('location', `${config_device[i].location}`);
        reader2.order = 'desc';
        reader2.set({
            start: date,
            limit: 1,
        });
        humidity = await reader2.then(function(data) {
                objectLenght = Object.keys(data.results[0]).length;
                // console.log(objectLenght);
                if (objectLenght === 2) {
                    return data.results[0].series[0].values[0];
                }
            })
            .catch(err => console.log('Request Failed', err));
        if (typeof temp_front != "undefined" && temp_front != null && temp_front.length > 0) {
            console.log("found data");
            tmp.push(temp_front);
            tmp.push(temp_behind);
            tmp.push(humidity);

        } else {
            console.log("not found data");
            tmp.push(["", `${config_device[i].location}`, "front rack", ""])
            tmp.push(["", `${config_device[i].location}`, "behind rack", ""])
            tmp.push(["", `${config_device[i].location}`, ""])
        }


    }

    return tmp;
}

async function Query_influxDB_HistoryGraph(config_device, date) {
    var start_day = "T00:00:00Z";
    var end_day = "T23:59:59Z";
    var date_str_day_start = date.concat(start_day);
    var date_str_day_end = date.concat(end_day);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("access to Query_influxDB_HistoryGraph");
    console.log(date);
    let tmp = [];
    for (let i = 0; i < config_device.length; i++) {
        const reader = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'front rack');
        reader.set({
            format: 'json',
            start: date_str_day_start,
            end: date_str_day_end,

        });
        var temp_front = await reader.then(data => {
            // console.info("temperature front");
            // console.info(data.temperature);
            return data.temperature;
        }).catch(console.error);

        const reader1 = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'behind rack');
        reader1.set({
            format: 'json',
            start: date_str_day_start,
            end: date_str_day_end,

        });
        var temp_behind = await reader1.then(data => {
            // console.info("temperature behind");
            return data.temperature;
        }).catch(console.error);


        const reader2 = client.query('humidity').where('location', `${config_device[i].location}`);
        reader2.set({
            format: 'json',
            start: date_str_day_start,
            end: date_str_day_end,

        });
        var humidity = await reader2.then(data => {
            // console.info("humidity");
            return data.humidity;
        }).catch(console.error);
        console.log("=========================");
        // console.log(temp_front);
        if (typeof temp_front != "undefined" && temp_front != null && temp_front.length > 0) {
            console.log(`found data (${config_device[i].location})`)
            for (let i = 0; i < temp_front.length; i++) {
                tmp.push(temp_front[i]);

            }
            for (let i = 0; i < temp_behind.length; i++) {
                tmp.push(temp_behind[i]);

            }
            for (let i = 0; i < humidity.length; i++) {
                tmp.push(humidity[i]);

            }
        } else {
            console.log(`not found data (${config_device[i].location})`);
        }


    }

    // console.log(tmp[tmp.length / 3]);
    console.log(tmp.length);

    return tmp;
}


async function Query_influxDB_HistoryGraph_OlderDay(config_device, date) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("access to Query_influxDB_HistoryGraph_OlderDay");
    console.log(date);

    let tmp = [];
    for (let i = 0; i < config_device.length; i++) {
        for (let j = 0; j < time_hours_start.length; j++) {
            const reader = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'front rack');
            reader.set({
                format: 'json',
                start: `${date}T${time_hours_start[j]}`,
                end: `${date}T${time_hours_end[j]}`,
                limit: 1,

            });
            var temp_front = await reader.then(data => {
                // console.info("temperature front");
                // console.info(data.temperature);
                return data.temperature;
            }).catch(console.error);

            const reader1 = client.query('temperature').where('location', `${config_device[i].location}`).where('position', 'behind rack');
            reader1.set({
                format: 'json',
                start: `${date}T${time_hours_start[j]}`,
                end: `${date}T${time_hours_end[j]}`,
                limit: 1,

            });
            var temp_behind = await reader1.then(data => {
                // console.info("temperature behind");
                return data.temperature;
            }).catch(console.error);


            const reader2 = client.query('humidity').where('location', `${config_device[i].location}`);
            reader2.set({
                format: 'json',
                start: `${date}T${time_hours_start[j]}`,
                end: `${date}T${time_hours_end[j]}`,
                limit: 1,

            });
            var humidity = await reader2.then(data => {
                // console.info("humidity");
                return data.humidity;
            }).catch(console.error);
            // console.log("=========================");
            // console.log(temp_front);
            if (typeof temp_front != "undefined" && temp_front != null && temp_front.length > 0) {
                console.log(`found data (${config_device[i].location})`);
                for (let i = 0; i < temp_front.length; i++) {
                    tmp.push(temp_front[i]);

                }
                for (let i = 0; i < temp_behind.length; i++) {
                    tmp.push(temp_behind[i]);

                }
                for (let i = 0; i < humidity.length; i++) {
                    tmp.push(humidity[i]);

                }
            } else {
                console.log(`not found data (${config_device[i].location})`);
            }

        }
    }

    // console.log(tmp[tmp.length / 3]);
    console.log(tmp.length);

    return tmp;
}

function separate_value(all_data) {
    // console.log(all_data[0].position);
    let front_position = [];
    let behind_position = [];
    let humidity = [];
    let tmp = [];
    for (let i = 0; i < all_data.length; i++) {
        if (all_data[i].position === "front rack") {
            front_position.push(all_data[i]);
        } else if (all_data[i].position === "behind rack") {
            behind_position.push(all_data[i]);
        } else {
            humidity.push(all_data[i]);
        }

    }
    for (let i = 0; i < front_position.length; i++) {
        tmp.push(front_position[i]);
    }
    for (let i = 0; i < behind_position.length; i++) {
        tmp.push(behind_position[i]);
    }
    for (let i = 0; i < humidity.length; i++) {
        tmp.push(humidity[i]);
    }

    return tmp;
}


async function Query_Of_Day(date, location) {
    let temp_front = [];
    let tmp_temp_front = [];
    let temp_behind = [];
    let tmp_temp_behind = [];
    let humidity = [];
    let tmp_humidity = [];
    let results = [];
    for (let i = 0; i < time_hours_start.length; i++) {

        temp_front = await client.query('temperature').where('location', `${location}`).where('position', 'front rack')
            // reader2.order = 'desc';
            .set({
                format: 'json',
                start: date + "T" + time_hours_start[i],
                end: date + "T" + time_hours_end[i],
                limit: 1,
            }).then(data => {
                // console.log(data.temperature);
                if (Object.keys(data).length > 0) {
                    let objectLenght = Object.keys(data.temperature[0]).length;
                    // console.log(objectLenght);
                    if (objectLenght === 4) {
                        // console.log("Can return");
                        return data.temperature[0];
                    }
                } else {
                    console.log("Data Not Found");
                }

            }).catch(console.error);

        temp_behind = await client.query('temperature').where('location', `${location}`).where('position', 'behind rack')
            // reader2.order = 'desc';
            .set({
                format: 'json',
                start: date + "T" + time_hours_start[i],
                end: date + "T" + time_hours_end[i],
                limit: 1,
            }).then(data => {
                if (Object.keys(data).length > 0) {
                    let objectLenght = Object.keys(data.temperature[0]).length;
                    // console.log(objectLenght);
                    if (objectLenght === 4) {
                        // console.log("Can return");
                        return data.temperature[0];
                    }
                } else {
                    console.log("Data Not Found");
                }

            }).catch(console.error);


        humidity = await client.query('humidity').where('location', `${location}`)
            // reader2.order = 'desc';
            .set({
                format: 'json',
                start: date + "T" + time_hours_start[i],
                end: date + "T" + time_hours_end[i],
                limit: 1,
            }).then(data => {
                if (Object.keys(data).length > 0) {
                    let objectLenght = Object.keys(data.humidity[0]).length;
                    // console.log(objectLenght);
                    if (objectLenght === 3) {
                        // console.log("Can return");
                        return data.humidity[0];
                    }
                } else {
                    console.log("Data Not Found");
                }

            }).catch(console.error);
        // console.log(temp_front);
        // console.log(typeof temp_front);
        if (typeof temp_front != "undefined" && typeof temp_behind != "undefined" && typeof humidity != "undefined") {
            console.log("Found data");
            tmp_temp_front.push(parseFloat(temp_front.value));
            tmp_temp_behind.push(parseFloat(temp_behind.value));
            tmp_humidity.push(parseFloat(humidity.value));
        } else {
            console.log("Not found data");
            tmp_temp_front.push(parseFloat(0));
            tmp_temp_behind.push(parseFloat(0));
            tmp_humidity.push(parseFloat(0));
        }
    }
    console.log("===============================");
    console.log(`Number of tmp_temp_front : ${tmp_temp_front.length}`);
    console.log(`Number of temp_behind : ${tmp_temp_behind.length}`);
    console.log(`Number of tmp_humidity : ${tmp_humidity.length}`);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    let mean_temp_front = mean_per_day(tmp_temp_front);
    let mean_temp_behind = mean_per_day(tmp_temp_behind);
    let mean_humidity = mean_per_day(tmp_humidity);
    console.log(`Mean temp front per day (${date}) : ${mean_temp_front}`);
    console.log(`Mean temp behind per day (${date}) : ${mean_temp_behind}`);
    console.log(`Mean humidity per day (${date}) : ${mean_humidity}`);
    results.push({ date: `${date}`, location: location, position: "front rack", mean: `${mean_temp_front}` });
    results.push({ date: `${date}`, location: location, position: "behind rack", mean: `${mean_temp_behind}` });
    results.push({ date: `${date}`, location: location, mean: `${mean_humidity}` });
    // await sleep(5000);

    return results;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mean_per_day(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return (sum / arr.length).toFixed(2);
}

async function Query_of_month(num_month, month_year, config_device) {
    let tmp = [];
    let tmp1 = [];
    let all_mean = [];
    let date_1To9 = "0";
    let date_Query = "";
    for (var i = 1; i <= num_month; i++) {
        if (i < 10) {
            date_str = date_1To9.concat(i.toString());
            tmp1.push(date_str);
        } else {
            date_str = i.toString();
            tmp1.push(date_str);
        }
        date_Query = month_year + "-" + date_str;
        // console.log(date_str);
        // console.log(date_Query);
        tmp = await Query_Of_Day(date_Query, config_device.location);
        for (let j = 0; j < tmp.length; j++) {
            all_mean.push(tmp[j]);
        }
        // await sleep(6000);

    }
    console.log(all_mean.length);
    console.log("=======================");

    return all_mean;
}

async function daysInMonth(this_month, this_year, this_month_year, config_device) {
    let tmp = [];
    let results = [];


    for (let i = 0; i < config_device.length; i++) {
        tmp = await Query_of_month(new Date(this_year, this_month, 0).getDate(), this_month_year, config_device[i]);

        results.push(tmp);
    }

    console.log(results.length);



    return results;
}


function separate_value_mean(all_data) {
    // console.log(all_data[0].position);
    let front_position = [];
    let behind_position = [];
    let humidity = [];
    let tmp = [];
    for (let i = 0; i < all_data.length; i++) {
        for (let j = 0; j < all_data[i].length; j++) {
            if (all_data[i][j].position === "front rack") {
                front_position.push(all_data[i][j]);
            } else if (all_data[i][j].position === "behind rack") {
                behind_position.push(all_data[i][j]);
            } else {
                humidity.push(all_data[i][j]);
            }
        }
    }
    for (let i = 0; i < front_position.length; i++) {
        tmp.push(front_position[i]);
    }
    for (let i = 0; i < behind_position.length; i++) {
        tmp.push(behind_position[i]);
    }
    for (let i = 0; i < humidity.length; i++) {
        tmp.push(humidity[i]);
    }

    return tmp;
}

async function Send_notify_Email(res, email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dcprojectdashboard@gmail.com',
            pass: 'Boat123**'
        }
    });

    var mailOptions = {
        from: '',
        to: email,
        subject: res.subject,
        text: res.message + "\n" + "Date : " + res.date + "\n" + "time : " + res.time + "\n" + "location : " + res.location,
    };

    await transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function Line_Notify(res, token) {
    const notify = new LineAPI.Notify({
        token: token,
    })

    notify.send({
        message: "\n" + res.message + "\n" + "Date : " + res.date + "\n" + "time : " + res.time + "\n" + "location : " + res.location,

    })
}


app.listen(8081, function() {
    console.log("Welcome to influxdb-nodejs listen port 8081");
})
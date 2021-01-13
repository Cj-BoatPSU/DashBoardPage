window.onloadstart = checkAuth();
// influxdb client
// const Influx = require('influxdb-nodejs');
// const influx_client = new Influx('http://mydb:cjboat@127.0.0.1:8086/db_version2');

const firebaseConfig = {
    apiKey: FIREBASE_CONFIG.apiKey,
    authDomain: FIREBASE_CONFIG.authDomain,
    projectId: FIREBASE_CONFIG.projectId,
    storageBucket: FIREBASE_CONFIG.storageBucket,
    messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
    appId: FIREBASE_CONFIG.appId
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var profileInfo = db.collection("profileUser").doc("profile-info");
//login firebase auth
profileInfo.get().then(function(doc) {
    if (doc.exists) {
        doc.data().FirstName;
        firebase.auth().signInWithEmailAndPassword(doc.data().EmailID, doc.data().PasswordID);
    } else {
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});



// btn active to css
var header = document.getElementById("item_tabs");
var btns = header.getElementsByClassName("btn");
// console.log(btns);
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        // console.log(this.id);
        toggle_contents(this.id);
    });

}


function toggle_contents(btn_id) {
    const items = document.querySelectorAll('.item');
    var item_id = "";
    item_id = btn_id;
    var cur = item_id.charAt(4);
    const temp = document.getElementById("item-" + cur);
    items.forEach(function(item) {
        if (item.id === temp.id) {
            // console.log(item.id + "===" + temp.id);
            item.style.display = "block";
            if (item.id === "item-6") {
                // console.log(temp.id);
                initProfile();
            } else if (item.id === "item-7") {
                // console.log(temp.id);
                initAccount();
            } else if (item.id === "item-2") {

                CreateGauge();
                // query_data_influxdb();
                // relate_value();
            }

        } else {
            item.style.display = "none";
        }

    })
}

function logout() {
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful");
        localStorage.setItem("check-auth", false);
        sessionStorage.setItem("check-auth", false);
        window.location.href = "index.html"
    }).catch(function(error) {
        console.log(error);
    });

}

function checkAuth() {
    console.log("checkAuth function");
    console.log(localStorage.getItem("check-auth"));
    if (localStorage.getItem("check-auth") === "false") {
        console.log(" no Auth");
        window.location.href = "index.html";
    }

}

// Profile section

var firstname = document.getElementById("store_firstname");
var lastname = document.getElementById("store_lastname");
var contactEmail = document.getElementById("store_contactEmail");
var contactNumber = document.getElementById("store_contactNumber");
var profileInfo = db.collection("profileUser").doc("profile-info");


function updateProfile() {
    // when to click save 
    var r = confirm("Are you sure to save changes?");
    if (r == true) {
        saveProfile();
    } else {
        console.log("click cancel");
    }

}

function initProfile() {
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            firstname.value = doc.data().FirstName;
            lastname.value = doc.data().LastName;
            contactEmail.value = doc.data().ContactEmail;
            contactNumber.value = doc.data().ContactNumber;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    firstname.disabled = true;
    lastname.disabled = true;
    contactEmail.disabled = true;
    contactNumber.disabled = true;
}

function saveProfile() {
    console.log("accesss to saveProfile function");
    var btnChange = document.getElementById("change-info");
    var btnSave = document.getElementById("save-info");
    btnChange.style.display = "block";
    btnSave.style.display = "none";
    var citiesRef = db.collection("profileUser");

    citiesRef.doc("profile-info").update({
        FirstName: firstname.value,
        LastName: lastname.value,
        ContactEmail: contactEmail.value,
        ContactNumber: contactNumber.value,
    });
    // console.log(firstname.value);

    initProfile();

}

function changeProfile() {
    console.log("accesss to changeProfile function");
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            firstname.value = doc.data().FirstName;
            lastname.value = doc.data().LastName;
            contactEmail.value = doc.data().ContactEmail;
            contactNumber.value = doc.data().ContactNumber;
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    var btnChange = document.getElementById("change-info");
    var btnSave = document.getElementById("save-info");
    btnChange.style.display = "none";
    btnSave.style.display = "block";
    firstname.disabled = false;
    lastname.disabled = false;
    contactEmail.disabled = false;
    contactNumber.disabled = false;
}

// chart.js section

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45]
        }]
    },

    // Configuration options go here
    options: {}
});



// Gauge chart section
const infront_section = document.querySelector(".In-front-section");
const behind_section = document.querySelector(".behind-section");
const humidity_section = document.querySelector(".humidity-section");

function CreateGauge() {
    // var fruits = ["Banana", "Orange", "Apple", "Mango"];
    // fruits.push("Kiwi"); how to push data
    var temp_value = [75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1),
        75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1),
        75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1),
        75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1), 75 * Math.random().toFixed(1),
    ];
    var location = ["location : Rack1", "location : Rack1", "location : Rack1", "location : Rack1", "location : Rack2",
        "location : Rack2", "location : Rack2", "location : Rack2", "location : Rack3", "location : Rack3", "location : Rack3",
        "location : Rack3"
    ];
    // var position = ["Position : In front of Rack1", "Position : behind of Rack1", "Position : In front of Rack1",
    //     "Position : In front of Rack2", "Position : behind of Rack2", "Position : In front of Rack2",
    //     "Position : In front of Rack3", "Position : behind of Rack3", "Position : In front of Rack3"
    // ];
    // for (i = 0; i < 1; i++) {
    CreateDIVChart(infront_section);
    CreateDIVChart(behind_section);
    CreateDIVChart(humidity_section);
    // }

    relate_value();

}

function CreateDIVChart(element) {

    var gauge = document.createElement('div');
    var gauge_body = document.createElement('div');
    var gauge_fill = document.createElement('div');
    var gauge_value = document.createElement('div');
    var sc_min = document.createElement('span');
    var sc_max = document.createElement('span');
    var sc_location = document.createElement('span');
    // var sc_position = document.createElement('span');

    sc_min.textContent = "0";
    sc_max.textContent = "75";

    gauge.classList.add("gauge");
    gauge_body.classList.add("gauge__body");
    gauge_fill.classList.add("gauge__fill");
    gauge_value.classList.add("gauge__value");
    sc_min.classList.add("sc-min");
    sc_max.classList.add("sc-max");
    sc_location.classList.add("sc-location");
    // sc_position.classList.add("sc-position");

    gauge_body.appendChild(gauge_fill);
    gauge_body.appendChild(gauge_value);
    gauge.appendChild(gauge_body);
    gauge.appendChild(sc_min);
    gauge.appendChild(sc_max);
    gauge.appendChild(sc_location);
    // gauge.appendChild(sc_position);
    element.appendChild(gauge);
    // console.log("success to CreateDIVChart");
}

function setGaugeValue(gauge, json_value) {
    // console.log(json_value);
    if (json_value.value == null || json_value.location == null) {
        return;
    }
    // check temp value for change status color
    if (json_value.value >= 0 && json_value.value < 23) {
        gauge.querySelector(".gauge__fill").style.background = '#009578';
    } else if (json_value.value >= 23 && json_value.value <= 27) {
        gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
    } else {
        gauge.querySelector(".gauge__fill").style.background = '#e03b24';
    }

    // full gauge is (0.5)turn
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${(json_value.value/75)*0.5}turn)`;
    if (json_value.type === "temperature") {
        gauge.querySelector(".gauge__value").textContent = `${json_value.value}°C`;
    } else {
        gauge.querySelector(".gauge__value").textContent = `${json_value.value}%`;
    }

    gauge.querySelector(".sc-location").textContent = json_value.location;
    // gauge.querySelector(".sc-position").textContent = position;

}


function query_data_influxdb() {
    var tmp = [];
    var lack1_temp_front = { location: "lack1", position: "front lack", value: 24.8, type: "temperature" };
    var lack1_temp_back = { location: "lack1", position: "back lack", value: 37.5, type: "temperature" };
    var lack1_humidity = { location: "lack1", value: 51.2, type: "humidity" };
    // fetch('http://127.0.0.1:8081/influxdb/lack1/temperature/frontlack')
    //     .then(response => response.json())
    //     .then((json_value) => {
    //         // console.log(json_value)
    //         // console.log(json_value.location)
    //         // console.log(json_value.position)
    //         // console.log(json_value.value)
    //         lack1_temp_front.location = json_value.location;
    //         lack1_temp_front.position = json_value.position;
    //         lack1_temp_front.value = json_value.value;
    //         tmp.push(lack1_temp_front);

    //     }).catch(err => console.log('Request Failed', err));

    // fetch('http://127.0.0.1:8081/influxdb/lack1/temperature/backlack')
    //     .then(response => response.json())
    //     .then((json_value) => {
    //         // console.log(json_value)
    //         // console.log(json_value.location)
    //         // console.log(json_value.position)
    //         // console.log(json_value.value)
    //         lack1_temp_back.location = json_value.location;
    //         lack1_temp_back.position = json_value.position;
    //         lack1_temp_back.value = json_value.value;
    //         tmp.push(lack1_temp_back);

    //     }).catch(err => console.log('Request Failed', err));

    // fetch('http://127.0.0.1:8081/influxdb/lack1/humidity')
    //     .then(response => response.json())
    //     .then((json_value) => {
    //         // console.log(json_value)
    //         // console.log(json_value.location)
    //         // console.log(json_value.position)
    //         // console.log(json_value.value)
    //         lack1_humidity.location = json_value.location;
    //         lack1_humidity.value = json_value.value;
    //         tmp.push(lack1_humidity);
    //         console.log(tmp[0]);
    //     }).catch(err => console.log('Request Failed', err));
    tmp.push(lack1_temp_front);
    tmp.push(lack1_temp_back);
    tmp.push(lack1_humidity);
    return tmp;
}

function relate_value() {
    var tmp = [];
    tmp = query_data_influxdb();
    console.log("access to relate_value");
    console.log(tmp[0]);
    const gaugeElement = document.querySelectorAll(".gauge");
    console.log("Number of gaugeElement : " + gaugeElement.length);
    for (i = 0; i < gaugeElement.length; i++) {
        setGaugeValue(gaugeElement[i], tmp[i]);
    }
}
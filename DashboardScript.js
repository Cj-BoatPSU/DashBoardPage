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
                // Createchart();
                CreateGauge();
                query_data_influxdb();
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
    for (i = 0; i < 4; i++) {
        CreateDIVChart(infront_section);
        CreateDIVChart(behind_section);
        CreateDIVChart(humidity_section);
    }
    const gaugeElement = document.querySelectorAll(".gauge");
    console.log("Number of gaugeElement : " + gaugeElement.length);
    for (i = 0; i < gaugeElement.length; i++) {
        setGaugeValue(gaugeElement[i], temp_value[i], location[i]);
    }

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

function setGaugeValue(gauge, value, location) {
    if (value == null || location == null) {
        return;
    }
    // check temp value for change status color
    if (value >= 0 && value < 23) {
        gauge.querySelector(".gauge__fill").style.background = '#009578';
    } else if (value >= 23 && value <= 27) {
        gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
    } else {
        gauge.querySelector(".gauge__fill").style.background = '#e03b24';
    }

    // full gauge is (0.5)turn
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${(value/75)*0.5}turn)`;

    gauge.querySelector(".gauge__value").textContent = `${value}°C`;
    gauge.querySelector(".sc-location").textContent = location;
    // gauge.querySelector(".sc-position").textContent = position;

}

function query_data_influxdb() {
    fetch('http://127.0.0.1:8081/influxdb/temperature')
        .then(response => response.json())
        .then((json_value) => {
            console.log(json_value)
            console.log(json_value.location)
            console.log(json_value.position)
            console.log(json_value.value)
        }).catch(err => console.log('Request Failed', err));
}
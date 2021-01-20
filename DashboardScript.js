window.onloadstart = checkAuth();


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
        firebase.auth().signInWithEmailAndPassword(doc.data().ContactEmail, doc.data().PasswordID);
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
//Variable Declaration global

var myTab = document.getElementById('table-device');
var mytable = document.getElementsByTagName("tbody")[0];

function toggle_contents(btn_id) {
    const items = document.querySelectorAll('.item');
    var item_id = "";
    item_id = btn_id;
    var cur = item_id.charAt(4);
    const temp = document.getElementById("item-" + cur);
    items.forEach(function(item) {
        if (item.id === temp.id) {
            item.style.display = "block";
            if (item.id === "item-6") {
                initProfile();
            } else if (item.id === "item-7") {
                initAccount();
            } else if (item.id === "item-2") {
                CreateGauge();
            } else if (item.id === "item-5") {
                console.log("Number of rows device table :" + mytable.rows.length);
                console.log("Value location[0] :" + mytable.rows.item(0).cells.item(0).innerHTML);
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
    if (firstname.value === "" || lastname.value === "" || contactEmail.value === "" || contactNumber.value === "") {
        if (firstname.value === "") {
            document.getElementById('alert-store_firstname').innerText = "Please enter your FirstName";
        }
        if (lastname.value === "") {
            document.getElementById('alert-store_lastname').innerText = "Please enter your LastName";
        }
        if (contactEmail.value === "") {
            document.getElementById('alert-store_contactEmail').innerText = "Please enter your Contact Email";
        }
        if (contactNumber.value === "") {
            document.getElementById('alert-store_contactNumber').innerText = "Please enter your Contact Number";
        }
    } else {
        document.getElementById('alert-store_firstname').innerText = "";
        document.getElementById('alert-store_lastname').innerText = "";
        document.getElementById('alert-store_contactEmail').innerText = "";
        document.getElementById('alert-store_contactNumber').innerText = "";
        var r = confirm("Are you sure to save changes?");
        if (r == true) {
            saveProfile();
        } else {
            console.log("click cancel");
        }
    }
}

function initProfile() {
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
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
    console.log(firstname.value);
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
    const gaugeElement = document.querySelectorAll(".gauge");
    console.log(gaugeElement.length);
    if (gaugeElement.length === (1 * 3)) {
        console.log("not create gaugeElement ");
        relate_value();
        return;
    } else {
        console.log("create gaugeElement");
        for (let index = 0; index < 1; index++) {
            CreateDIVChart(infront_section);
            CreateDIVChart(behind_section);
            CreateDIVChart(humidity_section);

        }
        relate_value();
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

    sc_min.textContent = "0";
    sc_max.textContent = "75";

    gauge.classList.add("gauge");
    gauge_body.classList.add("gauge__body");
    gauge_fill.classList.add("gauge__fill");
    gauge_value.classList.add("gauge__value");
    sc_min.classList.add("sc-min");
    sc_max.classList.add("sc-max");
    sc_location.classList.add("sc-location");

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
    if (json_value.type === "temperature") {
        if (json_value.value >= 0 && json_value.value < 23) {
            gauge.querySelector(".gauge__fill").style.background = '#009578';
        } else if (json_value.value >= 23 && json_value.value <= 27) {
            gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
        } else {
            gauge.querySelector(".gauge__fill").style.background = '#e03b24';
        }
    } else {
        if (json_value.value >= 40 && json_value.value < 60) {
            gauge.querySelector(".gauge__fill").style.background = '#009578';
        } else if (json_value.value >= 0 && json_value.value <= 39) {
            gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
        } else {
            gauge.querySelector(".gauge__fill").style.background = '#e03b24';
        }
    }
    // full gauge is (0.5)turn
    gauge.querySelector(".gauge__fill").style.transform = `rotate(${(json_value.value/75)*0.5}turn)`;
    if (json_value.type === "temperature") {
        gauge.querySelector(".gauge__value").textContent = `${json_value.value.toFixed(2)}°C`;
    } else {
        gauge.querySelector(".gauge__value").textContent = `${json_value.value}%`;
    }

    gauge.querySelector(".sc-location").textContent = json_value.location;
    // gauge.querySelector(".sc-position").textContent = position;

}


async function query_data_influxdb() {
    let tmp = [];
    let rack1_temp_front = await fetch('http://172.30.232.114:8081/influxdb/rack1/temperature/frontrack')
        .then(function(response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));

    rack1_temp_front['type'] = "temperature";
    let rack1_temp_back = await fetch('http://172.30.232.114:8081/influxdb/rack1/temperature/behindrack')
        .then(function(response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    rack1_temp_back['type'] = "temperature";

    let rack1_humidity = await fetch('http://172.30.232.114:8081/influxdb/rack1/humidity')
        .then(function(response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    rack1_humidity['type'] = "humidity";

    tmp.push(rack1_temp_front);
    tmp.push(rack1_temp_back);
    tmp.push(rack1_humidity);
    return tmp;
}

async function relate_value() {
    var tmp = [];
    tmp = await query_data_influxdb();
    console.log("access to relate_value");
    console.log(tmp);
    const gaugeElement = document.querySelectorAll(".gauge");
    console.log("Number of gaugeElement : " + gaugeElement.length);
    for (i = 0; i < gaugeElement.length; i++) {
        setGaugeValue(gaugeElement[i], tmp[i]);
    }
}

//config section

var device_name = document.getElementById("device-name");
var location_device = document.getElementById("location-device");
var ip_address_device = document.getElementById("ip-address-device");

function addDevice() {
    var myTab = document.getElementById('table-device');
    var myTable = document.getElementsByTagName("tbody")[0];
    console.log("access addDevice");
    if (device_name.value === "" || location_device.value === "" || ip_address_device.value === "") {
        if (device_name.value === "") {
            document.getElementById('alert-device-name').innerText = "Please enter Device Name";
        } else {
            document.getElementById('alert-device-name').innerText = "";
        }
        if (location_device.value === "") {
            document.getElementById('alert-location-device').innerText = "Please enter Location";
        } else {
            document.getElementById('alert-location-device').innerText = "";
        }
        if (ip_address_device.value === "") {
            document.getElementById('alert-ip-address-device').innerText = "Please enter IP address";
        } else {
            document.getElementById('alert-ip-address-device').innerText = "";
        }
    } else {
        document.getElementById('alert-device-name').innerText = "";
        document.getElementById('alert-location-device').innerText = "";
        document.getElementById('alert-ip-address-device').innerText = "";
        let template = `
                <tr>
                    <td>${device_name.value}</td>
                    <td>${location_device.value}</td>
                    <td>${ip_address_device.value}</td>
                    <td style="width: 100px;">
                        <button type="button" id="delete-device" onclick="deleteRow(this)">Delete</button>
                    </td>
                </tr>`;

        myTable.innerHTML += template;

    }

}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("table-device").deleteRow(i);
}
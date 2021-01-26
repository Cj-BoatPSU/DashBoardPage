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
// var profileInfo = db.collection("profileUser").doc("profile-info");
// //login firebase auth
// profileInfo.get().then(function(doc) {
//     if (doc.exists) {
//         doc.data().FirstName;
//         firebase.auth().signInWithEmailAndPassword(doc.data().ContactEmail, doc.data().PasswordID);
//     } else {
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });

firebase.auth().signInWithEmailAndPassword("Chutiwat.Boat@gmail.com", "boat123**");


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

// var myTab = document.getElementById('table-device');
// var mytable = document.getElementsByTagName("tbody")[0];

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
                initConfigDevice();
                // console.log("Number of rows device table :" + mytable.rows.length);
                // console.log("Value location[0] :" + mytable.rows.item(0).cells.item(0).innerHTML);
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
        // sessionStorage.setItem("check-auth", false);
        window.location.href = "index.html"
    }).catch(function(error) {
        console.log(error);
    });

}

function checkAuth() {
    console.log(`checkAuth function : ${localStorage.getItem("check-auth")}`);
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
    // console.log("accesss to saveProfile function");
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
    // console.log("accesss to changeProfile function");
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

// Gauge chart section
const infront_section = document.querySelector(".In-front-section");
const behind_section = document.querySelector(".behind-section");
const humidity_section = document.querySelector(".humidity-section");

async function CreateGauge() {
    const gaugeElement = document.querySelectorAll(".gauge");

    let all_devices = [];
    all_devices = await fetchConfigDevice();
    console.log(`Number of all device (in CreateGauge function) : ${all_devices.length}`);
    if (gaugeElement.length === (all_devices.length * 3)) {
        console.log("not create gaugeElement ");
        relate_value();
        return;
    } else {
        console.log("create gaugeElement");
        for (let index = 0; index < all_devices.length; index++) {
            CreateDIVChart(infront_section);
            CreateDIVChart(behind_section);
            CreateDIVChart(humidity_section);

        }
        relate_value();
    }
    console.log(`Number of div each section : ` + infront_section.children.length);

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
    element.appendChild(gauge);
}

function setGaugeValue(gauge, json_value) {
    // console.log("access to setGaugeValue");
    // console.log(`Number of ${gauge.parentElement.className} section : ${gauge.parentElement.children.length}`);


    // check temp value for change status color
    if (json_value.type === "temperature") { //type temperature
        if (json_value[3] == null || json_value[1] == null) {
            return;
        }
        if (json_value[3] >= 0 && json_value[3] < 27) {
            gauge.querySelector(".gauge__fill").style.background = '#009578';
        } else if (json_value[3] >= 27 && json_value[3] <= 30) {
            gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
        } else {
            gauge.querySelector(".gauge__fill").style.background = '#e03b24';
        }
        // full gauge is (0.5)turn
        gauge.querySelector(".gauge__fill").style.transform = `rotate(${(json_value[3]/75)*0.5}turn)`;
        gauge.querySelector(".gauge__value").textContent = `${json_value[3].toFixed(2)}°C`;

    } else { //type humidity
        if (json_value[2] == null || json_value[1] == null) {
            return;
        }
        if (json_value[2] >= 40 && json_value[2] < 60) {
            gauge.querySelector(".gauge__fill").style.background = '#009578';
        } else if (json_value[2] >= 0 && json_value[2] <= 39) {
            gauge.querySelector(".gauge__fill").style.background = '#ffcc00';
        } else {
            gauge.querySelector(".gauge__fill").style.background = '#e03b24';
        }
        gauge.querySelector(".gauge__fill").style.transform = `rotate(${(json_value[2]/75)*0.5}turn)`;
        gauge.querySelector(".gauge__value").textContent = `${json_value[2]}%`;
    }
    gauge.querySelector(".sc-location").textContent = json_value[1];

}


async function query_data_influxdb() {
    let results = await fetch(`http://127.0.0.1:8081/Queryinfluxdb`)
        .then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    for (let i = 0; i < results.length; i++) {
        if (results[i].length === 4) {
            results[i]['type'] = "temperature";
        } else {
            results[i]['type'] = "humidity";
        }
    }

    return results;
}

function separate_value(all_data) {
    let front_position = [];
    let behind_position = [];
    let humidity = [];
    let tmp = [];
    for (let i = 0; i < all_data.length; i++) {
        if (all_data[i][2] === "front rack") {
            front_position.push(all_data[i]);
        } else if (all_data[i][2] === "behind rack") {
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

async function relate_value() {

    let all_data = await query_data_influxdb();
    let tmp = separate_value(all_data);
    // console.log("access to relate_value");
    console.log(tmp);
    console.log(all_data);

    const gaugeElement = document.querySelectorAll(".gauge");
    const gaugeElement_front = infront_section.children;
    console.log(`Number of gaugeElement : ${gaugeElement.length}`);
    for (i = 0; i < gaugeElement.length; i++) {
        setGaugeValue(gaugeElement[i], tmp[i]);
    }
}

//config section

var device_name = document.getElementById("device-name");
var location_device = document.getElementById("location-device");
var ip_address_device = document.getElementById("ip-address-device");

function addDevice() {
    // var myTab = document.getElementById('table-device');
    var myTable = document.getElementsByTagName("tbody")[0];
    // console.log("access addDevice");
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

function showTableData() {
    var myTab = document.getElementById('table-device');
    var tmp = [];
    // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
    for (i = 1; i < myTab.rows.length; i++) {

        // GET THE CELLS COLLECTION OF THE CURRENT ROW.
        var objCells = myTab.rows.item(i).cells;
        var tmp_json = { device_name: "", location: "", ip_address: "" };
        tmp_json.device_name = objCells.item(0).innerHTML;
        tmp_json.location = objCells.item(1).innerHTML;
        tmp_json.ip_address = objCells.item(2).innerHTML;
        tmp.push(tmp_json);
    }
    // console.log(tmp);
    return tmp;
}

function saveConfigDevice() {
    let tmp = [];
    tmp = showTableData();
    console.log(tmp);
    var r = confirm("Are you sure to save config device?");
    if (r == true) {
        const options = {
            method: "POST",
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tmp),
        }
        fetch('http://127.0.0.1:8081/save-config-device', options);
    } else {
        console.log("click cancel");
    }

}

async function fetchConfigDevice() {
    let all_devices = [];
    all_devices = await fetch('http://127.0.0.1:8081/init-config-device')
        .then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    return all_devices;
}

async function initConfigDevice() {
    // console.log("access to initConfigDevice function");
    let all_devices = [];
    all_devices = await fetchConfigDevice();
    console.log(all_devices);
    console.log(all_devices[0].device_name);
    var myTable = document.getElementsByTagName("tbody")[0];
    console.log(myTable.rows.length);
    console.log(all_devices.length);
    if (myTable.rows.length === all_devices.length) {
        console.log("Not append table");
        return;
    } else {
        for (let index = 0; index < all_devices.length; index++) {
            let template = `
            <tr>
                <td>${all_devices[index].device_name}</td>
                <td>${all_devices[index].location}</td>
                <td>${all_devices[index].ip_address}</td>
                <td style="width: 100px;">
                    <button type="button" id="delete-device" onclick="deleteRow(this)">Delete</button>
                </td>
            </tr>`;

            myTable.innerHTML += template;

        }
    }

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
        }],
        // fill: false,
    },

    // Configuration options go here
    options: {

    }
});
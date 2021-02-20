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

firebase.auth().signInWithEmailAndPassword("admin@dashboard.com", "test123**");


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
var all_HistoryGraph = [];
var date_times = ["00:00", "00:10", "00:20", "00:30", "00:40", "00:50",
    "01:00", "01:10", "01:20", "01:30", "01:40", "01:50",
    "02:00", "02:10", "02:20", "02:30", "02:40", "02:50",
    "03:00", "03:10", "03:20", "03:30", "03:40", "03:50",
    "04:00", "04:10", "04:20", "04:30", "04:40", "04:50",
    "05:00", "05:10", "05:20", "05:30", "05:40", "05:50",
    "06:00", "06:10", "06:20", "06:30", "06:40", "06:50",
    "07:00", "07:10", "07:20", "07:30", "07:40", "07:50",
    "08:00", "08:10", "08:20", "08:30", "08:40", "08:50",
    "09:00", "09:10", "09:20", "09:30", "09:40", "09:50",
    "10:00", "10:10", "10:20", "10:30", "10:40", "10:50",
    "11:00", "11:10", "11:20", "11:30", "11:40", "11:50",
    "12:00", "12:10", "12:20", "12:30", "12:40", "12:50",
    "13:00", "13:10", "13:20", "13:30", "13:40", "13:50",
    "14:00", "14:10", "14:20", "14:30", "14:40", "14:50",
    "15:00", "15:10", "15:20", "15:30", "15:40", "15:50",
    "16:00", "16:10", "16:20", "16:30", "16:40", "16:50",
    "17:00", "17:10", "17:20", "17:30", "17:40", "17:50",
    "18:00", "18:10", "18:20", "18:30", "18:40", "18:50",
    "19:00", "19:10", "19:20", "19:30", "19:40", "19:50",
    "20:00", "20:10", "20:20", "20:30", "20:40", "20:50",
    "21:00", "21:10", "21:20", "21:30", "21:40", "21:50",
    "22:00", "22:10", "22:20", "22:30", "22:40", "22:50",
    "23:00", "23:10", "23:20", "23:30", "23:40", "23:50"
];

var date_of_month = ["2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07", "2021-01-08",
        "2021-01-09", "2021-01-10", "2021-01-11", "2021-01-12", "2021-01-13", "2021-01-14", "2021-01-15", "2021-01-16", "2021-01-17",
        "2021-01-18", "2021-01-19", "2021-01-20", "2021-01-21", "2021-01-22", "2021-01-23", "2021-01-24", "2021-01-25",
        "2021-01-26", "2021-01-27", "2021-01-28", "2021-01-29", "2021-01-30", "2021-01-31",
    ]
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
            } else if (item.id === "item-3") {
                initHistoryGraph();
                // TestsetInterval();
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
    if (localStorage.getItem("check-auth") === "false" || localStorage.getItem("check-auth") === null) {
        console.log(" no Auth");
        window.location.href = "index.html";
    }

}

// Profile section

var firstname = document.getElementById("store_firstname");
var lastname = document.getElementById("store_lastname");
var contactEmail = document.getElementById("store_contactEmail");
var lineNotifyToken = document.getElementById("store_line_notify_token");
var profileInfo = db.collection("profileUser").doc("profile-info");


function updateProfile() {
    // when to click save 
    if (firstname.value === "" || lastname.value === "" || contactEmail.value === "" || lineNotifyToken.value === "") {
        if (firstname.value === "") {
            document.getElementById('alert-store_firstname').innerText = "Please enter your FirstName";
        }
        if (lastname.value === "") {
            document.getElementById('alert-store_lastname').innerText = "Please enter your LastName";
        }
        if (contactEmail.value === "") {
            document.getElementById('alert-store_contactEmail').innerText = "Please enter your Contact Email";
        }
        if (lineNotifyToken.value === "") {
            document.getElementById('alert-line_notify_token').innerText = "Please enter your Line notify Token";
        }
    } else {
        document.getElementById('alert-store_firstname').innerText = "";
        document.getElementById('alert-store_lastname').innerText = "";
        document.getElementById('alert-store_contactEmail').innerText = "";
        document.getElementById('alert-line_notify_token').innerText = "";
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
            lineNotifyToken.value = doc.data().LineNotifyToken;
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
    lineNotifyToken.disabled = true;
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
        LineNotifyToken: lineNotifyToken.value,
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
            lineNotifyToken.value = doc.data().LineNotifyToken;
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
    lineNotifyToken.disabled = false;
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
    // console.log(`Number of div each section : ` + infront_section.children.length);

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
        gauge.querySelector(".gauge__value").textContent = `${json_value[3]}°C`; //.toFixed(2)

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
    let all_devices = await fetchConfigDevice();
    let all_data = await query_data_influxdb();
    let tmp = separate_value(all_data);
    console.log(all_devices);
    console.log(tmp);
    for (let i = 0; i < infront_section.children.length; i++) {
        infront_section.children[i].querySelector(".sc-location").textContent = all_devices[i].location;
        // console.log(tmp[i][3]);
        if (tmp[i][3] != "") {
            setGaugeValue(infront_section.children[i], tmp[i]);
            infront_section.children[i].querySelector(".gauge__value").style.color = "rgb(0, 0, 0)";
            infront_section.children[i].querySelector(".gauge__value").style.fontSize = "32px";
        } else {
            console.log("Data Not Found");
            infront_section.children[i].querySelector(".gauge__value").textContent = "Data Not Found";
            infront_section.children[i].querySelector(".gauge__value").style.color = "rgb(220, 20, 60)";
            infront_section.children[i].querySelector(".gauge__value").style.fontSize = "20px";
        }
    }
    for (let i = 0; i < behind_section.children.length; i++) {
        behind_section.children[i].querySelector(".sc-location").textContent = all_devices[i].location;
        if (tmp[i + infront_section.children.length][3] != "") {
            setGaugeValue(behind_section.children[i], tmp[i + infront_section.children.length]);
            behind_section.children[i].querySelector(".gauge__value").style.color = "rgb(0, 0, 0)";
            behind_section.children[i].querySelector(".gauge__value").style.fontSize = "32px";
        } else {
            console.log("Data Not Found");
            behind_section.children[i].querySelector(".gauge__value").textContent = "Data Not Found";
            behind_section.children[i].querySelector(".gauge__value").style.color = "rgb(220, 20, 60)";
            behind_section.children[i].querySelector(".gauge__value").style.fontSize = "20px";
        }
    }
    for (let i = 0; i < humidity_section.children.length; i++) {
        humidity_section.children[i].querySelector(".sc-location").textContent = all_devices[i].location;
        if (tmp[i + infront_section.children.length + behind_section.children.length][2] != "") {
            setGaugeValue(humidity_section.children[i], tmp[i + infront_section.children.length + behind_section.children.length]);
            humidity_section.children[i].querySelector(".gauge__value").style.color = "rgb(0, 0, 0)";
            humidity_section.children[i].querySelector(".gauge__value").style.fontSize = "32px";
        } else {
            console.log("Data Not Found");
            humidity_section.children[i].querySelector(".gauge__value").textContent = "Data Not Found";
            humidity_section.children[i].querySelector(".gauge__value").style.color = "rgb(220, 20, 60)";
            humidity_section.children[i].querySelector(".gauge__value").style.fontSize = "20px";
        }
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
    // console.log(all_devices[0].device_name);
    var myTable = document.getElementsByTagName("tbody")[0];
    // console.log(myTable.rows.length);
    // console.log(all_devices.length);
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

async function initHistoryGraph() {
    var date = new Date();
    var date_str_day = date.getDate();
    var date_str_month = date.getMonth() + 1;
    var date_str_year = date.getFullYear();
    var label_date = document.getElementById("label-date");
    let all_devices = [];
    all_devices = await fetchConfigDevice();
    let HistoryGraph_length = document.getElementsByClassName('HistoryGraph');
    console.log(`Number of graph history : ${HistoryGraph_length.length}`);
    label_date.innerHTML = `Date : ${date_str_day} / ${date_str_month} / ${date_str_year}`;

    document.getElementById("select-month").disabled = true;
    document.getElementById("select-month").style.backgroundColor = "rgb(210, 210, 210)";
    document.getElementById("select_month").disabled = true; //button

    if (HistoryGraph_length.length === all_devices.length) {
        console.log("Not create graph history");
        CheckQuery_HistoryGraph();
        return;
    } else {
        for (let index = 0; index < all_devices.length; index++) {
            CreateCanvas(document.getElementById('item-3'), all_devices[index].location);
        }
        CheckQuery_HistoryGraph();
    }
}

function randomNumber(min, max) {
    const r = Math.random() * (max - min) + min;
    return Math.floor(r);
}

function CreateCanvas(element, location) {
    var canvas = document.createElement("CANVAS");
    var canvas_length = element.querySelectorAll("CANVAS");
    canvas.setAttribute('id', `HistoryGraph${canvas_length.length+1}`);
    canvas.setAttribute('class', `HistoryGraph`);
    var label = document.createElement("P");
    var label_NotFound = document.createElement("P");
    label.innerText = `Location : ${location}`;
    label_NotFound.setAttribute('class', `label_NotFound`);
    label_NotFound.innerText = "Data Not Found";
    var ctx = canvas.getContext("2d");
    var config = {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            labels: date_times,
            datasets: [{
                    label: 'Temperature ( in front of rack )',
                    backgroundColor: 'rgb(35, 155, 86)',
                    borderColor: 'rgb(35, 155, 86)',
                    borderWidth: 2,
                    radius: 2,
                    hoverRadius: 5,
                    fill: 'false',
                },
                {
                    label: 'Temperature ( behind of rack )',
                    backgroundColor: 'rgb(255, 204, 0)',
                    borderColor: 'rgb(255, 204, 0)',
                    borderWidth: 2,
                    radius: 2,
                    hoverRadius: 5,
                    fill: 'false',
                },
                {
                    label: 'Humidity',
                    backgroundColor: 'rgb(79, 129, 189)',
                    borderColor: 'rgb(79, 129, 189)',
                    borderWidth: 2,
                    radius: 2,
                    hoverRadius: 5,
                    fill: 'false',
                }
            ],

        },

        // Configuration options go here
        options: {
            // responsive: true,
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontSize: 16,
                }
            },
            scales: {
                xAxes: {
                    type: 'timeseries',
                    offset: true,
                },
                x: {
                    type: 'timeseries',
                    offset: true,
                },
            }
        }

    };
    var chart = new Chart(ctx, config);
    element.appendChild(label_NotFound);
    element.appendChild(canvas);
    element.appendChild(label);
    label.style.marginLeft = "auto"; // set to center
    label.style.marginRight = "auto"; // set to center
    label.style.marginTop = "30px";
    label.style.marginBottom = "70px";
    label.style.width = "20%";
    label.style.padding = "10px";
    label.style.textAlign = "center";
    label.style.fontSize = "20px";
    label.style.fontWeight = "bold";
    label.style.color = "rgb(255, 255, 255)";
    label.style.backgroundColor = "rgb(2, 62, 125)";
    label_NotFound.style.marginLeft = "auto"; // set to center
    label_NotFound.style.marginRight = "auto"; // set to center
    label_NotFound.style.width = "20%";
    label_NotFound.style.padding = "10px";
    label_NotFound.style.textAlign = "center";
    label_NotFound.style.fontSize = "20px";
    label_NotFound.style.fontWeight = "bold";
    label_NotFound.style.color = "rgb(255, 255, 255)";
    label_NotFound.style.backgroundColor = "rgb(220, 20, 60)";
    all_HistoryGraph.push(chart); //to fix after customize system
}

async function initDataHistoryGraph(this_data_HistoryGraph, this_HistoryGraph, i) {
    console.log("access initDataHistoryGraph");
    let label_NotFound = document.querySelectorAll(".label_NotFound");
    // let tmp_HistoryGraph = [];
    let index_value = 0;
    // let index_time = 0;
    var sel = document.getElementById('select-units');
    // console.log(sel.value);
    console.log(this_data_HistoryGraph);
    if (typeof this_data_HistoryGraph != "undefined" && this_data_HistoryGraph != null && this_data_HistoryGraph.length > 0) {
        console.log("Found data (in function initDataHistoryGraph)");
        console.log(`Number of this_HistoryGraph.data.datasets[0].data.length : ${this_HistoryGraph.data.datasets[0].data.length}`);
        label_NotFound[i].style.display = "none";
        if (this_HistoryGraph.data.labels.length === 0 && sel.value === "Day") {
            this_HistoryGraph.data.labels = [];
            this_HistoryGraph.update();
            for (let i = 0; i < date_times.length; i++) { //new init labels on graph
                this_HistoryGraph.data.labels.push(date_times[i]);
            }
            this_HistoryGraph.update();
        }
        if (this_HistoryGraph.data.labels.length === 0 && sel.value === "Month") {
            this_HistoryGraph.data.labels = [];
            this_HistoryGraph.update();
            for (let i = 0; i < date_of_month.length; i++) { //new init labels on graph
                this_HistoryGraph.data.labels.push(date_of_month[i]);
            }
            this_HistoryGraph.update();
        }
        if (this_HistoryGraph.data.datasets[0].data.length >= 0 || this_HistoryGraph.data.datasets[0].data.length === 0) {
            console.log(" new set this_data_HistoryGraph (if)");
            this_HistoryGraph.data.datasets[0].data = [];
            this_HistoryGraph.data.datasets[1].data = [];
            this_HistoryGraph.data.datasets[2].data = [];
            this_HistoryGraph.update();
            if (sel.value === "Month") {
                console.log("sel.value === Month");
                this_HistoryGraph.data.labels = [];
                this_HistoryGraph.update();

                for (let j = 0; j < 3; j++) {
                    //loop line graph
                    for (let k = 0; k < (this_data_HistoryGraph.length / 3); k++) {
                        //loop set value
                        this_HistoryGraph.data.datasets[j].data.push(this_data_HistoryGraph[index_value].mean);
                        // console.log(index_value);
                        index_value++;
                    }
                }
                for (let index = 0; index < (this_data_HistoryGraph.length / 3); index++) {
                    // set y axis (date)
                    this_HistoryGraph.data.labels.push(this_data_HistoryGraph[index].date);
                    // index_time++;
                }
                // index_time = index_value;
            }
            if (sel.value === "Day") {
                console.log("sel.value === Day");
                this_HistoryGraph.data.labels = [];
                this_HistoryGraph.update();
                for (let i = 0; i < date_times.length; i++) { //new init labels on graph
                    this_HistoryGraph.data.labels.push(date_times[i]);
                }
                this_HistoryGraph.update();
                for (let j = 0; j < 3; j++) {
                    //loop line graph
                    for (let k = 0; k < (this_data_HistoryGraph.length / 3); k++) {
                        //loop set value
                        this_HistoryGraph.data.datasets[j].data.push(this_data_HistoryGraph[index_value].value);
                        // console.log(index_value);
                        index_value++;
                    }
                }
            }

            this_HistoryGraph.update();

        } else {
            console.log(" A number of point data is not full (else)");
            for (let j = 0; j < 3; j++) {
                //loop line graph
                for (let k = 0; k < (this_data_HistoryGraph.length / 3); k++) {
                    //loop set value
                    this_HistoryGraph.data.datasets[j].data.push(this_data_HistoryGraph[index_value].value);
                    // console.log(index_value);
                    index_value++;
                }
            }
            // for (let index = 0; index < (this_data_HistoryGraph.length / 3); index++) {
            //     // set y axis (time)
            //     this_HistoryGraph.data.labels.push(this_data_HistoryGraph[index].time.substr(11, 18));
            //     index_time++;
            // }
            // index_time = index_value;
            this_HistoryGraph.update();
        }
        // CheckSetInterval(this_HistoryGraph, null, false);

    } else {
        label_NotFound[i].style.display = "block";
        console.log("Not Found data (in function initDataHistoryGraph)");
        this_HistoryGraph.data.datasets[0].data = [];
        this_HistoryGraph.data.datasets[1].data = [];
        this_HistoryGraph.data.datasets[2].data = [];
        this_HistoryGraph.data.labels = [];
        this_HistoryGraph.update();
        return;
    }
    console.log("========<><><><><><><><>========");
    console.log(`Number of line graph temp (in front of) :${this_HistoryGraph.data.datasets[0].data.length}`);

}


var times = ['1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12PM'];


function addData(this_HistoryGraph, init_Setinterval, check_setinterval) {

    console.log("access to addData()");

    // this_HistoryGraph.data.labels.push(randomTime(times));
    this_HistoryGraph.data.datasets[0].data.push(randomNumber(21, 27));
    this_HistoryGraph.data.datasets[1].data.push(randomNumber(31, 27));
    this_HistoryGraph.data.datasets[2].data.push(randomNumber(51, 65));
    this_HistoryGraph.update();
    CheckSetInterval(this_HistoryGraph, init_Setinterval, check_setinterval);

}


function initSetinterval(this_HistoryGraph) {
    var init_Setinterval;
    var check_setinterval = false;
    init_Setinterval = setInterval(function() {
        check_setinterval = true;
        addData(this_HistoryGraph, init_Setinterval, check_setinterval)
    }, 5000);

}

function CheckSetInterval(this_HistoryGraph, init_Setinterval, check_setinterval) {
    console.log("access to CheckSetInterval function");
    // for (let i = 0; i < this_HistoryGraph.length; i++) {
    console.log(`line graph Temperature (in front of) length : ${this_HistoryGraph.data.datasets[0].data.length}`);
    console.log(this_HistoryGraph.data);
    if (this_HistoryGraph.data.datasets[0].data.length >= 100 && check_setinterval === true) { //
        // for stop setinterval() because a number of point data is full
        console.log("for stop setinterval() because a number of point data is full");
        clearInterval(init_Setinterval);
        check_setinterval = false;
    } else if (this_HistoryGraph.data.datasets[0].data.length >= 100 && check_setinterval === false) { //
        // for see history graph in case want to see historyGraph older day
        console.log("for see history graph in case want to see historyGraph older day");
    } else if (check_setinterval === true) {
        // do not someting becase a number of point data is not full
        console.log("do not someting becase a number of point data is not full");
        return;
    } else { //for initSetinterval() in case a number of point data is not full
        console.log("for initSetinterval() in case a number of point data is not full");
        initSetinterval(this_HistoryGraph);
    }

}

function removeData() {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

async function CheckQuery_HistoryGraph() {
    let all_devices = [];
    let all_data_HistoryGraph = [];
    let filter_data_HistoryGraph = [];
    var spinner = document.getElementById("load_Wrapper");
    spinner.style.display = "block";
    all_devices = await fetchConfigDevice();
    all_data_HistoryGraph = await fetch_Data_HistoryGraph();
    spinner.style.display = "none";


    for (let i = 0; i < all_devices.length; i++) {

        for (let j = 0; j < all_data_HistoryGraph.length; j++) {
            // console.log(all_devices[i].location);
            // console.log(all_data_HistoryGraph[j].location);
            if (all_devices[i].location === all_data_HistoryGraph[j].location) {
                console.log(`found data (${all_devices[i].location})`);
                filter_data_HistoryGraph.push(all_data_HistoryGraph[j]);
            } else {
                console.log(`not found data (${all_devices[i].location})`);
            }

        }
        initDataHistoryGraph(filter_data_HistoryGraph, all_HistoryGraph[i], i);
        console.log("filter_data_HistoryGraph : ")
        console.log(filter_data_HistoryGraph);
        filter_data_HistoryGraph = [];
    }

}


function randomTime(times) {
    return times[Math.floor(Math.random() * times.length)];

}

function randomNumber(min, max) {
    const r = Math.random() * (max - min) + min;
    return r.toFixed(2);
}


async function fetch_Data_HistoryGraph() {
    let all_HistoryData = [];
    all_HistoryData = await fetch('http://127.0.0.1:8081/Queryinfluxdb_HistoryGraph')
        .then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    return all_HistoryData;
}


async function SearchHistory() {
    console.log("access to SearchHistory()");
    var spinner = document.getElementById("load_Wrapper");
    spinner.style.display = "block";
    var search_history_value = document.getElementById("search-history").value;
    var date = new Date(search_history_value);
    var date_str_day = date.getDate();
    var date_str_month = date.getMonth() + 1;
    var date_str_year = date.getFullYear();
    var label_date = document.getElementById("label-date");
    label_date.innerHTML = `Date : ${date_str_day} / ${date_str_month} / ${date_str_year}`;
    var tmp_json = { date_history: search_history_value };
    const options = {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tmp_json),
    }

    let all_devices = [];
    let all_data_HistoryGraph = [];
    let filter_data_HistoryGraph = [];

    all_data_HistoryGraph = await fetch('http://127.0.0.1:8081/search-history', options).then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    console.log("After await fetch(search-history)");
    console.log(all_data_HistoryGraph);

    all_devices = await fetchConfigDevice();

    spinner.style.display = "none";
    for (let i = 0; i < all_devices.length; i++) {

        for (let j = 0; j < all_data_HistoryGraph.length; j++) {

            if (all_devices[i].location === all_data_HistoryGraph[j].location) {
                console.log(`found data (${all_devices[i].location})`);
                // label_NotFound[i].style.display = "none";
                filter_data_HistoryGraph.push(all_data_HistoryGraph[j]);

            } else {
                console.log(`not found data (${all_devices[i].location})`);
                // label_NotFound[i].style.display = "block";
            }

        }
        console.log(`filter_data_HistoryGraph : `);
        console.log(filter_data_HistoryGraph);
        initDataHistoryGraph(filter_data_HistoryGraph, all_HistoryGraph[i], i);
        filter_data_HistoryGraph = [];
    }

}

function Change_Units() {
    var sel = document.getElementById('select-units');
    console.log(sel.value);
    if (sel.value === "Day") {

        document.getElementById("search_history").disabled = false; //button
        document.getElementById("search-history").disabled = false;
        document.getElementById("search-history").style.backgroundColor = "rgb(255, 255, 255)";
        document.getElementById("select-month").disabled = true;
        document.getElementById("select-month").style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById("select_month").disabled = true; //button
    } else {

        document.getElementById("search_history").disabled = true; //button
        document.getElementById("search-history").disabled = true;
        document.getElementById("search-history").style.backgroundColor = "rgb(210, 210, 210)";
        document.getElementById("select-month").disabled = false;
        document.getElementById("select-month").style.backgroundColor = "rgb(255, 255, 255)";
        document.getElementById("select_month").disabled = false; //button
    }
}

async function SearchHistory_Month() {
    console.log("access to SearchHistory_Month()");
    var search_history_value = document.getElementById("select-month").value;
    var label_date = document.getElementById("label-date");
    var d = new Date(search_history_value);
    var n = d.toUTCString();
    var month_sel = n.substring(8, 16);
    label_date.innerHTML = `Month : ${month_sel} `;
    var spinner = document.getElementById("load_Wrapper");
    spinner.style.display = "block";

    // console.log(search_history_value);
    var tmp_json = { month_history: search_history_value };
    const options = {
        method: "POST",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tmp_json),
    }

    let all_data_HistoryGraph = [];

    all_data_HistoryGraph = await fetch('http://127.0.0.1:8081/Query-of-Month', options).then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    console.log(all_data_HistoryGraph[0]);
    console.log(all_data_HistoryGraph[0].mean);
    console.log(all_data_HistoryGraph.length);
    spinner.style.display = "none";
    for (let i = 0; i < all_HistoryGraph.length; i++) {
        initDataHistoryGraph(all_data_HistoryGraph, all_HistoryGraph[i], i);
    }

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function Send_notify_Email() {
    console.log("Access to Send_notify_Email()");
    await fetch('http://127.0.0.1:8081/Send-Email');
}

async function Line_Notify() {
    console.log("Access to Line_Notify()");
    await fetch('http://127.0.0.1:8081/Line-Notify');
}
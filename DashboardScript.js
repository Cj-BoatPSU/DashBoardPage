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

var init_Setinterval = null;
var init_Setinterval_History = null;

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
            } else if (item.id === "item-1") {
                initHeatmap();
            } else if (item.id === "item-4") {
                initConfigThresholds();
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
    var tmp = localStorage.getItem("username"); //type string
    var username = tmp.substring(0, tmp.indexOf('@')); // cut a string after a specific character
    document.getElementById("profile_name").innerHTML = username;
    initHeatmap();
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
    if (gaugeElement.length >= (all_devices.length * 3)) {
        console.log("not create gaugeElement ");
        relate_value();
        CheckSetInterval();
        return;
    } else {
        console.log("create gaugeElement");
        for (let index = 0; index < all_devices.length; index++) {
            CreateDIVChart(infront_section);
            CreateDIVChart(behind_section);
            CreateDIVChart(humidity_section);

        }
        relate_value();
        CheckSetInterval();
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
        if (json_value[3] >= 21 && json_value[3] < 24 || json_value[3] >= 29 && json_value[3] < 32) {
            gauge.querySelector(".gauge__fill").style.background = '#009578';
        } else if (json_value[3] >= 25 && json_value[3] <= 30 || json_value[3] >= 32 && json_value[3] <= 35) {
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
    let tmp = separate_value(all_data); //for separate set same position on difference location
    check_for_notification(tmp);
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
    var label_location = document.createElement("P");
    var label_NotFound = document.createElement("P");
    label_location.innerText = `Location : ${location}`;
    label_location.setAttribute('class', `label_location`);
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
    element.appendChild(label_location);
    label_location.style.marginLeft = "auto"; // set to center
    label_location.style.marginRight = "auto"; // set to center
    label_location.style.marginTop = "30px";
    label_location.style.marginBottom = "70px";
    label_location.style.width = "20%";
    label_location.style.padding = "10px";
    label_location.style.textAlign = "center";
    label_location.style.fontSize = "20px";
    label_location.style.fontWeight = "bold";
    label_location.style.color = "rgb(255, 255, 255)";
    label_location.style.backgroundColor = "rgb(2, 62, 125)";
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
                    index_value++;
                }
            }
            this_HistoryGraph.update();
        }

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


function initSetinterval() {
    console.log("New initSetinterval");
    var i = 0;
    init_Setinterval = setInterval(async function() {
        await relate_value();
        console.log("Number of i :" + i.toString());
        i++;
    }, 90000);

}

function CheckSetInterval() {
    console.log("access to CheckSetInterval function");
    console.log(init_Setinterval);
    if (init_Setinterval != null) {
        // for stop setinterval() because a number of point data is full
        console.log("for stop setinterval() because prevent to make nested setinterval()");
        clearInterval(init_Setinterval);
        initSetinterval();
    } else { //for initSetinterval() in case a number of point data is not full
        console.log("for initSetinterval() in case ");
        initSetinterval();
    }
}


function CheckSetInterval_HistoryGraph() {
    console.log("access to CheckSetInterval_HistoryGraph function");
    console.log(`Number of all_HistoryGraph[0].data.datasets[0].data.length : ${all_HistoryGraph[0].data.datasets[0].data.length}`);
    console.log(init_Setinterval_History);
    if (all_HistoryGraph[0].data.datasets[0].data.length >= 144) {
        console.log("for stop setinterval() because point data in graph is full");
        if (init_Setinterval_History != null) {
            clearInterval(init_Setinterval_History);
        }
    }
    if (init_Setinterval != null) {
        // for stop setinterval() because a number of point data is full
        console.log("for stop setinterval() because prevent to make nested setinterval()");
        clearInterval(init_Setinterval_History);
        initSetinterval_History();
    } else { //for initSetinterval() in case a number of point data is not full
        console.log("for initSetinterval() in case ");
        initSetinterval_History();
    }
}

function initSetinterval_History() {
    console.log("New initSetinterval History");
    var j = 0;
    init_Setinterval_History = setInterval(async function() {
        PushData_History();
        console.log("Number of j :" + j.toString());
        j++;
    }, 90000); // 90000

}

async function PushData_History() {
    console.log("access to PushData_History");
    let label_location = document.querySelectorAll(".label_location");
    let label_NotFound = document.querySelectorAll(".label_NotFound");
    let all_data = await query_data_influxdb();
    let tmp = [];
    console.log(all_data);
    console.log(all_HistoryGraph[0].data.datasets[2].data.length);
    for (let k = 0; k < all_HistoryGraph.length; k++) {
        let location = label_location[k].innerHTML.substring(11);
        if (label_NotFound[k].style.display != "block") {
            console.log("This History is data found " + "(" + location + ")");
            for (let i = 0; i < all_data.length; i++) { //filter data
                if (all_data[i][1] === location) {
                    if (all_data[i].type === "temperature") {
                        tmp.push(all_data[i][3].toString());
                    } else {
                        tmp.push(all_data[i][2]);
                    }
                }

            }
            console.log(tmp);
            for (let j = 0; j < tmp.length; j++) { //push data realtime HistoryGraph
                all_HistoryGraph[k].data.datasets[j].data.push(tmp[j]);
            }

        } else {
            console.log("This History is data not found " + "(" + location + ")");
        }
        all_HistoryGraph[k].update();
    }
    console.log("=============After to add data ===============");
    console.log(all_HistoryGraph[0].data.datasets[2].data.length);
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
        await initDataHistoryGraph(filter_data_HistoryGraph, all_HistoryGraph[i], i);
        // console.log(init_Setinterval_History);
        console.log("filter_data_HistoryGraph : ")
        console.log(filter_data_HistoryGraph);
        filter_data_HistoryGraph = [];
    }
    CheckSetInterval_HistoryGraph();
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
    all_HistoryData = await fetch('http://172.30.232.114:8081/Queryinfluxdb_HistoryGraph')
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

    all_data_HistoryGraph = await fetch('http://172.30.232.114:8081/search-history', options).then(function(response) {
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
        await initDataHistoryGraph(filter_data_HistoryGraph, all_HistoryGraph[i], i);
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

    all_data_HistoryGraph = await fetch('http://172.30.232.114:8081/Query-of-Month', options).then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    console.log(all_data_HistoryGraph[0]);
    console.log(all_data_HistoryGraph[0].mean);
    console.log(all_data_HistoryGraph.length);
    spinner.style.display = "none";
    for (let i = 0; i < all_HistoryGraph.length; i++) {
        await initDataHistoryGraph(all_data_HistoryGraph, all_HistoryGraph[i], i);
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


var btnChange_temp_thresholds = document.getElementById("change_temp_thresholds");
var btnSave_temp_thresholds = document.getElementById("save_temp_thresholds");
var btnChange_humidity_thresholds = document.getElementById("change_humidity_thresholds");
var btnSave_humidity_thresholds = document.getElementById("save_humidity_thresholds");
var maximum_temp = document.getElementById("maximum-alert-temp");
var minimum_temp = document.getElementById("minimum-alert-temp");
var maximum_humidity = document.getElementById("maximum-alert-humidity");
var minimum_humidity = document.getElementById("minimum-alert-humidity");

async function initConfigThresholds() {
    let results = await fetch(`http://127.0.0.1:8081/init-config-thresholds`)
        .then(function(response) {
            return response.json();
        })
        .catch(err => console.log('Request Failed', err));
    maximum_temp.value = results[0].maximum;
    minimum_temp.value = results[0].minimum;
    maximum_humidity.value = results[1].maximum;
    minimum_humidity.value = results[1].minimum;
    maximum_temp.disabled = true;
    minimum_temp.disabled = true;
    maximum_humidity.disabled = true;
    minimum_humidity.disabled = true;

    btnChange_temp_thresholds.style.display = "block";
    btnSave_temp_thresholds.style.display = "none";
    btnChange_humidity_thresholds.style.display = "block";
    btnSave_humidity_thresholds.style.display = "none";
}

function change_temp_Thresholds() {
    btnChange_temp_thresholds.style.display = "none";
    btnSave_temp_thresholds.style.display = "block";
    maximum_temp.disabled = false;
    minimum_temp.disabled = false;
}

function change_humidity_Thresholds() {
    btnChange_humidity_thresholds.style.display = "none";
    btnSave_humidity_thresholds.style.display = "block";
    maximum_humidity.disabled = false;
    minimum_humidity.disabled = false;
}

async function save_temp_Thresholds() {

    if (maximum_temp.value === "" || minimum_temp.value === "") {
        if (maximum_temp.value === "") {
            document.getElementById('alert-temp_maximum').innerText = "Please enter Maximum Temperature Thresholds";
        }
        if (minimum_temp.value === "") {
            document.getElementById('alert-temp_minimum').innerText = "Please enter Minimum Temperature Thresholds";
        }
    } else {
        document.getElementById('alert-temp_maximum').innerText = "";
        document.getElementById('alert-temp_minimum').innerText = "";
        var tmp_json = { maximum: "", minimum: "" };
        tmp_json.maximum = maximum_temp.value;
        tmp_json.minimum = minimum_temp.value;
        var r = confirm("Are you sure to save temperature thresholds?");
        if (r == true) {
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
            await fetch('http://127.0.0.1:8081/save-config-temp-thresholds', options);

            maximum_temp.disabled = true;
            minimum_temp.disabled = true;

            btnChange_temp_thresholds.style.display = "block";
            btnSave_temp_thresholds.style.display = "none";
            let results = await fetch(`http://127.0.0.1:8081/init-config-thresholds`)
                .then(function(response) {
                    return response.json();
                })
                .catch(err => console.log('Request Failed', err));
            maximum_temp.value = results[0].maximum;
            minimum_temp.value = results[0].minimum;
        }
    }

}


async function save_humidity_Thresholds() {
    if (maximum_humidity.value === "" || minimum_humidity.value === "") {

        if (maximum_humidity.value === "") {
            document.getElementById('alert-humidity_maximum').innerText = "Please enter Maximum Humidity Thresholds";
        }
        if (minimum_humidity.value === "") {
            document.getElementById('alert-humidity_minimum').innerText = "Please enter Minimum Humidity Thresholds";
        }
    } else {
        document.getElementById('alert-humidity_maximum').innerText = "";
        document.getElementById('alert-humidity_minimum').innerText = "";
        var tmp_json = { maximum: "", minimum: "" };
        tmp_json.maximum = maximum_humidity.value;
        tmp_json.minimum = minimum_humidity.value;
        var r = confirm("Are you sure to save humidity thresholds?");
        if (r == true) {
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
            await fetch('http://127.0.0.1:8081/save-config-humidity-thresholds', options);

            maximum_humidity.disabled = true;
            minimum_humidity.disabled = true;

            btnChange_humidity_thresholds.style.display = "block";
            btnSave_humidity_thresholds.style.display = "none";
            let results = await fetch(`http://127.0.0.1:8081/init-config-thresholds`)
                .then(function(response) {
                    return response.json();
                })
                .catch(err => console.log('Request Failed', err));
            maximum_humidity.value = results[1].maximum;
            minimum_humidity.value = results[1].minimum;
        }
    }

}


async function check_for_notification(tmp) {
    console.log("access to check_for_notification");
    let payload = { date: "", time: "", location: "", message: "", subject: "Notification Data Center (Temperature and Himidity)" };
    for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].type === "temperature") {
            if (tmp[i][2] === "front rack") {
                if (tmp[i][3] > parseFloat(minimum_temp.value)) {
                    payload.message = "Temperature (in front of rack) : " + tmp[i][3];
                    payload.location = tmp[i][1];
                    await fetch('http://127.0.0.1:8081/notification-1?' + new URLSearchParams(payload));
                }
            } else {
                if (tmp[i][3] > parseFloat(maximum_temp.value)) {
                    payload.message = "Temperature (behind rack) : " + tmp[i][3];
                    payload.location = tmp[i][1];
                    await fetch('http://127.0.0.1:8081/notification-1?' + new URLSearchParams(payload));
                }
            }

        } else {
            // notification humidity
            if (parseFloat(tmp[i][2]) > parseFloat(maximum_humidity.value) || parseFloat(tmp[i][2]) < parseFloat(minimum_humidity.value)) {
                payload.message = "Humidity : " + tmp[i][2];
                payload.location = tmp[i][1];
                await fetch('http://127.0.0.1:8081/notification-1?' + new URLSearchParams(payload));
            }
        }

    }
}

// Heatmap section

async function initHeatmap() {
    var date = new Date();
    var date_str_day = date.getDate();
    var date_str_month = date.getMonth() + 1;
    var date_str_year = date.getFullYear();
    var label_date = document.getElementById("label-date-Heatmap");
    label_date.innerHTML = `Date : ${date_str_day} / ${date_str_month} / ${date_str_year}`;
    console.log("access to initHeatmap");
    let all_data = await query_data_influxdb();
    let all_devices = await fetchConfigDevice();
    let tmp = [];
    var heatmapArea = document.getElementById("heatmapArea");
    var heatmapArea1 = document.getElementById("test");
    var HeatmapArray = [];
    var data = {
        "max": 33,
        "data": [],
    };
    var cfg = {
            "element": heatmapArea,
            "opacity": 0.1,
            "radius": 70,
            "visible": true,
            "maxOpacity": 1,
            "minOpacity": 0,
            "legend": {
                "title": "Temperature (c°)",
                "position": "bl",
            },
            // "gradient": { 0.25: "rgb(0,0,255)", 0.35: "rgb(0,255,255)", 0.65: "rgb(0,255,0)" },
        }
        // for (let i = 0; i < all_devices.length; i++) {
        //     var heatmapInstance = h337.create(cfg);
        //     HeatmapArray.push(heatmapInstance);
        // }
    console.log("Heatmap data array length (before PushData_Heatmap):" + data.data.length);
    temp_only(all_data);
    all_data.sort(function(a, b) { //sort array location rack
        if (a[1] < b[1]) { return -1; }
        if (a[1] > b[1]) { return 1; }
        return 0;
    });
    tmp = separate_value(all_data);
    // CreateHeatmap(HeatmapArray, tmp, all_devices)
    // cfg.gradient = { 0.25: "rgb(0,0,255)", 0.35: "rgb(0,255,255)", 0.65: "rgb(0,255,0)" }; // 0.25: "rgb(0,0,255)", 0.35: "rgb(0,255,255)", 2: "rgb(255,165,0)"
    var heatmapInstance_front = h337.create(cfg);
    var heatmapInstance_behind = h337.create(cfg);
    var heatmapInstance = h337.create(cfg);
    tmp = await initDataPoint(tmp, all_devices, []);
    console.log(heatmapInstance.get("gradient"));
    var data = {
        max: 33,
        min: 0,
        data: [],
    };
    var data1 = {
        max: 33,
        min: 0,
        data: [],
    };
    var data2 = {
        max: 33,
        min: 0,
        data: [],
    };
    for (let i = 0; i < (tmp.length / 2); i++) { //front
        data.data.push(tmp[i]);
    }
    for (let i = (tmp.length / 2); i < tmp.length; i++) { //behind
        data1.data.push(tmp[i]);
    }
    for (let i = 0; i < tmp.length; i++) {
        data2.data.push(tmp[i]);
    }
    console.log(data2);
    // TemperatureDistributionUP(data.data);
    // fillHeatmap(data2.data, tmp);
    fillHeatmapV1(data2.data, tmp);
    // TemperatureDistributionDown(data.data, tmp);
    // heatmapInstance_front.store.setDataSet(data);
    // heatmapInstance_behind.store.setDataSet(data1);
    heatmapInstance.store.setDataSet(data2);
    console.log(data2);
    // cfg.gradient = { 0.65: "rgb(0,255,0)", 0.80: "yellow", 0.85: "rgb(255,165,0)", 0.95: "rgb(255,0,0)" };
    // heatmapInstance = h337.create(cfg);
    // fillHeatmap(data1.data, tmp);
    // heatmapInstance.store.setDataSet(data1);
}

function fillHeatmapV1(data, tmp) {
    data.push({
        "x": 50,
        "y": 50,
        "count": 22,
    }, {
        "x": 160,
        "y": 50,
        "count": 22,
    });
}


function fillHeatmap(data, tmp) {
    var heatmapArea = document.getElementById("heatmapArea");
    console.log("access to fillHeatmap");
    console.log("Height : " + heatmapArea.offsetHeight);
    console.log("Width : " + heatmapArea.offsetWidth);
    console.log(tmp[(tmp.length / 2) - 1]); //last value in group front rack
    // for (let i = 0; i <= heatmapArea.offsetHeight; i += 20) { // y axis     //side left
    //     for (let j = 0; j < 175; j += 20) { // x axis
    //         data.push({
    //             "x": j,
    //             "y": i,
    //             "count": 8,
    //         });

    //     }
    // }
    // console.log(data[data.length - 1]);
    // for (let i = 0; i <= heatmapArea.offsetHeight; i += 20) { // y axis   //side right
    //     for (let j = 860; j < heatmapArea.offsetWidth; j += 20) { // x axis
    //         data.push({
    //             "x": j,
    //             "y": i,
    //             "count": 8,
    //         });

    //     }


    // }
    // for (let i = 0; i < 140; i += 20) { // y axis     top side
    //     for (let j = 180; j <= 840; j += 20) { // x axis
    //         data.push({
    //             "x": j,
    //             "y": i,
    //             "count": 8,
    //         });

    //     }
    // }

    if (data[0].count >= 22 && data[0].count <= 24) {
        console.log("access to if");
        for (let i = 0; i <= heatmapArea.offsetHeight; i += 20) { // y axis     //side left
            for (let j = 0; j < heatmapArea.offsetWidth; j += 20) { // x axis
                data.push({
                    "x": j,
                    "y": i,
                    "count": 2,
                });

            }
        }
        console.log(data.length);
    }
    if (data[0].count >= 29 && data[0].count <= 33) { //behind rack
        console.log("access to if1");
        for (let i = (heatmapArea.offsetHeight / 2); i <= heatmapArea.offsetHeight; i += 20) { // y axis     //side left
            for (let j = 0; j < heatmapArea.offsetWidth; j += 20) { // x axis
                data.push({
                    "x": j,
                    "y": i,
                    "count": 9,
                });

            }
        }
    }


}
async function CreateHeatmap(HeatmapArray, all_data, all_devices) {
    console.log("access to CreateHeatmap");
    var tmp = [];
    tmp = await initDataPoint(all_data, all_devices, tmp);
    console.log(tmp);
    for (let i = 0; i < HeatmapArray.length; i++) { //front rack
        var data = {
            max: 33,
            min: 0,
            data: [],
        };
        data.data.push(tmp[i]);
        // console.log(data.data);
        //     // console.log(data.data);
        TemperatureDistributionUP(data.data);
        // HeatmapArray[i].setDataMax(33);
        HeatmapArray[i].store.setDataSet(data);
    }
}



async function initDataPoint(all_data, all_devices, data) {
    console.log("access to initDataPoint");
    console.log(all_data);
    let location = ["rack1", "rack2", "rack3", "rack4", "rack5"];
    for (let i = 0; i < 2; i++) { //follow number of row rack in picture 
        let x = 240;
        for (let j = 0; j < 5; j++) { //follow number of rack in picture //set x point
            data.push({
                "x": x,
                "location": location[j],
                "status": "",
            });

            x += 135;
        }


    }
    let index = 0;
    let y = 170; //160
    for (let i = 0; i < 2; i++) { //follow number of row rack in picture
        for (let j = 0; j < 5; j++) { //follow number of rack in picture //set y point
            data[index].y = y;
            if (i < 1) {
                data[index].position = "front rack";
            } else {
                data[index].position = "behind rack";
            }
            index++
        }

        y += 240;
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].position == "behind rack") {
            data[i].y = 380;
        }

    }


    for (let j = 0; j < data.length; j++) {

        for (let k = 0; k < all_devices.length; k++) {
            if (data[j].location === all_devices[k].location) {
                data[j].status = "found data";
            }
        }
    }
    console.log("after initPointData data length : " + data.length);
    for (let i = 0; i < data.length; i++) {
        if (data[i].status === "") {
            data.splice(i, 1);
            i = 0;
        }
    }
    console.log("after splice data length : " + data.length);
    for (let i = 0; i < all_data.length; i++) { //set value
        data[i].count = parseFloat(all_data[i][3]); //parseFloat Don't forget
    }
    console.log("----------------------------");
    console.log(data);
    return data;
}



function initDataHeatmap(data, all_data) {
    var heatmapArea = document.getElementById("heatmapArea");
    console.log("Width : " + heatmapArea.offsetWidth);
    console.log("Height : " + heatmapArea.offsetHeight);
    console.log("access to initData");
    console.log(data);
    let i = 0;
    for (let j = 0; j < heatmapArea.offsetHeight; j += 15) { //y
        for (i = 0; i < heatmapArea.offsetWidth; i += 15) { //x
            if (!((i >= (180 - 20) && i <= (870 + 20)) && (j >= (175 - 20) && j <= (380 + 20)))) {
                data.push({
                    "x": i,
                    "y": j,
                    "count": 10,
                });
            }

        }
    }
    console.log(data);
}


function temp_only(all_data) {
    for (let i = 0; i < all_data.length; i++) {
        if (all_data[i].length === 3) {
            all_data.splice(i, 1);
        }

    }
}

function TemperatureDistributionDown(data, all_data) {
    console.log("access to TemperatureDistributionDown");
    console.log(all_data);
    for (let i = 0; i < all_data.length; i++) {
        let inc = 25;
        if (all_data[i].position === "behind rack") {
            for (let j = 0; j < 2; j++) { //frist row
                data.push({
                    "x": data[i].x + inc,
                    "y": data[i].y,
                    "count": data[i].count,
                }, {
                    "x": data[i].x - inc,
                    "y": data[i].y,
                    "count": data[i].count,
                }, );
                inc += inc;
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y + 20,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y + 20,
                "count": data[i].count,
            });
            for (let j = 0; j < 2; j++) { //second row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
                // inc += inc;
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x,
                "y": data[i].y + 40,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 3; j++) { //third row

                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y + 60,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y + 60,
                "count": data[i].count,
            });
            for (let j = 0; j < 3; j++) { //fourth row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x,
                "y": data[i].y + 80,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 4; j++) { //fifth row
                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y + 100,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y + 100,
                "count": data[i].count,
            });
            for (let j = 0; j < 4; j++) { //sixth row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 25;
            data.push({
                "x": data[i].x,
                "y": data[i].y + 120,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 5; j++) { //seventh row
                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y + 140,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y + 140,
                "count": data[i].count,
            });
            for (let j = 0; j < 4; j++) { //eight th row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
            }
            // data[data.length - 2].count -= 15; //decrement count point edge
            // data[data.length - 1].count -= 15; //decrement count point edge
        }

    }
}

function TemperatureDistributionUP(data) {
    console.log("access to TemperatureDistributionUP");
    for (let i = 0; i < data.length; i++) {
        let inc = 28;
        if (data[i].position === "front rack") {
            for (let j = 0; j < 2; j++) { //frist row
                data.push({
                    "x": data[i].x + inc,
                    "y": data[i].y,
                    "count": data[i].count,
                }, {
                    "x": data[i].x - inc,
                    "y": data[i].y,
                    "count": data[i].count,
                }, );
                inc += inc;
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y - 26,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y - 26,
                "count": data[i].count,
            });
            for (let j = 0; j < 2; j++) { //second row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
                // inc += inc;
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x,
                "y": data[i].y - 52,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 2; j++) { //thrid row

                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y - 78,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y - 78,
                "count": data[i].count,
            });
            for (let j = 0; j < 2; j++) { //fourth row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x,
                "y": data[i].y - 104,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 2; j++) { //fifth row
                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x + 15,
                "y": data[i].y - 130,
                "count": data[i].count,
            }, {
                "x": data[i].x - 15,
                "y": data[i].y - 130,
                "count": data[i].count,
            });
            for (let j = 0; j < 2; j++) { //sixth row
                data.push({
                    "x": data[data.length - 2].x + inc,
                    "y": data[data.length - 2].y,
                    "count": data[i].count,
                }, {
                    "x": data[data.length - 1].x - inc,
                    "y": data[data.length - 1].y,
                    "count": data[i].count,
                }, );
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge
            inc = 28;
            data.push({
                "x": data[i].x,
                "y": data[i].y - 156,
                "count": data[i].count,
            }, );
            for (let j = 0; j < 2; j++) { //seventh row
                if (j > 0) {
                    data.push({
                        "x": data[data.length - 2].x + inc,
                        "y": data[data.length - 2].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, );
                } else {
                    data.push({
                        "x": data[data.length - 1].x + inc,
                        "y": data[data.length - 1].y,
                        "count": data[i].count,
                    }, {
                        "x": data[data.length - 1].x - inc,
                        "y": data[data.length - 1].y,
                        "count": data[data.length - 1].count,
                    }, );
                }
            }
            data[data.length - 2].count -= 15; //decrement count point edge
            data[data.length - 1].count -= 15; //decrement count point edge

        }

    }
}
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
var all_HistoryGraph = [];
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
    console.log(tmp[0][0]);

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
    if (HistoryGraph_length.length === all_devices.length) {
        console.log("Not create graph history");
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
    label_NotFound.innerText = "Not Found Data";
    var ctx = canvas.getContext("2d");
    var config = {
        // The type of chart we want to create
        type: 'line',
        // The data for our dataset
        data: {
            datasets: [{
                    label: 'Temperature ( in front of rack )',
                    backgroundColor: 'rgb(35, 155, 86)',
                    borderColor: 'rgb(35, 155, 86)',
                    borderWidth: 3,
                    fill: 'false',
                },
                {
                    label: 'Temperature ( behind of rack )',
                    backgroundColor: 'rgb(255, 204, 0)',
                    borderColor: 'rgb(255, 204, 0)',
                    borderWidth: 3,
                    fill: 'false',
                },
                {
                    label: 'Humidity',
                    backgroundColor: 'rgb(79, 129, 189)',
                    borderColor: 'rgb(79, 129, 189)',
                    borderWidth: 3,
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

async function initDataHistoryGraph(this_data_HistoryGraph, this_HistoryGraph) {
    console.log("access initDataHistoryGraph");
    // let tmp_HistoryGraph = [];
    let index_value = 0;
    // let index_time = 0;
    console.log(this_data_HistoryGraph);
    if (typeof this_data_HistoryGraph != "undefined" && this_data_HistoryGraph != null && this_data_HistoryGraph.length > 0) {
        console.log("Found data (in function initDataHistoryGraph)");
        for (let j = 0; j < 3; j++) {
            //loop line graph
            for (let k = 0; k < (this_data_HistoryGraph.length / 3); k++) {
                //loop set value
                this_HistoryGraph.data.datasets[j].data.push(this_data_HistoryGraph[index_value].value);
                index_value++;
            }
        }
        for (let index = 0; index < (this_data_HistoryGraph.length / 3); index++) {
            //set y axis (time)
            this_HistoryGraph.data.labels.push(this_data_HistoryGraph[index].time.substr(11, 18));
            // index_time++;
        }
        index_time = index_value;
        this_HistoryGraph.update();
        // tmp_HistoryGraph.push(this_HistoryGraph);
        console.log(this_data_HistoryGraph[0].location);
        CheckSetInterval(this_HistoryGraph, null, false);

    } else {
        console.log("Not Found data (in function initDataHistoryGraph)");
        return;
    }


}


var times = ['1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM', '12PM'];
var j = 0;

function addData(this_HistoryGraph, init_Setinterval, check_setinterval) {

    console.log("access to addData()");

    this_HistoryGraph.data.labels.push(randomTime(times));
    this_HistoryGraph.data.datasets[0].data.push(randomNumber(21, 27));
    this_HistoryGraph.data.datasets[1].data.push(randomNumber(31, 27));
    this_HistoryGraph.data.datasets[2].data.push(randomNumber(51, 65));
    this_HistoryGraph.update();
    CheckSetInterval(this_HistoryGraph, init_Setinterval, check_setinterval);
    // console.log(`I will be displayed after 5 seconds i : ${j}`);
    // j++;

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
    if (this_HistoryGraph.data.datasets[0].data.length >= 10 && check_setinterval === true) { //
        // for stop setinterval() because a number of point data is full
        console.log("for stop setinterval() because a number of point data is full");
        clearInterval(init_Setinterval);
        check_setinterval = false;
    } else if (this_HistoryGraph.data.datasets[0].data.length >= 10 && check_setinterval === false) { //
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
    // }

    // if (check_setinterval === true) {
    //     console.log("access if");
    //     clearInterval(init_Setinterval);
    //     initSetinterval();
    // } else {
    //     console.log("access else");
    //     initSetinterval();
    // }
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
    // let label_NotFound = document.querySelectorAll(".label_NotFound");
    all_devices = await fetchConfigDevice();
    all_data_HistoryGraph = await fetch_Data_HistoryGraph();
    // console.log(all_devices);
    // console.log(all_data_HistoryGraph);
    let label_NotFound = document.querySelectorAll(".label_NotFound");

    for (let i = 0; i < all_devices.length; i++) {

        for (let j = 0; j < all_data_HistoryGraph.length; j++) {
            // console.log(all_devices[i].location);
            // console.log(all_data_HistoryGraph[j].location);
            if (all_devices[i].location === all_data_HistoryGraph[j].location) {
                console.log("found data");
                label_NotFound[i].style.display = "none";
                filter_data_HistoryGraph.push(all_data_HistoryGraph[j]);

            } else {
                console.log("not found data");
            }

        }
        initDataHistoryGraph(filter_data_HistoryGraph, all_HistoryGraph[i]);
        // console.log(filter_data_HistoryGraph);
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
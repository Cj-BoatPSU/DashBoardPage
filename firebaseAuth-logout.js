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
firebase.auth().signInWithEmailAndPassword("admin@monitoring.com", "Test123**");

// btn active to css
var header = document.getElementById("item_tabs");
var btns = header.getElementsByClassName("btn");
console.log(btns);
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
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
                console.log(temp.id);
                initProfile();
            }
        } else {
            // console.log("else");
            item.style.display = "none";
        }

    })
}

function logout() {
    firebase.auth().signOut().then(function() {
        console.log("Sign-out successful");
        localStorage.setItem("check-auth", false);
        sessionStorage.setItem("check-auth", false);
        window.location.href = "LoginPage.html"
    }).catch(function(error) {
        console.log(error);
    });

}

function checkAuth() {
    console.log("checkAuth function");
    console.log(localStorage.getItem("check-auth"));
    console.log(FIREBASE_CONFIG.projectId);
    if (localStorage.getItem("check-auth") === "false") {
        console.log(" no Auth");
        window.location.href = "LoginPage.html";
    }

}

// Profile section
function updateProfile() {
    // when to click save 
    var r = confirm("Are you sure to save changes?");
    if (r == true) {
        saveProfile();
    } else {
        console.log("click cancel");
    }

}

var firstname = document.getElementById("store_firstname");
var lastname = document.getElementById("store_lastname");
var contactEmail = document.getElementById("store_contactEmail");
var contactNumber = document.getElementById("store_contactNumber");
var profileInfo = db.collection("profileUser").doc("profile-info");

function initProfile() {
    profileInfo.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
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
            console.log("Document data:", doc.data());
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
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

const rmCheck = document.getElementById("rememberMe");
const emailInput = document.getElementById("email_field");

if (localStorage.checkbox && localStorage.checkbox !== "") {
    rmCheck.setAttribute("checked", "checked");
    emailInput.value = localStorage.username;
} else {
    rmCheck.removeAttribute("checked");
    emailInput.value = "";
}

function login() {
    //IsRememberMe
    if (rmCheck.checked && emailInput.value !== "") {
        localStorage.username = emailInput.value;
        localStorage.checkbox = rmCheck.value;
    } else {
        localStorage.username = "";
        localStorage.checkbox = "";
    }
    var userEmail = document.getElementById("email_field").value;
    var userPW = document.getElementById("password_field").value;
    console.log(userEmail + "      " + userPW);
    firebase.auth().signInWithEmailAndPassword(userEmail, userPW)
        .then((user) => {
            check_auth = true;
            localStorage.setItem("check-auth", true);
            console.log("login success!!!!");
            window.location.href = "Dashboard_test1.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });

}



function checkAuth() {
    console.log("checkAuth function");
    console.log(FIREBASE_CONFIG.projectId);
    console.log("--------------");
    if (localStorage.getItem("check-auth") === "true") {
        console.log("Auth");
        window.location.href = "Dashboard_test1.html";
    }
}
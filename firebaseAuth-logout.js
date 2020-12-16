
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
function logout() {
    firebase.auth().signOut().then(function () {
        console.log("Sign-out successful");
        localStorage.setItem("check-auth", false);
        sessionStorage.setItem("check-auth", false);
        window.location.href = "LoginPage.html"
    }).catch(function (error) {
        console.log(error);
    });

}

function checkAuth() {
    console.log("checkAuth function");
    console.log(localStorage.getItem("check-auth"));
    console.log(FIREBASE_CONFIG.projectId);
    if(localStorage.getItem("check-auth") === "false"){
        console.log(" no Auth");
        window.location.href = "LoginPage.html";
    } 
}



window.onloadstart = checkAuth();
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
    console.log(sessionStorage.getItem("check-auth"));
    console.log(typeof(sessionStorage.getItem("check-auth")));
    if(localStorage.getItem("check-auth") === "true"){
        console.log("Auth");
    }else {
        console.log("not Auth");
        window.location.href = "LoginPage.html";
    }
}


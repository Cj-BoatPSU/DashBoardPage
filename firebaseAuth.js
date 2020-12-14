const firebaseConfig = {
    apiKey: "AIzaSyAg9GN05-pHQAUkaTeMbmSbpjPW9xvvwP4",
    authDomain: "datacenterdashborad-project.firebaseapp.com",
    projectId: "datacenterdashborad-project",
    storageBucket: "datacenterdashborad-project.appspot.com",
    messagingSenderId: "986135600335",
    appId: "1:986135600335:web:f60def1a1f2c51e2e66bba"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// window.onloadstart = function() {
// firebase.auth().onAuthStateChanged((user) => {
//     if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/firebase.User
//       var uid = user.uid;
//        window.location.href= "Dashboard_test1.html";
//     } else {
//       // User is signed out
//       window.location.href= "LoginPage.html";
//     }
//   });
// }
// const rmCheck = document.getElementById("rememberMe"),
// var userEmail = document.getElementById("email_field").value;
// if (localStorage.checkbox && localStorage.checkbox !== "") {
// rmCheck.setAttribute("checked", "checked");
// userEmail.value = localStorage.username;
// } else {
// rmCheck.removeAttribute("checked");
// userEmail.value = "";
// }

function login() {

    var userEmail = document.getElementById("email_field").value;
    var userPW = document.getElementById("password_field").value;
  
    console.log(userEmail + "      " + userPW);
    firebase.auth().signInWithEmailAndPassword(userEmail, userPW)
        .then((user) => {
           console.log("login success!!!!");
           window.location.href="Dashboard_test1.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    
    // function lsRememberMe() {
    //   if (rmCheck.checked && userEmail.value !== "") {
    //     localStorage.username = userEmail.value;
    //     localStorage.checkbox = rmCheck.value;
    //   } else {
    //     localStorage.username = "";
    //     localStorage.checkbox = "";
    //   }
    // }


}

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign-out successful");
        window.location.href="LoginPage.html"
      }).catch(function(error) {
        console.log(error);
      });
      
}

var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");

var stats;

function loadDashboard(){
    var userid = sessionStorage.getItem("userID");
    var query = users.doc(userid);
    query.get().then(user => {
        var data = user.data();
        var objUser = User(data.username, data.email, data.score, data.challengesPlayed);
        var str = UserToParce(objUser);
        var stringify = JSON.stringify(str);
        sessionStorage.setItem("userObject", stringify);
    });

    var stats = seeStats();
    StatsofFriends();
}

firebase.auth().onAuthStateChanged(function(user){
    console.log("authentication changed");
    if(user){
        printName(user);
    }
    var user = firebase.auth().currentUser;
    var emailRef = firestore.collection("users").doc(user.uid);
    emailRef.get().then(function(doc) {
        if (doc.exists) {
            document.getElementById("name").innerHTML = doc.data().username;
        } else {
            // doc.data() will be undefined in this case
            alert("User not found");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

    // var username = firebase.collection("users").doc(user.uid).get()

});

function printName(user){
    //TODO: this gives and error, check it.
    //document.getElementById("name").innerHTML = user.displayName;
}


function linkGoogleAccount()
{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {
        // Accounts successfully linked.
        var credential = result.credential;
        var user = result.user;
        alert("linking successful");
        // ...
    }).catch(function(error) {
        alert("Error linking");
        // Handle Errors here.
        // ...
    });
}

function signOut(){
  sessionStorage.removeItem("userID");
    console.log("Llama el metodo");
    //sessionStorage.removeItem("userID");
    sessionStorage.clear();

    firebase.auth().signOut().then(function() {
        document.location.href = "../index.html";
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });

}

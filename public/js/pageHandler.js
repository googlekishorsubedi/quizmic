
var User;

firebase.auth().onAuthStateChanged(function(user){
    // console.log("authentication changed");
    
    // var user = firebase.auth().currentUser;
    // var emailRef = firestore.collection("users").doc(user.uid);
    // emailRef.get().then(function(doc) {
    //     if (doc.exists) {
    //         document.getElementById("name").innerHTML = doc.data().username;
    //     } else {
    //         // doc.data() will be undefined in this case
    //         alert("User not found");
    //     }
    // }).catch(function(error) {
    //     console.log("Error getting document:", error);
    // });

    // var username = firebase.collection("users").doc(user.uid).get()

});


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
    console.log("Llama el metodo");
    firebase.auth().signOut().then(function() {
        document.location.href = "../index.html";
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
    });

}
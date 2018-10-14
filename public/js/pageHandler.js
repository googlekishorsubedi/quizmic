var User;

firebase.auth().onAuthStateChanged(function(user){
    console.log("authentication changed");
    if(user){
        printName(user);
    }
        
})

function printName(user){
    document.getElementById("name").innerHTML = user.displayName;
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

//another way to do it
//sign_out.addEventListener('click', function(){});

function signOut(){
    firebase.auth().signOut().then(function() {
        document.location.href = "index.html";
        // Sign-out successful.
    }).catch(function(error) {
        // An error happened.
        console.log("The sign out was not done");
    });
}

function redirectToPage(){
    document.location.href = "../html/dashboard.html"
}
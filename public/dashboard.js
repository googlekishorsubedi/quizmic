var User;
var sign_out = document.getElementById('signout');

firebase.auth().onAuthStateChanged(function(user){
    if(user){
        printName(user);
    }
        
})

function printName(user){
    document.getElementById("name").innerHTML = user.displayName;
}


sign_out.addEventListener('click', function(){

firebase.auth().signOut().then(function() {
    document.location.href = "index.html";
    // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
    });

});
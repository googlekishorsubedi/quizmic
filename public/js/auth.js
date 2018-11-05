window.onload()
{
    var user = firebase.auth().currentUser;
    if(user)
    {
        signOut();
    }
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

var auth = firebase.auth();


function forgotPassword(){
    var emailAddress = document.getElementById("forgotEmailAddress").value;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        alert("A reset email has been sent to your email.");
      }).catch(function(error) {
        // An error happened.
        alert("Couldn't reset. This might occur if the email address is invalid");
      });
}

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

function loginWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result){
        document.location.href = "../html/dashboard.html";

        //window.alert(result.user.displayName);
        //document.getElementById("UserName").innerHTML = result.user.
    });
}

function registerUser(name, uid, email)
{
    firestore.collection("users").doc(uid).set({
        emailaddress: email,
        username: name,
        score: 0,
        challengesPlayed: 0,
        contactList: [],
        ownChallenges: [],

    }).then(function(){
        firestore.collection("users").doc(uid).collection("assignedChallenges").add({})
    }).catch(function(error){
        alert(error);
    });

}

function registerUsername(username, email){
    firestore.collection("username").doc(username).set({
        emailaddress: email
    }).then(function(){
        document.location.href = "../html/dashboard.html";
    }).catch(function(error){
        alert(error);
    });
}

function createNewUser(username, email, password)
{
    if(username.length <6){
        alert("Username has to have atleast 6 characters");
        return;
    }
    var docRef = firestore.collection("username").doc(username);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            alert("Username exists. Please try a different username");
            return;
        } else {
            console.log("Username is available.");
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
                //register users firstname, lastname, email into usercoll
                var user = firebase.auth().currentUser;
                console.log('Calling register now');
                console.log(user);
                registerUser(username, user.uid, email);
                registerUsername(username, email);

            }).catch(function(error) {
                console.log("Error signing up");
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                }
                else
                if(errorCode == 'auth/email-already-in-use'){
                    alert('Email is already in use');
                }
                else{
                    alert(errorCode);
                }
                // ...
            });
            // doc.data() will be undefined in this case

        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return;
    });
}

function loginwithEmail(email, password)
{
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        //get request for challenge/user/ objects
        var user = firebase.auth().currentUser;
        console.log(user.uid);

        document.location.href = "../html/dashboard.html";
        // Sign-out successful.
    }).catch(function(error) {
        console.log("Error logging in");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
            alert('Wrong Password.');
        }
        else
        if(errorCode == 'auth/user-not-found'){
            alert('User Not found');
        }
        else{
            alert(errorCode);
        }
        // ...
    });
}

function signUser(email, password)
{
    var isemail = false;
    for (i = 0; i < email.length; i++) {
        if(email[i] == '@'){
            isemail= true;
            break;
        }
    }
    if(isemail)
    {
        loginwithEmail(email, password);
    }
    else{
        var emailRef = firestore.collection("username").doc(email);
        emailRef.get().then(function(doc) {
            if (doc.exists) {
                loginwithEmail(doc.data().emailaddress, password);
            } else {
                // doc.data() will be undefined in this case
                alert("User not found");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

}
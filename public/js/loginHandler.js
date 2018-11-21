const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

function loginWithGoogle() {
    //TODO: This functions does not make a user with this method.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        var email = user.email;

        var userRef = firestore.collection("users").doc(uid);
        userRef.get().then(function (doc) {
            if (doc.exists) {
                //the user is signing in, jus
                document.location.href = "../html/dashboard.html";
            } else {
                // create new user in the users table
                createUserQUERY("", uid, email);
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        //if first time i.e user.uid not in users key, make a new user with the key user.uid, set all attributes except username
        //if signing in, 


        //

        //window.alert(result.user.displayName);
        //document.getElementById("UserName").innerHTML = result.user.
    });
}


function linkGoogleAccount() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().currentUser.linkWithPopup(provider).then(function (result) {
        // Accounts successfully linked.
        var credential = result.credential;
        var user = result.user;
        alert("linking successful");
        // ...
    }).catch(function (error) {
        alert("Error linking");
        // Handle Errors here.
        // ...
    });
}



function forgotPassword() {
    document.location.href = "../html/forgotPassword.html";
}

/**
 * Create a User
 * @param username the UID
 * @param email the email of the user
 * @param uid the uid assigned by firebase to the user.
 */
function createUserQUERY(username, uid, email) {
    var query = users.doc(uid).set({
        username: username,
        email: email,
        score: 0,
        ownChallenges: [],
        contactList: [],
        belongsToGroup: [],
        challengesPlayed: 0,
    }).then(function () {
        // Creates the reference in the username table
        if (username != '') {
            this.username.doc(username).set({ emailaddress: email, uid: uid });
        }
        // Add the assigned collection to the user.
        users.doc(uid).collection("assignedChallenges").add({});
        users.doc(uid).collection("ownGroups").add({});
        document.location.href = "../html/dashboard.html";
    })
}

function linkEmailPassword() {
    var username = document.getElementById("linkUsername").value;
    var email = document.getElementById("linkEmail").value;
    var password = document.getElementById("linkPassword").value;

    var user = firebase.auth().currentUser;
    var userid = user.uid;

    var credential = firebase.auth.EmailAuthProvider.credential(email, password);
    //check if username is valid or not
    var docRef = firestore.collection("username").doc(username);


    docRef.get().then(function (doc) {
        if (doc.exists) {
            alert("Username exists. Please try a different username");
            return;
        } else {

            firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential).then(function (usercred) {
                firestore.collection("username").doc(username).set({ emailaddress: email, uid: userid })
                    .then(response => {
                        firestore.collection("users").doc(userid).username = username;
                        var userRef = firestore.collection("users").doc(userid);

                        return userRef .update({
                            username: username
                        })
                        .then(function() {
                            console.log("Document successfully updated!");
                            var user = usercred.user;
                            console.log("Account linking success", user);
                            document.location.href = "../html/dashboard.html";
                        })
                        .catch(function(error) {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                        });
                        
                        
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }, function (error) {
                alert("Account linking error", error);
            });

        }
    }).catch(function (error) {
        console.log("Error fetching username:", error);
        return;
    });

}

function createNewUser(username, email, password) {
    if (username.length < 6) {
        alert("Username has to have at least 6 characters");
        return;
    }
    var docRef = firestore.collection("username").doc(username);

    docRef.get().then(function (doc) {
        if (doc.exists) {
            alert("Username exists. Please try a different username");
            return;
        } else {
            console.log("Username is available.");
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
                //register users firstname, lastname, email into usercoll
                var user = firebase.auth().currentUser;
                console.log('Calling register now');
                console.log(user);
                createUserQUERY(username, user.uid, email);
                //registerUsername(username, email);

            }).catch(function (error) {
                console.log("Error signing up");
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                    alert('The password is too weak.');
                }
                else
                    if (errorCode == 'auth/email-already-in-use') {
                        alert('Email is already in use');
                    }
                    else {
                        alert(errorCode);
                    }
            });

        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
        return;
    });
}

function loginwithEmail(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        //get request for challenge/user/ objects
        var user = firebase.auth().currentUser;
        console.log(user.uid);
        sessionStorage.setItem("userID", user.uid);
        document.location.href = "../html/dashboard.html";
        // Sign-out successful.
    }).catch(function (error) {
        console.log("Error logging in");
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/wrong-password') {
            alert('Wrong Password.');
        }
        else
            if (errorCode == 'auth/user-not-found') {
                alert('User Not found');
            }
            else {
                alert(errorCode);
            }
        // ...
    });
}

function signUser(email, password) {
    var isemail = false;
    for (i = 0; i < email.length; i++) {
        if (email[i] == '@') {
            isemail = true;
            break;
        }
    }
    if (isemail) {
        loginwithEmail(email, password);
    }
    else {
        var emailRef = firestore.collection("username").doc(email);
        emailRef.get().then(function (doc) {
            if (doc.exists) {
                loginwithEmail(doc.data().emailaddress, password);
            } else {
                // doc.data() will be undefined in this case
                alert("User not found");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }

}
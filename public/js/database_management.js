var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");


function createUserQUERY(username, email, password, scores){
    var query = users.doc(username).set({
        email: email,
        password: password,
        score: scores,
        ownChallenges: [],
        assignedChallenges:[],
        contactList: [],
        ownGroup: [],
        belongsToGroup: []
    })
}
function createGroupQUERY(groupName, groupOwnerUsername){
    var query = groups.add({
        groupName: groupName,
        groupOwner: users.doc(groupOwnerUsername),
        members: []
    }).then(function(e){
        // This transaction makes possible the update in the list of the user.
        var transaction = firestore.runTransaction(t => {
            return t.get(users.doc(groupOwnerUsername))
                .then(doc => {
                    const ownGroupArray = doc.data().ownGroup;
                    ownGroupArray.push(groups.doc(e.id));
                    t.update(users.doc(groupOwnerUsername), {ownGroup: ownGroupArray});
                });
        }).then(result => {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
        });
    });


}
function createChallengeQUERY(URL, songname, artist, genre, hint, creator){
    var query = challenges.doc().set({
        URL: URL,
        songname: songname,
        artist: artist,
        genre: genre,
        hint: hint,
        creator: users.doc(creator)
    });
    var save = users.doc(username).set({ownChallenges: query},{ merge: true })
}
function getUserbyUsernameQUERY(username){
    var query = users.where("username", "==", username);
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });

}
function getUserChallengesQUERY(username){
    var query = users.ownChallenges;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserGroupsQUERY(username){
    var query = users.belongsToGroup;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserAdminGroupsQUERY(username){
    var query = users.ownGroup;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserAssignedChallenges(username) {
    var query = users.assignedChallenges;
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });
}
function getUserbyEmailQUERY(email){
    var query = users.where("email", "==", email);
    query.get().then(function(results) {
        if(results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function(error) {
        console.log("Error getting documents:", error);
    });

}

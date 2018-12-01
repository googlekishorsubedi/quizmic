document.addEventListener("DOMContentLoaded", function(event) {
    var userObj = JSON.parse(sessionStorage.getItem("userObject"));
    document.getElementById("profilepic").src = userObj.img;
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(page === "settings.html"){
        document.getElementById("editprofilepic").src = userObj.img;
    }
});
function profileMain(){
  getUserContactsQUERY();
  getUserGroupQUERY();
}
var contactsArray = [];
var groupsArray = [];

function removeFriend(friendId){
    var userId = firebase.auth().currentUser.uid;
    var userDoc = firestore.collection("users").doc(userId);
    userDoc.update(
        {"contactList": firebase.firestore.FieldValue.arrayRemove(friendId)}
    ).catch(function(error) {
        alert("Error removing friend from your contactList: ", error);
    });
}

function leaveGroup(groupId){
    var userId = firebase.auth().currentUser.uid;

    var userDoc = firestore.collection("users").doc(userId);
    userDoc.update(
        {"belongsToGroup": firebase.firestore.FieldValue.arrayRemove(groupId)}
    ).catch(function(error) {
        alert("Error removing yourself from the group ", error);
    });


    var groupDoc = firestore.collection("groups").doc(groupId);
    groupDoc.update(
        {"members": firebase.firestore.FieldValue.arrayRemove(userId)}
    ).catch(function(error) {
        alert("Error removing yourself from the group", error);
    });

    groupDoc.get().then(function(doc){
        if(doc.exists){
            var membersArray = doc.data().members;
            if(membersArray.length === 0){
                //delete the doc itself
                firestore.collection("groups").doc(groupId).delete().then(function() {
                    console.log("Group successfully deleted as there were no members!");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }

        }
    })

}

function getUserContactsQUERY() {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user);
    var ownChallengesIDs = [];
    query.get().then(function (results) {
        if (results.exists) {
            var ownChallenges = results.data().contactList;

            ownChallenges.forEach(function (doc) {
                ownChallengesIDs.push(doc)
            });
        }
        else
            console.log("No documents found!");


            if (!Array.isArray(ownChallengesIDs) || !ownChallengesIDs.length) {
               needFriends();
            }
        ownChallengesIDs.forEach(function (e) {
          var contact = Contact(e);
          createButtonSectionsContact(contact);
          this.contactsArray.unshift(contact);
        });
    }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

function getUserGroupQUERY() {

    var user = sessionStorage.getItem("userID");
    var query = users.doc(user);
    var ownChallengesIDs = [];
    query.get().then(function (results) {
        if (results.exists) {
            var ownChallenges = results.data().belongsToGroup;
            ownChallenges.forEach(function (doc) {
                ownChallengesIDs.push(doc);
            });
        }
        else
            console.log("No documents found!");

        if (!Array.isArray(ownChallengesIDs) || !ownChallengesIDs.length) {
           needGroups();
        }
        ownChallengesIDs.forEach(function (e) {
            var query = groups.doc(e);
            query.get().then(function (results) {
                if (results.exists) {
                    var info = results.data();
                    var group = Group(info.groupName, results.id, info.groupOwner);
                    createButtonSectionsGroup(group);
                    this.groupsArray.unshift(group);

                }
                else
                    console.log("No group was found with that ID!");

            }).catch(function (error) {
                console.log("Error getting groups ID:", error);
            });
        });
    }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

function needGroups(){
  var div = document.createElement("div");
  div.className = "friendview groupview";

  var contactName = document.createElement("p");
  contactName.className = "contactName";
  contactName.innerHTML = "No Groups yet? Make your own.";

  div.appendChild(contactName);

  var ediv = null;
  if(groupsArray.length > 0)
      ediv =groupsArray[0].div;
  document.getElementById('mygroups').insertBefore(div, ediv);
}

function createButtonSectionsGroup(groupModel) {
    var div = document.createElement("div");
    groupModel.div = div;
    div.className = "friendview groupview";

    var contactName = document.createElement("p");
    contactName.className = "groupName";

    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
        leaveGroup(groupModel.id);
        //make the div disapear right away
    };
    contactName.innerHTML = groupModel.name;
    deleteButton.innerHTML = "Leave";

    div.appendChild(contactName);
    div.appendChild(deleteButton);

    var ediv = null;
    if(groupsArray.length > 0)
        ediv =groupsArray[0].div;
    document.getElementById('mygroups').insertBefore(div, ediv);
}

function createButtonSectionsContact(contactModel) {
    var div = document.createElement("div");
    contactModel.div = div;
    div.className = "friendview";

    var contactName = document.createElement("p");
    contactName.className = "contactName";

    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
        removeFriend(contactModel.name);

        //add code to remove the div right away
    };
    var query = firestore.collection("users").doc(contactModel.name);
    query.get().then(function(doc){

        if(doc.exists){
            //var id = doc.data().username;
            contactName.innerHTML = doc.data().username;

        }
    }).catch(function(error){
        console.log("error");
    });
    deleteButton.innerHTML = "Delete";

    div.appendChild(contactName);
    div.appendChild(deleteButton);

    var ediv = null;
    if(contactsArray.length > 0)
        ediv =contactsArray[0].div;
    document.getElementById('listoffriends').insertBefore(div, ediv);
}

function needFriends() {
    var div = document.createElement("div");
    div.className = "friendview";

    var contactName = document.createElement("p");
    contactName.className = "contactName";

    contactName.innerHTML = "No Contacts? Add some now.";

    div.appendChild(contactName);

    var ediv = null;
    if(contactsArray.length > 0)
        ediv =contactsArray[0].div;
    document.getElementById('listoffriends').insertBefore(div, ediv);
}

let show_add_friends = false;

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

function addfriendsbut() {
  if (show_add_friends){
    // hide in
    document.getElementById("friendUsername").style.display = "none";
    document.getElementById("addfriendsubmit").style.display = "none";
    show_add_friends = false;
  } else {
    // show it
    document.getElementById("friendUsername").style.display = "block";
    document.getElementById("addfriendsubmit").style.display = "block";
    show_add_friends = true;
  }
}

function invitebut() {
  if (show_add_friends){
    // hide in
    document.getElementById("findfriend").style.display = "none";
    document.getElementById("groupsearch").style.display = "none";
    document.getElementById("invitesubmit").style.display = "none";
    show_add_friends = false;
  } else {
    // show it
    document.getElementById("findfriend").style.display = "block";
    document.getElementById("groupsearch").style.display = "block";
    document.getElementById("invitesubmit").style.display = "block";
    show_add_friends = true;
  }


}

function makeaGroup()
{
    var user = firebase.auth().currentUser;
    var userRef = firestore.collection("users").doc(user.uid);

    var usernames= document.getElementById('CheckingUsername').value;
    var groupName = document.getElementById('nameofgroup').value;

    //var user = firebase.auth().currentUser;
    var potentialMembers = usernames.split(",");

    if(usernames === "" || groupName === ""){
        alert("Please add some group members or group name. Can't leave it blank.");
    }
    else{

        var query = firestore.collection("users").doc(user.uid).collection("ownGroups").doc(groupName);
        query.get().then(function(doc){
            if(doc.exists){
                alert("You've already created a group with this group name. PLease try again with a different name");
            }
            else{
                query = firestore.collection("users").doc(user.uid).collection("ownGroups");
                query.doc(groupName).set({
                }).then(function(x){
                    firestore.collection('groups').add({
                        groupName: groupName,
                        groupOwner: user.uid,
                        members: []
                    }).then(function (groupId) {
                        var groupid = groupId.id;
                        var groupRef = firestore.collection('groups').doc(groupid);

                        //add the creator to the group
                        var userRef = firestore.collection("users").doc(user.uid);
                        userRef.update({
                            belongsToGroup: firebase.firestore.FieldValue.arrayUnion(groupid)
                            });

                        var thisusername;
                        var query = firestore.collection("users").doc(user.uid);
                        query.get().then(function(doc){
                            if(doc.exists){
                                thisusername = doc.data().username;

                                groupRef.update({
                                    members: firebase.firestore.FieldValue.arrayUnion(user.uid)
                                    });

                                    var promises = [];
                                    var counter= 0;

                                    while(counter < potentialMembers.length)
                                    {
                                        if(potentialMembers[counter] === thisusername){

                                        }
                                        else{
                                            var query = firestore.collection('username').doc(potentialMembers[counter]);
                                            promises.push(query.get());

                                        }
                                        counter +=1 ;
                                    }
                                    Promise.all(promises).then( function(snapshots) {
                                        successful = [];
                                        unsuccessful = [];
                                        console.log(snapshots);
                                        var i = 0;
                                        while(i < snapshots.length){
                                            if(snapshots[i].exists){
                                                successful.push(snapshots[i]);
                                            }
                                            else
                                            {
                                                unsuccessful.push(snapshots[i]);
                                            }
                                            i +=1
                                        }

                                        i = 0;
                                        while(i < successful.length)
                                        {

                                            groupRef.update({
                                                            members: firebase.firestore.FieldValue.arrayUnion(successful[i].data().uid)
                                                            });

                                            userRef = firestore.collection("users").doc(successful[i].data().uid);

                                            userRef.update({
                                                belongsToGroup: firebase.firestore.FieldValue.arrayUnion(groupid)
                                                });

                                            i +=1;
                                        }
                                        if(unsuccessful.length ===0){
                                            alert("Group made successfully, added all the members.");
                                            createButtonSectionsGroup()
                                        }
                                        else{
                                            var k = [];
                                            var ctr = 0;
                                            while(ctr < unsuccessful.length){
                                                k.push(unsuccessful[ctr].id);
                                                ctr +=1 ;
                                            }
                                            alert("Group made successfully, but couldn't add " + k);
                                        }

                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })

                            }


                        });


                });
                });

            }
        });

    }


}

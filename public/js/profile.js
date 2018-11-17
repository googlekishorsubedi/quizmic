
// document.getElementById('creategroupbut').addEventListener('click', function(){
//   document.getElementById('creategroupbox').style.display = 'flex';
// });

function profileMain(){
  getUserContactsQUERY();
  getUserGroupQUERY();
}
var contactsArray = [];
var groupsArray = [];

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


        ownChallengesIDs.forEach(function (e) {
          // console.log(e);
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


        ownChallengesIDs.forEach(function (e) {
            var query = groups.doc(e);
            query.get().then(function (results) {
                if (results.exists) {
                    var info = results.data();
                    console.log(results.id);
                    var group = Group(info.groupName, results.id, info.groupOwner);
                    createButtonSectionsGroup(group);
                    console.log(group);
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

function createButtonSectionsGroup(groupModel) {
    var div = document.createElement("div");
    groupModel.div = div;
    div.className = "groupview";

    var contactName = document.createElement("p");
    contactName.className = "groupName";

    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function () {
      // delete friend and remove from the array. like this function

        // deleteChallenge(challenge, div, editButton, deleteButton);

    };

    contactName.innerHTML = groupModel.name;
    deleteButton.innerHTML = "Delete";

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
      // delete friend and remove from the array. like this function

        // deleteChallenge(challenge, div, editButton, deleteButton);

    };

    contactName.innerHTML = contactModel.name;
    deleteButton.innerHTML = "Delete";

    div.appendChild(contactName);
    div.appendChild(deleteButton);

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

    var user = firebase.auth().currentUser;
    var potentialMembers = usernames.split(",");

    if(usernames =="" || groupName == ""){
        alert("Please add some group members or group name. Can't leave it blank.");
        return;
    }
    else{

        var query = firestore.collection("users").doc(user.uid).collection("ownGroups").doc(groupName);
        query.get().then(function(doc){
            if(doc.exists){
                alert("You've already created a group with this group name. PLease try again with a different name");
                return;
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
                        var groupId = groupId.id;
                        var groupRef = firestore.collection('groups').doc(groupId);

                        //add the creator to the group
                        var userRef = firestore.collection("users").doc(user.uid);
                        userRef.update({
                            belongsToGroup: firebase.firestore.FieldValue.arrayUnion(groupId)
                            });

                        var thisusername;
                        var query = firestore.collection("users").doc(user.uid);
                        query.get().then(function(doc){
                            if(doc.exists){
                                thisusername = doc.data().username;

                                groupRef.update({
                                    members: firebase.firestore.FieldValue.arrayUnion(thisusername)
                                    });

                                    var promises = [];
                                    var counter= 0;

                                    while(counter < potentialMembers.length)
                                    {
                                        if(potentialMembers[counter] == thisusername){

                                        }
                                        else{
                                            var query = firestore.collection('username').doc(potentialMembers[counter]);
                                            promises.push(query.get());

                                        }
                                        counter +=1 ;
                                    }
                                    Promise.all(promises).then( function(snapshots) {
                                        successful = []
                                        unsuccessful = []
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

                                        var i = 0
                                        while(i < successful.length)
                                        {

                                            groupRef.update({
                                                            members: firebase.firestore.FieldValue.arrayUnion(successful[i].id)
                                                            });

                                            userRef = firestore.collection("users").doc(successful[i].data().uid);

                                            userRef.update({
                                                belongsToGroup: firebase.firestore.FieldValue.arrayUnion(groupId)
                                                });

                                            i +=1;
                                        }
                                        if(unsuccessful.length ===0){
                                            alert("Group made successfully, added all the members.")
                                        }
                                        else{
                                            var k = []
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

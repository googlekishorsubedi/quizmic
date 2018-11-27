firestore.settings(settings);
var users = firestore.collection("users");
var groups = firestore.collection("groups");
var challenges = firestore.collection("challenges");
var username = firestore.collection("username");

/**
 * Add user to group
 * @param username user to add UID
 * @param groupID ID of the group
 */

function addToGroup(username, groupID) {
    // Add member to
    var transaction = firestore.runTransaction(t => {
        return t.get(groups.doc(groupID))
            .then(doc => {
                const membersArray = doc.data().members;
                membersArray.push(users.doc(username));
                t.update(groups.doc(groupID), {members: membersArray});
            });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });

    var transaction2 = firestore.runTransaction(t => {
        return t.get(users.doc(username))
            .then(doc => {
                const belongsToGroup = doc.data().belongsToGroup;
                belongsToGroup.push(groups.doc(groupID));
                t.update(users.doc(username), {belongsToGroup: belongsToGroup});
            });
    }).then(result => {
        console.log('Transaction success!');
    }).catch(err => {
        console.log('Transaction failure:', err);
    });
}

/**
 * Get user by Username
 * @param username the user username
 */
function getUserbyUsernameQUERY(username) {
    var query = users.where("username", "==", username);
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            var user;
            // go through all results
            results.forEach(function (doc) {
                //user = doc.data().id;
                console.log("Document data:", doc.data());
            });


            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });

}

/**
 * Get user by Email
 * @param email the user email
 */
function getUserbyEmailQUERY(email) {
    var query = users.where("email", "==", email);
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

/**
 * Add user to contactlist
 * @param username user UID
 * @param contactUsername contact UID
 */
function addFriend(){
    var friendUsername = document.getElementById("friendUsername").value;
    var query = username.doc(friendUsername);

    query.get().then(function (doc) {
        if (doc.exists) {
            //adds friendUserName to current User's contact List
            var user = firebase.auth().currentUser;
            var userRef = users.doc(user.uid);
            userRef.get().then(function (results) {
            if (results.exists) {
                if(results.data().username == friendUsername){
                    alert("Can't add yourself to your friend's list")
                    return;
                }
                else
                {
                    //check if friendusername already in the array
                    var contactListArray = results.data().contactList;
                    for (i = 0; i < contactListArray.length; i++) {
                        if(contactListArray[i] == friendUsername)
                        {
                            alert("User already in your friend list");
                            return;
                        }
                    }

                    userRef.update({
                    contactList: firebase.firestore.FieldValue.arrayUnion(doc.data().uid)
                    });
                    alert("friend added");
                }
            } else
                alert("this Username not found.");
            }).catch(function (error) {
            console.log("Error getting user owned challenges:", error);
            });

        } else
            alert("Friend Username not found");
        }).catch(function (error) {
        console.log("Error getting user owned challenges:", error);
    });

}

function StatsofFriends(){
  sessionStorage.getItem("userID");
    var user = sessionStorage.getItem("userID");
    var query = firestore.collection("users").doc(user);
    query.get().then(function(doc){

        if(doc.exists){
            var contactList = doc.data().contactList;
            var promises = [];
            var ctr = 0;
            while(ctr < contactList.length){
                var query = firestore.collection("users").doc(contactList[ctr]);
                promises.push(query.get());
                ctr +=1;
            }
            Promise.all(promises).then(function(snapshot){
                snapshot.push(doc);
                arr = findTop3(0, snapshot.length-1, "ContactList", snapshot);
                constructFriendsStats(arr);
                return arr;

            }).catch(function(error){
            console.log("error");
    })
        }
    }).catch(function(error){
        console.log("error");
    })
}

function seeStats()
{
    var userId = sessionStorage.getItem("userID");
    var thisUserGroups;
    var thisuserName;
    var userTotalScore;
    var userTotalChallengesPlayed;
    //query users table and set both of those variables
    firestore.collection("users").doc(userId).get().then(function(doc){
        if(doc.exists){
            thisuserName = doc.data().username;
            userTotalScore = doc.data().score;
            userTotalChallengesPlayed = doc.data().challengesPlayed;
            thisUserGroups = doc.data().belongsToGroup;

            var promises = [];
            var counter = 0;
            while(counter < thisUserGroups.length)
            {
                var query = firestore.collection("groups").doc(thisUserGroups[counter]);
                promises.push(query.get());
                counter +=1;
            }
            var GroupvsMembersDict = {};

            Promise.all(promises).then(function(snapshot){
                var i = 0;
                while(i < snapshot.length){
                    if(snapshot[i].exists){
                        GroupvsMembersDict[snapshot[i].data().groupName] = snapshot[i].data().members;
                    }
                    i +=1;
                }
                var trackdict = [];
                var UserPromises = [];
                for(var key in GroupvsMembersDict){
                    //convert all GroupvsMembersDict[key] to promises.
                    var LocalUserpromises = [];
                    for(var each in GroupvsMembersDict[key]){
                        var query = firestore.collection("users").doc(GroupvsMembersDict[key][each]);
                        UserPromises.push(query.get());
                    }
                    trackdict.push( [UserPromises.length-1, key] );
                }

                Promise.all(UserPromises).then(function(snapshot){
                    var start = 0 ;
                    to_return_array = []
                    var counter = 0;
                    for(var each_group in trackdict){ //[2,hack], [6,hack2]...
                        //find top3 from snapshot[0] to snapshot[each_group[0]]
                        to_return_array.push(findTop3(start,trackdict[each_group][0], trackdict[each_group][1], snapshot));
                        start = trackdict[each_group][0]+1;
                    }
                    contructStats(to_return_array);
                    return to_return_array;
                }).catch((error) => {
                console.log(error);
                });

            }).catch((error) => {
            console.log(error);
            });

        }
        else
        {
            console.log("Cannot query this user's object")
        }
    }).catch(function(error){
        console.log("No such username to assign the challenge!");
    });

}
function constructFriendsStats(statsArrays){
  var friendsbox = document.getElementById("friendsstatisticsbox");
  var div = document.createElement("div");
  div.className = "flex-container statistics statisticsbox";

  if(statsArrays[2] == ""){
    //has no friends
    return;
  }
  else if (statsArrays[4] == "") {
    //has 1 friend
    var div1 = personDivMaker(statsArrays[1], statsArrays[2]);
    div.appendChild(div1);
  }
  else if (statsArrays[6] == ""){
    //has 2 friends
    var div1 = personDivMaker(statsArrays[1], statsArrays[2]);
    var div2 = personDivMaker(statsArrays[3], statsArrays[4]);
    div.appendChild(div1);
    div.appendChild(div2);
  }else{
    //has 3 or more friends
      var div1 = personDivMaker(statsArrays[1], statsArrays[2]);
      var div2 = personDivMaker(statsArrays[3], statsArrays[4]);
      var div3 = personDivMaker(statsArrays[5], statsArrays[6]);
      div.appendChild(div1);
      div.appendChild(div2);
      div.appendChild(div3);
  }


    friendsbox.appendChild(div);
}
var ugly;
function contructStats(statsArrays){
  ugly = to_return_array;
  // var friendsbox = document.getElementById("friendsstatisticsbox")
  var groupsbox = document.getElementById("groupsstatisticsbox")

  if(Array.isArray(statsArrays[0])){
    //This is a double array
    for(var array in statsArrays){
      var div = constructStatsView(statsArrays[array]);
      groupsbox.appendChild(div);
    }

  }else{
      var div = constructStatsView(statsArrays);
      groupsbox.appendChild(div);
  }
}

function constructStatsView(group3) {
  if(group3[2] == ""){
    return;
  }
  var div = document.createElement("div");
  div.className = "flex-container statistics statisticsbox";

  var thisgroupName = document.createElement("p");
  thisgroupName.className = "groupName";
  thisgroupName.innerHTML = group3[0];
  div.appendChild(thisgroupName);

  if(group3[4] == ""){
    // There is only two people
    var div1 = personDivMaker(group3[1], group3[2]);
    div.appendChild(div1);
  }else if (group3[6] == ""){
    // there is three people
    var div1 = personDivMaker(group3[1], group3[2]);
    var div2 = personDivMaker(group3[3], group3[4]);
    div.appendChild(div1);
    div.appendChild(div2);
  }else {
    var div1 = personDivMaker(group3[1], group3[2]);
    var div2 = personDivMaker(group3[3], group3[4]);
    var div3 = personDivMaker(group3[5], group3[6]);
    div.appendChild(div1);
    div.appendChild(div2);
    div.appendChild(div3);
  }
  return div;
    // var ediv = null;
    // document.getElementById('indivualchallenges').insertBefore(div, ediv);
}

function personDivMaker(name, score){


  var person1div = document.createElement("div");
  person1div.className = "flex-container statistics";

  var div1 = document.createElement("div");
  div1.className = "statisticspic";
  var person1pic = document.createElement("img");
  person1pic.className = "statisticspic";
  // Will actually need to call a method that finds a users associated photo.
  person1pic.src = "../avatarphotos/brownhair.png"
  // person1pic.alt = "../avatarphotos/brownhairboy.png"
  div1.appendChild(person1pic);

  var query = firestore.collection("username").doc(score);
  var img;
  query.get().then(function(doc){

      if(doc.exists){
          var id = doc.data().uid;
          console.log(id)
          query = firestore.collection("users").doc(id);
          query.get().then(function(doc){
              if(doc.exists){
                  person1pic.src = doc.data().img;
              }
          }).catch(function(error){
              console.log("error");
          });
      }
  }).catch(function(error){
      console.log("error");
  });

  var div2 = document.createElement("div");
  div2.className = "individualstatsheader";
  var person1name = document.createElement("p");
  person1name.innerHTML = Math.round(name);
  div2.appendChild(person1name);


  var div3 = document.createElement("div");
  div3.className = "individualstatsheader";
  var person1score = document.createElement("p");
  console.log(name);
  person1score.innerHTML = score;
  div3.appendChild(person1score);

  person1div.appendChild(div1);
  person1div.appendChild(div3);
  person1div.appendChild(div2);

  return person1div;
}

function averageScore(index, snapshot){
    if(snapshot[index].data().challengesPlayed == 0){
        return 0;
    }
    else{
        return snapshot[index].data().score/snapshot[index].data().challengesPlayed;
    }
}
function findTop3(startIndex, endIndex, groupName, snapshot)
{
    var top1score = 0;
    var top1player = "";
    var top2score = 0;
    var top2player = "";
    var top3score = 0;
    var top3player = "";

    while(startIndex <= endIndex){
        var startIndexScore = averageScore(startIndex, snapshot);
        var startIndexPlayer = snapshot[startIndex].data().username;

        if( startIndexScore  >= top3score){

            if(startIndexScore >= top2score){

                if(startIndexScore  >= top1score){
                    top3score = top2score;
                    top3player = top2player;

                    top2score = top1score;
                    top2player = top1player;

                    top1score = startIndexScore ;
                    top1player = startIndexPlayer;
                }
                else{

                    top3score = top2score;
                    top3player = top2player;

                    top2score = startIndexScore ;
                    top2player = startIndexPlayer;

                }

            }
            else{
                top3score = startIndexScore ;
                top3player = startIndexPlayer;
            }
        }
        startIndex +=1 ;
    }
    return [groupName, top1score, top1player, top2score, top2player, top3score, top3player];
}

function assignChallenge(challengeID, userName)

//todo: there is no confirmation that the challenge was sent to the user
{
    var docRef = firestore.collection("username").doc(userName);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var userId = doc.data().uid;
            //check if it has already been assigned or not
            var challengeRef = firestore.collection("users").doc(userId).collection("assignedChallenges").doc(challengeID);

            challengeRef.get().then(function(doc) {
                if (doc.exists) {
                    alert("already assigned");
                } else {
                    firestore.collection("users").doc(userId).collection("assignedChallenges").doc(challengeID).set({challengeid: challengeID, wasPlayed: false});
                }
            }).catch(function(error) {
                console.log("Error assigning the challenge", error);
            });

        } else {
            // doc.data() will be undefined in this case
            console.log("No such username to assign the challenge!");
            window.alert('Username does not exist');

        }
    }).catch(function(error) {
        console.log("Error assigning the challenge", error);
        window.alert('Error assigning the challenge');
    });

}

/**
 * Creates a group
 * @param groupName name of the group
 * @param groupOwnerUsername the ownser UID
 */
function createGroupQUERY(groupName, groupOwnerUsername) {
    var query = groups.add({
        groupName: groupName,
        groupOwner: users.doc(groupOwnerUsername),
        members: []
    }).then(function (e) {
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
        addToGroup(groupOwnerUsername, e.id)
    });
}

function getUserGroupsQUERY(username) {

    var query = users.belongsToGroup;
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

function getUserAssignedChallenges(username) {

    var query = users.assignedChallenges;
    query.get().then(function (results) {
        if (results.empty) {
            console.log("No documents found!");
        } else {
            // go through all results
            results.forEach(function (doc) {
                console.log("Document data:", doc.data());
            });

            // or if you only want the first result you can also do something like this:
            //console.log("Document data:", results.docs[0].data());
        }
    }).catch(function (error) {
        console.log("Error getting documents:", error);
    });
}

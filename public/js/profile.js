
// document.getElementById('creategroupbut').addEventListener('click', function(){
//   document.getElementById('creategroupbox').style.display = 'flex';
// });

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
    var usernames = document.getElementById('CheckingUsername').value;
    var groupName = document.getElementById('nameofgroup').value;

    var user = firebase.auth().currentUser;
    var potentialMembers = usernames.split(",");

    firestore.collection('groups').add({
            groupName: groupName,
            groupOwner: user.uid,
            members: []
        }).then(function (groupId) {
            // This transaction makes possible the update in the list of the user.
            var groupId = groupId.id;
            var groupRef = firestore.collection('groups').doc(groupId);
            var promises = [];
            var counter= 0;
            while(counter < potentialMembers.length)
            {
                var query = firestore.collection('username').doc(potentialMembers[counter]);
                promises.push(query.get());
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
                console.log(successful);
                console.log(unsuccessful);
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

    });

}

document.addEventListener("DOMContentLoaded", function(event) {
    var userObj = JSON.parse(sessionStorage.getItem("userObject"));
    document.getElementById("profilepic").src = userObj.img;
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if(page === "settings.html"){
        document.getElementById("editprofilepic").src = userObj.img;
    }
});
function openprofilepopup() {
  document.getElementById("profilepicpopup").style.display = "block";
}

function closeprofilepopup() {
    document.getElementById("profilepicpopup").style.display = "none";
}

function changeProfilePic(newPic){
    var userid = sessionStorage.getItem("userID");
    var query = users.doc(userid);
    firestore.runTransaction(t => {
        return t.get(query).then( u => {
            console.log("Enters transaction");
            console.log(u.data());
            var userObj = JSON.parse(sessionStorage.getItem("userObject"));
            var objUser = User(userObj.username, userObj.email, userObj.score, userObj.challengesPlayed, newPic);
            var str = UserToParce(objUser);
            var stringify = JSON.stringify(str);
            sessionStorage.setItem("userObject", stringify);
            document.getElementById("profilepic").src = newPic;
            document.getElementById("editprofilepic").src = newPic;

            t.update(query, {img: newPic});
            }
        ).catch(e =>{
            console.log(e)
        })
    }).then(r => {
        console.log('done');
        closeprofilepopup()

    }).catch(e => {
        console.log(e)

    })

}
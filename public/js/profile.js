
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

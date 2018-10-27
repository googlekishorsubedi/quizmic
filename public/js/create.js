
function createMain(){
  var challengeholder = document.getElementById('indivualchallenges');

  var challengeList = fakeDataQuery(5);

  //change this to adjust how many nodes show up
  var length = 5; //usually we would do challengeList.length

  for(var i = 0; i < length; i++){
    var div = createDiv(challengeList[0], challengeList[1], i);
    challengeholder.appendChild(div);
  }

}

// This function creates a div object from a given string of the creator of the challenge
// the artist of the specific song, and the amount of points this challenge contains.
// It will return the created div.
function createDiv(assigned, artist, points){
  var div = document.createElement("div");
  div.className = "nodebuddyholder";

  var challengeName = document.createElement("p");
  challengeName.className = "challengeName";

  var assignButton = document.createElement("button");
  assignbutton.className = "assignButton";

  var editButton = document.createElement("button");
  editButton.className = "editButton";

  var deleteButton = document.createElement("button");
  deleteButton.className = "deleteButton"

  challengeName.innerHTML = assigned + " ";
  assignButton.innerHTML = "Assign";
  editButton.innerHTML = "Edit";
  deleteButton.innerHTML = "Delete";

  div.appendChild(challengeName);
  div.appendChild(assignButton);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  return div;
}

//This function will call whatever actual function that Kishor or Kristalys makes
//and it will return the results probably in a double array.
//for right now it just has dummy representation
function fakeDataQuery(howManyResults){
  return ["Assigned by ___", "Artist", "Points"];
}

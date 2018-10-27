
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

  var assignedBy = document.createElement("p");
  assignedBy.className = "creatorUsername";

  var artistBy = document.createElement("p");
  artistBy.className = "artist";

  var pointsBy = document.createElement("p");
  pointsBy.className = "points";

  assignedBy.innerHTML = assigned + " ";
  artistBy.innerHTML = artist + " ";
  pointsBy.innerHTML = points + " ";

  div.appendChild(assignedBy);
  div.appendChild(artistBy);
  div.appendChild(pointsBy);

  return div;
}

//This function will call whatever actual function that Kishor or Kristalys makes
//and it will return the results probably in a double array.
//for right now it just has dummy representation
function fakeDataQuery(howManyResults){
  return ["Assigned by ___", "Artist", "Points"];
}

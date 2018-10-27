
//This is the main function called by onload on the play.html
function playMain(){
  var genre = document.getElementById('bygenre');
  var artist = document.getElementById('byartist');
  var popular = document.getElementById('bypopular');
  var personally = document.getElementById('bypersonallyassigned');

  // the purpose of this code is that it will make the divs, how fakeDataQuery gets this information is not important
  // more than likely however it will be returned in an array.

  // Change the value of length to change how many question nodes are shown.
  var length = 4;

  for(var i = 0; i < length; i++){
    var dataHolder = fakeDataQuery(i);
    var div1 = createDiv(dataHolder[0], dataHolder[1], i);
    var div2 = createDiv(dataHolder[0], dataHolder[1], i);
    var div3 = createDiv(dataHolder[0], dataHolder[1], i);
    var div4 = createDiv(dataHolder[0], dataHolder[1], i);

    genre.appendChild(div1);
    artist.appendChild(div2);
    popular.appendChild(div3);
    personally.appendChild(div4);
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

  assignedBy.innerHTML = assigned + "fdfd f ";
  artistBy.innerHTML = artist + "fdsfs ";
  pointsBy.innerHTML = points + "sdfdsf ";

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

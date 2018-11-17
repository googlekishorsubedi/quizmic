//please refer to https://developers.google.com/youtube/iframe_api_reference
//for further documentation on functions.

var videoID = loadMainVideo();
function loadMainVideo(){
    var parsedChallenge = JSON.parse(sessionStorage.getItem("playingChallenge"));
    var id = parsedChallenge.youtubeID.split("https://www.youtube.com/watch?v=");

  //Somehow grabs the video id from the challenge, returns it.
  return id[1];
}
  // 2. This code loads the IFrame Player API code asynchronously.
  var tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  tag.allow = "autoplay";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // 3. This function creates an <iframe> (and YouTube player)
  //    after the API code downloads.
  var player;
  function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
      height: '0',
      width: '0',
      videoId: videoID,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  // 4. The API will call this function when the video player is ready.
  function onPlayerReady(event) {
    event.target.playVideo();
  }

  // 5. The API calls this function when the player's state changes.
  //    The function indicates that when playing a video (state=1),
  //    the player should play for six seconds and then stop.
  var done = false;
  function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
      setInterval(checkbButton, 100);
      setTimeout(stopVideo, 20000);
      done = true;

    }
  }

  //This function will stop the video so that the player won't be able to play longer than they are supposed to.
  function stopVideo() {
    blockButtons();
    player.stopVideo();
    document.location.replace("../html/create.html")

  }


  function checkbButton(){
    if(clicks){
      //this code correctly takes away 3 seconds from the video timer.
      setTimeout(stopVideo, 20000 - 10000);
      //player.stopVideo();
    }
  }

  var clicks = false;
  function onClickHint() {
      clicks = true;
      var hint_div = document.getElementById("hint_display");
      hint_div.innerText = playingChallenge.hint;
      hint_div.hidden = false;
      // document.getElementById("clicks").innerHTML = clicks;
  };

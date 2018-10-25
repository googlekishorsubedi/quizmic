function Challenge(youtubeID, song, artist, genre, hint, attempted, rightlyAnswered, isPublic, options, date, creator){
    this.challenge_youtubeID = youtubeID;
    this.challenge_song = song;
    this.challenge_artist = artist;
    this.challenge_genre = genre;
    this.challenge_hint = hint;
    this.challenge_attempted = attempted;
    this.challenge_rightlyAnswered = rightlyAnswered;
    this.challenge_isPublic = isPublic;
    this.challenge_options = options;
    this.challenge_creator = creator;
    this.challenge_date = date;

}
function User(name, username, email, score, challengesPlayed){
    this.user_name = name;
    this.user_username = username;
    this.user_email = email;
    this.user_score = score;
    this.user_challengesPlayed = challengesPlayed;


}
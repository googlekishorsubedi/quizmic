
function Challenge(challengeName, youtubeID, song, artist, genre, hint, attempted, rightlyAnswered, isPublic, options, date, creator, id){
   return {
    challengeName: challengeName,
    youtubeID: youtubeID,
    song: song,
    artist: artist,
    genre: genre,
    hint: hint,
    attempted: attempted,
    rightlyAnswered: rightlyAnswered,
    isPublic: isPublic,
    options: options,
    creator: creator,
    date: date,
    id: id
   }

}
function User(name, username, email, score, challengesPlayed){
   return {name: name,
    username: username,
    email: email,
    score: score,
    challengesPlayed: challengesPlayed}


}

var sign_in = document.getElementById('login');

sign_in.addEventListener('click', function(){
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider).then(function(result){


		
		document.location.href = "/.404.html";
		
		//window.alert(result.user.displayName);
		//document.getElementById("UserName").innerHTML = result.user.
	});
});



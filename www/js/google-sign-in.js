var provider = new firebase.auth.GoogleAuthProvider();

function googleSignin() {
   firebase.auth()

      .signInWithPopup(provider).then(function(result) {
         var token = result.credential.accessToken;
         var user = result.user;

         console.log(token)
         console.log(user)
         
         getEventsByMonth();

      }).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;

         console.log(error.code)
         console.log(error.message)
      });
}

function googleSignout() {
   firebase.auth().signOut()

      .then(function() {
         console.log('Signout Succesfull')
      }, function(error) {
         console.log('Signout Failed')
      });
}

function getRR() {
   firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
         // This gives you a Google Access Token. You can use it to access the Google API.
         var token = result.credential.accessToken;
         getEventsByMonth();
      }
      // The signed-in user info.
      var user = result.user;
      console.log(token)
      console.log(user)
      if (!user) {
         googleSignin();
      }
   }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      console.log(error.code)
      console.log(error.message)
      console.log(email)

   });
}

function initApp() {
      // Result from Redirect auth flow.
      // [START getidptoken]
      firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          getEventsByMonth();

          // [START_EXCLUDE]
         //  document.getElementById('quickstart-oauthtoken').textContent = token;
        } else {
         //  document.getElementById('quickstart-oauthtoken').textContent = 'null';
          // [END_EXCLUDE]
        }
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('You have already signed up with a different auth provider for that email.');
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
        // [END_EXCLUDE]
      });
      // [END getidptoken]

      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
         //  document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
         //  document.getElementById('quickstart-sign-in').textContent = 'Sign out';
         //  document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          // [END_EXCLUDE]
        } else {
          // User is signed out.
           var provider = new firebase.auth.GoogleAuthProvider();
           firebase.auth().signInWithRedirect(provider);
          
          
          // [START_EXCLUDE]
         //  document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
         //  document.getElementById('quickstart-sign-in').textContent = 'Sign in with Google';
         //  document.getElementById('quickstart-account-details').textContent = 'null';
         //  document.getElementById('quickstart-oauthtoken').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE]
      //  document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      })
         // if (!firebase.auth().currentUser) {
         // debugger;
         //  var provider = new firebase.auth.GoogleAuthProvider();
         //  firebase.auth().signInWithRedirect(provider);
         //  getRR();
          
       
      // }
      // [END authstatelistener]

      

      // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    }
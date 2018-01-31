/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    clear();
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    clear();
    return;
  }
  // Sign in with email and pass.
  // [START authwithemail]
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    getEventsByMonth();
    myApp.router.navigate('/');

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    }
    else {
      alert(errorMessage);
    }
    console.log(error);
    clear();
    // [END_EXCLUDE]
  });
  // [END authwithemail]
}


/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;
  var confirm = $$('#confirm-password').val();
  // // if (!email.endsWith("@nestmk12.net")) {
  // //   alert('Please enter your @nestmk12.net email.');
  // //   return;
  // }
  if (password.length < 4) {
    alert('Your password is too short.');
    clearCreatePW()
    return;
  }

  if (password != confirm) {
    alert('Your passwords do not match.');
    clearCreatePW()
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: $$('#new-name').val(),
      // photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
      console.log("displayName added");
    }).catch(function(error) {
      console.log(error);
    });
    console.log(user);
    sendEmailVerification();
    authorizationScreen.open({
      animate: true
    })

  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    }
    else {
      alert(errorMessage);
    }
    console.log(error);
    clearCreatePW();
  });
}


/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    console.log('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    }
    else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      console.log("signed in");
      myApp.user = user;
      
      var admin = ['QyZRt0iucVZOZGIp1ZdAGaLpI1p2', 'j57jeOfjm8WdkeNDM4hm5uHdojt2']
      if (admin.includes(user.uid)) {
        myApp.user.admin = true;
      } else {
        myApp.user.admin = false;
      }
      // console.log(JSON.stringify(user, null, '  '));
      loginScreen.close({
        animate: true
      });
      
      if (!myApp.user.emailVerified) {
        console.log("email not verified");
      }
      // [END_EXCLUDE]
    }
    else {
      // User is signed out.
      // [START_EXCLUDE]
      console.log("Signed Out");
      // Call login screen
      loginScreen.open({
        animate: true
      });
      // [END_EXCLUDE]
    }
  });
  // [END authstatelistener]
}

// function initAppCreate() {
//   // Listening for auth state changes.
//   // [START authstatelistener]
//   firebase.auth().onAuthStateChanged(function(user) {
//     // [START_EXCLUDE silent]
//     $$('#quickstart-verify-email').addClass("disabled hidden");
//     // [END_EXCLUDE]
//     if (user) {
//       // User is signed in.
//       var displayName = user.displayName;
//       var email = user.email;
//       var emailVerified = user.emailVerified;
//       var photoURL = user.photoURL;
//       var isAnonymous = user.isAnonymous;
//       var uid = user.uid;
//       var providerData = user.providerData;
//       // [START_EXCLUDE]

//       console.log(JSON.stringify(user, null, '  '));
//       if (!emailVerified) {
//         console.log("email not verified");
//         // $$('#quickstart-verify-email').removeClass("disabled hidden");
//       }

//       // [END_EXCLUDE]
//     }
//     else {
//       // User is signed out.
//       // [START_EXCLUDE]
//       console.log("Signed Out");
//       // [END_EXCLUDE]
//     }

//   });
//   // [END authstatelistener]
// }

function continueIndex() {
  getEventsByMonth();
  // mainView.router.loadPage("index.html");
  authorizationScreen.close({
    animate: true
  });
}

function confirmOk() {
  myApp.dialog.confirm('Are you sure you want to log out?', 'NEST+m Event Tracker', function() {
    firebase.auth().signOut();
    // myApp.router.navigate('/login-screen/');
    loginScreen.open({
        animate: true
      });
  });
}


function clear() {
  // $$('#email').val("");
  $$('#password').val("");
}

function clearCreatePW() {
  $$('#confirm-password').val("");
  $$('#new-password').val("");
}

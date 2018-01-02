/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  // if (firebase.auth().currentUser) {
  //   // [START signout]
  //   firebase.auth().signOut();
  //   // [END signout]
  // }
  // else {
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
    // mainView.router.loadPage("index.html");
    myApp.closeModal();
    getEventsByMonth();


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
    // document.getElementById('quickstart-sign-in').disabled = false;
    // $$('#quickstart-sign-in').removeClass("disabled");

    // [END_EXCLUDE]
  });
  // [END authwithemail]
}
// document.getElementById('quickstart-sign-in').disabled = true;
// $$('#quickstart-sign-in').addClass("disabled");
// }

function clear() {
  $$('#email').val("");
  $$('#password').val("");
}

function clearCreatePW() {
  $$('#confirm-password').val("");
  $$('#new-password').val("");
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
    console.log(user);
    sendEmailVerification()
    // mainView.router.loadPage("authorization-page.html");
    $$('#content-goes-here').html(createAuthScreen);


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


// firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // [START_EXCLUDE]
//   if (errorCode == 'auth/weak-password') {
//     alert('The password is too weak.');
//   }
//   else {
//     alert(errorMessage);
//   }
//   console.log(error);
//   // [END_EXCLUDE]
//   return;

// }).then(sendEmailVerification());
// [END createwithemail]
// }
/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    // alert('Email Verification Sent!');
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
    // [START_EXCLUDE silent]
    // $$('#quickstart-verify-email').addClass("disabled hidden");
    // [END_EXCLUDE]
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
      // document.getElementById('quickstart-sign-in').textContent = 'Logout';

      // try to reload index
      // getEventsByMonth();
      // mainView.router.loadPage("index.html");

      console.log(JSON.stringify(user, null, '  '));
      if (!emailVerified) {
        console.log("email not verified");
        // $$('#quickstart-verify-email').removeClass("disabled hidden");
      }

      // [END_EXCLUDE]
    }
    else {
      // User is signed out.
      // [START_EXCLUDE]
      console.log("Signed Out");
      // document.getElementById('quickstart-sign-in').textContent = 'Login';

      // [END_EXCLUDE]
    }

  });
  // [END authstatelistener]
  // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
  // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
  // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

function initAppCreate() {
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    $$('#quickstart-verify-email').addClass("disabled hidden");
    // [END_EXCLUDE]
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

      console.log(JSON.stringify(user, null, '  '));
      if (!emailVerified) {
        console.log("email not verified");
        // $$('#quickstart-verify-email').removeClass("disabled hidden");
      }

      // [END_EXCLUDE]
    }
    else {
      // User is signed out.
      // [START_EXCLUDE]
      console.log("Signed Out");

      // [END_EXCLUDE]
    }

  });
  // [END authstatelistener]
  // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
  // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
  // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
  // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
}

function continueIndex() {
  getEventsByMonth();
  // mainView.router.loadPage("index.html");
  myApp.closeModal();
}

function confirmOk() {
  myApp.confirm('Are you sure you want to log out?', function() {
    firebase.auth().signOut();
    $$('#content-goes-here').html(createLogin);
    myApp.loginScreen();
  });
}

// $$('.confirm-ok').on('click', function () {

// });


myApp.onPageInit('index', function(page) {


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // check to see if verified
      if (!firebase.auth().currentUser.emailVerified) {
        // verification screen
        $$('#content-goes-here').html(createAuthScreen);
        myApp.loginScreen();
      }
      else {
        getEventsByMonth();
        myApp.closeModal();
      }
    }
    else {
      // No user is signed in.
      $$('#content-goes-here').html(createLogin);
      myApp.loginScreen();
    }
  });

}).trigger();


function signUp() {
  initAppCreate();
  var loginContent = $$('#content-goes-here');
  // fade('content-goes-here');
  loginContent.html(createContent);
  // unfade('content-goes-here');
}

function openCreateAccount() {
  initAppCreate();
  $$('#content-goes-here').html(createContent);
  myApp.loginScreen();
}

// $$('#quickstart-sign-up').on('click', function() {
//   $$('#content-goes-here').html(createContent);
// });


// $$('#cancel-sign-up').on('click', function() {
//   console.log("clicked!");
//       myApp.closeModal();
//       getEventsByMonth();
// });

function cancelNewAccount() {
  console.log("clicked!");

  if (firebase.auth().currentUser) {
    myApp.closeModal();
    getEventsByMonth();
  }
  else {
    $$('#content-goes-here').html(createLogin);
    myApp.loginScreen();
  }
}


// function fade(elementToFade) {
//   var element = document.getElementById(elementToFade);
//     var op = 1;  // initial opacity
//     var timer = setInterval(function () {
//         if (op <= 0.1){
//             clearInterval(timer);
//             element.style.display = 'none';
//         }
//         element.style.opacity = op;
//         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op -= op * 0.1;
//     }, 50);
// }

// function unfade(elementToFade) {
//   var element = document.getElementById(elementToFade);
//     var op = 0.1;  // initial opacity
//     element.style.display = 'block';
//     var timer = setInterval(function () {
//         if (op >= 1){
//             clearInterval(timer);
//         }
//         element.style.opacity = op;
//         element.style.filter = 'alpha(opacity=' + op * 100 + ")";
//         op += op * 0.1;
//     }, 10);
// }


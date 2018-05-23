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
    refreshEventPage();
    app.router.navigate('/');

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
    // console.log(user);
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
    // console.log('Email Verification Sent!');
    app.dialog.confirm('Email Authorication Sent', 'NEST+m Event Tracker')
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
      // console.log("user: " + user.uid);
      app.user = user;

      firebase.database().ref("admins/" + app.user.uid).once("value", snapshot => {
         var admin = snapshot.val();
         // console.log(admin);
         if (admin == app.user.email){
             // console.log("user is admin!");
             app.user.admin = true;
           } else {
             app.user.admin = false;
           }
         })
       // }
      // });

      // var admin = ['QyZRt0iucVZOZGIp1ZdAGaLpI1p2', 'j57jeOfjm8WdkeNDM4hm5uHdojt2', '9wa5aLywAQWgAlvUD8v2ySENGYS2', 'uUIJbVNuNzWpc8pRmkH3e2wwQQU2', 'y0DDHJsN7pMYUZCoe76fOVV6erF3', 'M2t8x0eviMelteFA1ZZe3t92TQE2', 'ZXjYu5w3vJVCFK2tIpnQLGet1IV2'];

      // if (admin.includes(user.uid)) {
      //   app.user.admin = true;
      // } else {
      //   app.user.admin = false;
      // }
      // console.log(JSON.stringify(user, null, '  '));
      loginScreen.close({
        animate: true
      });

      if (!app.user.emailVerified) {
        // console.log("email not verified");
        authorizationScreen.open({
            animate: true
          });
      }
      else {
        // console.log("email authorized");
        getMyEvents();
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

// get event notification roomInfo
// make a list of my events
function getMyEvents() {
  var myEvents = [];
  var myEventKeys = [];
  var dateMyEventAdded = [];
  var myEventInfo = [];

  var myEventData;
  myEventsRef.orderByKey().equalTo(app.user.uid).limitToFirst(1).on("child_added", function(snapshot) {
    myEventData = snapshot.val();

    for (var key in myEventData) {
      // console.log('Event Key:' + myEventData[key].eventkey);
      myEvents.push(myEventData[key].eventkey);
      myEventKeys.push(key);
      dateMyEventAdded.push(myEventData[key].dateadded);
      myEventInfo.push(myEventData[key]);
    }

    // 0 index is the key of the event, 1 index is the key of my event, 2 is date my event added
    app.user.events = [myEvents, myEventKeys, dateMyEventAdded, myEventInfo];
    // console.log(app.user.events);
    getNotifications();
  })
}

// var myNoteData = getNotifications(myEventData[key]);
// if (myNoteData.isNote) {
//   app.notification.create(myNoteData.notification).open();
// };

function getNotifications() {
  // get value by key
  var notedate = 0;
  var plural = '';
  var clubs = '';
  var clubnum = 0;
  var notification;
  var a = 'a ';
  // var isNote = false;
  var myNotifications = [];
  var myNoteKeys = [];
  var myEvents = app.user.events[0];
  var myEventKeys = app.user.events[1];
  var dateMyEventAdded = app.user.events[2];
  var myEventInfo = app.user.events[3];

  // for each event in myevents, check for notifications by event key
  for (var i = 0; i < myEvents.length; i++) {
    eventsRef.orderByKey().equalTo(myEvents[i]).limitToFirst(1).on("child_added", function(snapshot) {
      var eventData = snapshot.val();

      // if there are notifications
      if (typeof eventData.notifications != 'undefined') {
        for (var noteKey in eventData.notifications) {

          // debugger;
          // when a notification is deleted it is no longer undefined
            if (eventData.notifications[noteKey].datenow > dateMyEventAdded[i] & (typeof myEventInfo[i][noteKey] == 'undefined')) {
              eventData.notifications[noteKey].title = eventData.name;
              eventData.notifications[noteKey].myeventkey = myEventKeys[i];
              var datenow = eventData.notifications[noteKey].datenow;
              eventData.notifications[noteKey].datenow = timeSince(datenow);

              myNotifications.push(eventData.notifications[noteKey]);
              myNoteKeys.push(noteKey);

              if (!sessionStorage[noteKey]) {
              // check that clubs doesn't already contain this club & this notificaiton not already screen
              // prepares the pop up notification
                if (!clubs.includes(eventData.club)) {
                  if (clubnum > 0) {
                    clubs += ', ';
                  }
                  clubs += eventData.club;
                }
                clubnum++;

                // so that pop up doesn't continue the entire day
                sessionStorage[noteKey] = true;
                // isNote = true;
                // debugger;
                if (typeof eventData.lastnote != 'undefined') {
                  notedate = Math.max(notedate, eventData.lastnote);
                }
            }
          }

          // console.log("my note Keys" + myNoteKeys);

            if (i == myEvents.length - 1) {
              // debugger;
              if (clubnum > 1) {
                plural = 's';
                a = '';
              }

              if (clubnum > 0){
                  notification = {
                  title: clubs,
                  titleRightText: timeSince(notedate),
                  subtitle: 'You have ' + a + ' new notification' + plural,
                  text: 'Please check the notifications menu',
                  closeButton: true,
                };
                var myNotification = app.notification.create(notification);
                myNotification.open();
                myNotification.on('click', function() {
                  app.router.navigate('/mynotifications/')
                  myNotification.close();
                })
              }
            }
          }
        }

    })
  }
  app.user.notifications = [myNotifications, myNoteKeys];


  // console.log(app.user.notifications);
  setNotificationsCount();
}

function setNotificationsCount() {
  var numberNotifications = app.user.notifications[0].length;
  var numberSpan = (numberNotifications > 0) ? "<span class='badge color-red'>" + numberNotifications + "</span>": "";
  $$('#numberNotifications').html(numberSpan);
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  // if (interval > 1) {
  //   return interval + " years";
  // }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
    // return date.getDay()
  }
  if (interval == 1) {
    return "1 day ago";
  }
  interval = Math.floor(seconds / 3600);
  var daysOfWeek = ["Sun ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat "];
  var weekday;
  if (interval > 5) {
    var d = new Date(date);
    var hours = d.getHours();
    var ampm;
    if (hours > 11 && hours != 24) {
      ampm = " PM";
    }
    else {
      ampm = " AM";
    }
    if (hours > 12) {
      hours -= 12;
    }
    weekday = d.getDay();
    if (weekday == new Date().getDay()){
      weekday = "";
    }
    else {
      weekday = daysOfWeek[weekday];
    }
    var minutes = d.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return weekday + hours+ ':' + minutes + ampm;
  }
  if (interval >= 1) {
    return interval + "h ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval > 15) {
    return interval + "m ago";
    // return "now";
  }
  // return Math.floor(seconds) + " seconds";
  return "now";
  // }
}
// var aDay = 24*60*60*1000
// console.log(timeSince(new Date(Date.now()-aDay)));
// console.log(timeSince(new Date(Date.now()-aDay*2)));


  // look through all events
  // eventsRef.on("value", function(snapshot) {
  //   var data = snapshot.val();
  //   var elist = {};
  //   var clubs;

    // var notelist = [];
    // debugger;
    // for (var key in data) {
      // debugger;
      // add notificication if the user saved myevent before last notification created (datesaved <  last notedate)
      // and the user had not already received the notification (notification does not exist)
      // get all notifications tht happened after user's event added

      // be sure to add "createdate" field to user events and "lastnotedate" to events

      // if (app.user.events[0].includes(key) && data[key].lastnotedate > app.user.events[2][index for my event]) {
      //   if (typeof data[key].notification != 'undefined') {
          // var index = app.user.events[0].indexOf(key);
          // notelist.push({
          //   title: data[key].club,
          //   titleRightText: data[key].notification.datenow,
          //   subtitle: data[key].name,
          //   text: data[key].notification.message,
          //   closeButton: true,
          // });
          // if clubs.length > 0 {
          //   clubs += ', ';
          //   plural = 's';
          // }

          // clubs += data[key].club;
          // notedate = data[key].notification.datenow;




        // if (!plural) {
        //   var a = 'a';
        // }

    //     notification = {
    //       title: clubs,
    //       titleRightText: notedate,
    //       subtitle: 'You have ' + a + 'notification' + plural,
    //       text: 'Please check the notifications menu',
    //       closeButton: true,
    //     };
    //   }
    // }

    // send notificaiton
//   })
// }



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
  loginScreen.open({
      animate: true
    });
}

function confirmOk() {
  app.dialog.confirm('Are you sure you want to log out?', 'NEST+m Event Tracker', function() {
    firebase.auth().signOut();
    // app.router.navigate('/login-screen/');
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

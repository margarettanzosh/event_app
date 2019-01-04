/**
 * Handles the sign in button press.
 */
function toggleSignIn() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  if (email.length < 4) {
    app.dialog.confirm('Please enter an email address', 'NEST+m Event Tracker');
    clear();
    return;
  }
  if (password.length < 4) {
    app.dialog.confirm('Please enter a password', 'NEST+m Event Tracker');
    clear();
    return;
  }
  // Sign in with email and pass.
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    refreshEventPage();
    app.router.navigate('/');

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      app.dialog.confirm('Wrong password', 'NEST+m Event Tracker');
    }
    else {
      app.dialog.confirm(errorMessage, 'NEST+m Event Tracker');
    }
    console.log(error);
    clear();
  });
}


/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('new-email').value;
  var password = document.getElementById('new-password').value;
  var confirm = $$('#confirm-password').val();
  if (password.length < 4) {
    app.dialog.confirm('Your password is too short!', 'NEST+m Event Tracker');
    clearCreatePW()
    return;
  }

  if (password != confirm) {
    app.dialog.confirm('Your passwords do not match!', 'NEST+m Event Tracker');
    clearCreatePW()
    return;
  }
  // Sign in with email and pass.

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: $$('#new-name').val(),
    }).then(function() {
      console.log("displayName added");
    }).catch(function(error) {
      console.log(error);
    });
    sendEmailVerification();
    authorizationScreen.open({
      animate: true
    })

  }, function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      app.dialog.confirm('The password is too weak', 'NEST+m Event Tracker');
    }
    else {
      app.dialog.confirm(errorMessage, 'NEST+m Event Tracker');
    }
    console.log(error);
    clearCreatePW();
  });
}


/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    app.dialog.confirm('Email Authorication Sent', 'NEST+m Event Tracker');
  });
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    app.dialog.confirm('Password Reset Email Sent!', 'NEST+m Event Tracker');
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      app.dialog.confirm(errorMessage, 'NEST+m Event Tracker');
    }
    else if (errorCode == 'auth/user-not-found') {
      app.dialog.confirm(errorMessage, 'NEST+m Event Tracker');
    }
    console.log(error);
  });
}
/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {
      // User is signed in.
      app.user = user;

      firebase.database().ref("admins/" + app.user.uid).once("value", snapshot => {
         var admin = snapshot.val();
         if (admin == app.user.email){
             app.user.admin = true;
           } else {
             app.user.admin = false;
           }
         })

      loginScreen.close({
        animate: true
      });

      if (!app.user.emailVerified) {
        authorizationScreen.open({
            animate: true
          });
      }
      else {
        getMyEvents();
      }
    }
    else {
      // User is signed out.
      console.log("Signed Out");
      // Call login screen
      loginScreen.open({
        animate: true
      });
    }


  });
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
      myEvents.push(myEventData[key].eventkey);
      myEventKeys.push(key);
      dateMyEventAdded.push(myEventData[key].dateadded);
      myEventInfo.push(myEventData[key]);
    }

    // 0 index is the key of the event, 1 index is the key of my event, 2 is date my event added
    app.user.events = [myEvents, myEventKeys, dateMyEventAdded, myEventInfo];
    getNotifications();
  })
}

function getNotifications() {
  // get value by key
  var notedate = 0;
  var plural = '';
  var clubs = '';
  var clubnum = 0;
  var notification;
  var a = 'a ';
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
                if (typeof eventData.lastnote != 'undefined') {
                  notedate = Math.max(notedate, eventData.lastnote);
                }
            }
          }

            if (i == myEvents.length - 1) {
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

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
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
  }
  return "now";
}

function continueIndex() {
  loginScreen.open({
      animate: true
    });
}

function confirmOk() {
  app.dialog.confirm('Are you sure you want to log out?', 'NEST+m Event Tracker', function() {
    firebase.auth().signOut();
    loginScreen.open({
        animate: true
      });
  });
}


function clear() {
  $$('#password').val("");
}

function clearCreatePW() {
  $$('#confirm-password').val("");
  $$('#new-password').val("");
}

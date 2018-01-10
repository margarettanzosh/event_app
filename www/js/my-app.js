// Initialize app
var myApp = new Framework7({
    pushState: true,
    swipePanel: 'left',
    // smartSelectOpenIn: 'page',
    modalTitle: 'NEST+m Events'
    // smartSelectSearchbar:true
});



// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// var addView = myApp.addView('.view-add', {
//     // dynamicNavbar: true
// });

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
    myApp.alert('Here comes About page');
})

myApp.onPageInit('profile', function (page) {
    dynamicNavbar: true,
    myApp.closePanel();
})

myApp.onPageInit('edit', function(page){
  dynamicNavbar: true,
  myApp.popup('.popup-add');
  var calendar = myApp.calendar({
      input: '#date',
      dateFormat: 'yyyy-mm-dd'
      // toolbar: true
  });
  
  getEventsByKey();
  // myApp.showToolbar({toolbar: '#edit-toolbar'});
  myApp.closePanel();
})

myApp.onPageInit('add', function(page){

  var calendar = myApp.calendar({
      input: '#date',
      dateFormat: 'yyyy-mm-dd'
      // toolbar: true
  });
  
  var pickerDevice = myApp.picker({
   input: '#picker-device',
     cols: [
        {
           textAlign: 'center',
           values: getClubs()
        }
     ]
  });
  
  myApp.closePanel();
})

// myApp.onPageInit('login-screen', function(page){
  
//   myApp.closePanel();
// })

// try google sign in redirect
// myApp.onPageInit('index', function (page) {
// //     // if (!firebase.auth().currentUser) {
// //     //     var provider = new firebase.auth.GoogleAuthProvider();
// //     //     firebase.auth().signInWithRedirect(provider);
// //     //     getRR();
// //     //     // googleSignin();
// //     // }
// // $$('.open-login').on('click', function () {
// //   myApp.loginScreen('login-screen-page.html');
// // });
//     if (firebase.auth().currentUser) {

//         getEventsByMonth();
//     }
   
// }).trigger();


myApp.onPageInit('login-screen', function (page) {
  var pageContainer = $$(page.container);
  initApp();

  myApp.closePanel();
});

myApp.onPageInit('create-account-screen', function (page) {
  var pageContainer = $$(page.container);
  initAppCreate();

  myApp.closePanel();
});

$$('.login_screen_js').on('click', function () {
    myApp.loginScreen();
});

// <div class=“popup popOver”> </div> myApp.popup(’.popOver');

// Option 2. Using one 'pageInit' event handler for all pages:
// $$(document).on('pageInit', function (e) {
//     // Get page data from event data
//     var page = e.detail.page;
//
//     if (page.name === 'about') {
//         // Following code will be executed for page with data-page attribute equal to "about"
//         myApp.alert('Here comes About page');
//     }
//     else if (page.name === 'add') {
//         // Following code will be executed for page with data-page attribute equal to "add"
//         // myApp.alert('Here comes Add page');
//         myApp.closePanel();
//     }
//     else if (page.name === 'timelinePage') {
//         // Following code will be executed for page with data-page attribute equal to "add"
//         // myApp.alert('Here comes Add page');
//         myApp.closePanel();
//     }
// })

// // Option 2. Using live 'pageInit' event handlers for each page
// $$(document).on('pageInit', '.page[data-page="about"]', function (e) {
//     // Following code will be executed for page with data-page attribute equal to "about"
//     myApp.alert('Here comes About page');
// })


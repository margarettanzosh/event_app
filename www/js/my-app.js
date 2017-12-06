// Initialize app
var myApp = new Framework7({
    pushState: true,
    swipePanel: 'left'
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

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

myApp.onPageInit('add', function(page){

  var calendar = myApp.calendar({
      input: '#date',
      dateFormat: 'yyyy-mm-dd'
      // toolbar: true
  });
  myApp.closePanel();
})

myApp.onPageInit('timeline', function(page){
  myApp.closePanel();
})

myApp.onPageInit('login-screen', function (page) {
  var pageContainer = $$(page.container);
  pageContainer.find('.list-button').on('click', function () {
    var username = pageContainer.find('input[name="username"]').val();
    var password = pageContainer.find('input[name="password"]').val();
    // Handle username and password
    myApp.alert('Username: ' + username + ', Password: ' + password, function () {
      mainView.router.back();
    });
  });
});

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

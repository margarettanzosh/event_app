// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  domCache: true,
  xhrCache: false,
  theme: theme,
  data: function () {
    return {
      user: {
        displayName: '',
        email: '',
        admin: false,
        emailVerified: '',
        isAnonymous: false,
        uid: '',
        providerData: ''
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  navbar: {
   hideOnPageScroll: true,
 },
  statusbar: {
    enabled: true,
    iosTextColor: 'white',
    iosBackgroundColor: '#7B1FA2'
  },
  panel: {
     swipe: 'left',
   },
  // vi: {
  //   placementId: 'pltd4o7ibb9rc653x14',
  // },
});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  refreshEventPage();
})

$$(document).on('page:init', '.page[data-name="profile"]', function (e) {
  $$('#profile_name').html(app.user.displayName);
  app.router.refreshPage()
})


var loginScreen = app.loginScreen.create({
  el: '.login-screen',
  on: {
    opened: function () {
      console.log('Login Screen opened')
      $$('#email').val("");
      $$('#password').val("");
    }
  }
})

var createAccountScreen = app.popup.create({
  el: '.create-account-screen',
  on: {
    opened: function () {
      console.log('Create Account Screen opened')
    }
  }
})

var authorizationScreen = app.popup.create({
  el: '.authorization-screen',
  on: {
    opened: function () {
      console.log('Authorization Screen opened')
    },
    // closed: function() {
    //   refreshEventPage();
    // }
  }
})

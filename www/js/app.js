// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var myApp = new Framework7({
  id: 'io.framework7.testapp',
  root: '#app',
  // domCache: true,
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
      myApp.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  // vi: {
  //   placementId: 'pltd4o7ibb9rc653x14',
  // },
});


var loginScreen = myApp.loginScreen.create({
  el: '.login-screen',
  on: {
    opened: function () {
      console.log('Login Screen opened')
    }
  }
})

var createAccountScreen = myApp.popup.create({
  el: '.create-account-screen',
  on: {
    opened: function () {
      console.log('Create Account Screen opened')
    }
  }
})

var authorizationScreen = myApp.popup.create({
  el: '.authorization-screen',
  on: {
    opened: function () {
      console.log('Authorization Screen opened')
    },
    closed: function() {
      getEventsByMonth();
    }
  }
})

var monthName = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function eventAdd() {
  var name = $$('#name').val();
  var date = $$('#date').val();
  var club = $$('#club-picker').val();
  var desc = $$('#desc').val();
  var room  = $$('#room').val();
  var email = $$('#email').val();
  var time = $$('#time').val();

  // check that date and name entered
  if (!name || !date) {
    alert("Enter a name and date!");
  }
  else {
    // add to DB here
    saveToFB(name, date, club, desc, email, time, room);
    console.log("Added to DB!");
  }
  $$('#name').val("");
  $$('#date').val("");
  $$('#club').val("");
  $$('#desc').val("");
  $$('#room').val("");
  $$('#email').val("");
  $$('#time').val("");
};

function eventRemove(key) {
  eventsRef.child(key).remove();
  console.log("Event Deleted!");
}

// adds existing values to form
function eventUpdate(key) {
  app.router.navigate('/update-event/' + key);
};


function saveToFB(name, date, club, desc, email, time, room) {
  // this will save data to Firebase
  eventsRef.push({
    name: name,
    date: date,
    club: club,
    description: desc,
    email: email,
    time: time,
    room: room
  });
};

// swipeout for events or delete event
function refreshEventEdit(elist) {
  var elis = '<ul>';
  for (var i = 0; i < elist.length; i++) {



    var longDateStr = moment(elist[i].date, 'Y-M-D').format('ddd MMM D');
    elis += '<li class = "swipeout">' +
      '<div class="swipeout-content">' +

      ' <div class="item-inner margin-left">' + longDateStr + ':  ' + elist[i].name + ' </div>' +

      ' </div>' +
      '<div class="swipeout-actions-right">' +
      ' <a href="#" class="color-orange" onclick=eventUpdate("' + elist[i].key + '");>Edit</a>' +

      ' <a href="#" class="swipeout-delete" onclick=eventRemove("' + elist[i].key + '");>Delete</a></div>' +
      '</li>';
  };
  elis += '</ul>'
  // console.log(elis);
  $$('#eventEditList').html(elis);
};

function refreshUI(list) {
  var cbt = "";
  var thisMonth = new Date().getMonth();
  for (var month = thisMonth; month < thisMonth + 3; month++) {
    cbt +=  '<div class="block-title searchbar-found">' + monthName[month % 12] + '</div>' +
            '<div class="list components-list searchbar-found">';

    var lis = '<ul>';
    for (var i = 0; i < list[month % 12].length; i++) {
      var longDateStr = moment(list[month % 12][i].date, 'Y-M-D').format('dddd MMM D');
      // console.log(longDateStr);
      lis += '<li class="accordion-item"><a href="#" class="item-content item-link">' +
        ' <div class="item-inner">' +
        '   <div class="item-title"><small>' + longDateStr + '</small></br> <b><span class="title">' + list[month % 12][i].name + '</span> </b></div>' +
        ' </div></a>' +
        '<div class="accordion-item-content">' +
        '  <div class="block">' +
        '   <p>' + list[month % 12][i].description + '</p>' +
        ' </div>' +
        '</div>' +
        '</li>';
    };
    lis += '</ul>'
    cbt += lis + '</div></div>';
  }

  // console.log(lis);
  $$('#eventsID').html(cbt);

  // create searchbar
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.components-list',
    searchIn: 'a',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });
  // app.statusbar.show()
  // app.statusbar.iosOverlaysWebView(true)
};

function getEventsByKey() {
  //  this will get fired on inital load as well as when ever there is a change in the data
  eventsRef.on("value", function(snapshot) {
    var data = snapshot.val();
    var elist = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        name = data[key].name ? data[key].name : '';
        date = data[key].date;
        if (name.trim().length > 0) {
          elist.push({
            key: key,
            name: name,
            date: date,
            club: data[key].club,
            description: data[key].description,
            room: data[key].room,
            email: data[key].email,
            time: data[key].time
          })
        }
      }
    }
    refreshEventEdit(elist);
  })

}

function getClubs() {
  var options = [];
  clubsRef.on("value", function(snapshot) {
    var data = snapshot.val();

    for (var key in data) {
      options.push(data[key].club_name);
    }
    console.log(options);
  })
  return options;
}




function getEventsByMonth() {

  // validate that user is logged in
  initApp();

  var list = [];
  for (var i = 0; i < 12; i++) {
    list[i] = [];
  }

  eventsRef.orderByChild("date").on("child_added", function(snapshot) {
    var data = snapshot.val();
    date = data["date"];
    var month = eventMonth(date) - 1;
    if (date >= todayDate() && month >= 0 && month <= 11) {
      list[month].push({
        name: data["name"],
        date: data["date"],
        club: data["club"],
        description: data["description"],
        email: data["email"],
        room: data["room"],
        time: data["time"]
      })
    }


    function todayDate() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1; //January is 0!

      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      var todayDate = yyyy + '-' + mm + '-' + dd;
      return todayDate;
    }

    function eventMonth(date) {
      month = date.substring(5, 7);
      return month;
    }

    function eventDay(date) {
      day = date.substring(8, 9);
      return day;
    }

    function eventYear(date) {
      year = date.substring(0, 4);
      return year;
    }

    // refresh the UI
    refreshUI(list);
    // console.log(list);
  });

}

getEventsByMonth();

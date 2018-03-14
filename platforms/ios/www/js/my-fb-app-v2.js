var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

function saveToMyEvents(uid, eventkey) {
  myEvents = [];
  myEventsRef.orderByKey().equalTo(uid).limitToFirst(1).on("child_added", function(snapshot) {
    var eventData = snapshot.val();
    // debugger;
    for (var key in eventData) {
      console.log('Event Key:' + eventData[key].eventkey)
      myEvents.push(eventData[key].eventkey)
    }
    if (myEvents.includes(eventkey)) {
        app.dialog.alert("You've already saved this event!")
    }
    else {
      db.ref('myevents/' + uid).push({
        eventkey
      })
      app.dialog.alert('Event Added');
    }
  })
}


// swipeout for events or delete event
function refreshEventEdit(elist) {
  var clublis = '';
  for (club in elist) {
    clublis +=  '<div class="block-header" style="text-transform: uppercase;">' + club + '</div>' +
            '<div class="list components-list">';
    elis = '<ul>'
    var events = elist[club];

    for (var i = 0; i < events.length; i++) {

      var longDateStr = moment(events[i].date, 'Y-M-D').format('ddd MMM D');
      elis += '<li class = "swipeout">' +
        '<div class="swipeout-content">' +

        ' <div class="item-inner margin-left">' + longDateStr + ':  ' + events[i].name + ' </div>' +

        ' </div>' +
        '<div class="swipeout-actions-right">' +
        ' <a href="#" class="color-orange" onclick=eventUpdate("' + events[i].key + '");>Edit</a>' +

        ' <a href="#" class="swipeout-delete" onclick=eventRemove("' + events[i].key + '");>Delete</a></div>' +
        '</li>';
    };
    elis += '</ul>'
    clublis += elis + '</div></div>'
  }
  // elis += '</ul>'
  // console.log(elis);
  $$('#eventEditList').html(clublis);
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
      var roomInfo = "";
      var emailInfo = "";
      var comma = "";
      if (list[month % 12][i].room)
      {
        roomInfo = "Room " + list[month % 12][i].room;
      }
      if (list[month % 12][i].email)
      {
        emailInfo = "Contact: ";
      }
      if (list[month % 12][i].email && list[month % 12][i].time)
      {
        comma = ", ";
      }
      console.log(longDateStr);
      lis += '<li class="accordion-item"><a href="#" class="item-content item-link">' +
        ' <div class="item-inner">' +
        '   <div class="item-title"><small>' + longDateStr + '</small></br> <b><span class="title">' + list[month % 12][i].name + '</span> </b></div>' +
        ' </div></a>' +
        '<div class="accordion-item-content">' +
        '  <div class="block">' +
        '   <p style="margin: 1px 0;">' + list[month % 12][i].description + '</p>' +
        '   <p style="margin: 1px 0;">' + list[month % 12][i].club + '</p>' +
        '   <p style="margin: 1px 0;">' + list[month % 12][i].time + comma + roomInfo + '</p>' +
        '   <p style="margin: 1px 0;">' + emailInfo + '<a style="color: #7B1FA2;" class="external" target="_system" href="mailto:' + list[month % 12][i].email + '">' + list[month % 12][i].email + '</a></p>'
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
    searchIn: 'li',
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
    var elist = {};
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        name = data[key].name ? data[key].name : '';
        date = data[key].date;
        club = data[key].club;
        // if (name.trim().length > 0) {
        if (typeof elist[club] === 'undefined') {
          elist[club] = [];
        }
          elist[club].push({
            key: key,
            name: name,
            date: date,
            club: club,
            description: data[key].description,
            room: data[key].room,
            email: data[key].email,
            time: data[key].time
          })
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

// organize events page by club
function getEventsByClub() {
  // validate that user is logged in
  initApp();

  var clubList = {};

  clubsRef.on("value", function(club_snapshot) {
    var data = club_snapshot.val();
    for (var key in data) {
      clubList[data[key].club_name] = {
        // club_name: data[key].club_name,
        club_events: []
      }
    }

  // get clubs
  console.log(clubList)

  eventsRef.orderByChild("date").on("child_added", function(snapshot) {
    var data = snapshot.val();
    date = data["date"];

    // eventKey = data["club"];
    var month = eventMonth(date) - 1;
    if (date >= todayDate() && month >= 0 && month <= 11) {

      if (typeof clubList[data.club]=== 'undefined'){
        clubList[data["club"]] = {club_events: []}
      }

      clubList[data["club"]].club_events.push({
        key: snapshot.key, // undefined?
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
    refreshUIByClub(clubList);
  });
  })
}

function refreshUIByClub(clubList) {
  var cbt = "";
  var events;
  var thisMonth = new Date().getMonth();
  // for (var month = thisMonth; month < thisMonth + 3; month++) {
    for (club in clubList) {

    cbt +=  '<div class="block-title searchbar-found">' + club + '</div>' +
            '<div class="list components-list searchbar-found">';

    events = clubList[club].club_events;

    var lis = '<ul>';
    for (var i = 0; i < events.length; i++) {
      var longDateStr = moment(events[i].date, 'Y-M-D').format('dddd MMM D');
      var roomInfo = "";
      var emailInfo = "";
      var comma = "";
      if (events[i].room)
      {
        roomInfo = "Room " + events[i].room;
      }
      if (events[i].email)
      {
        emailInfo = "Contact: ";
      }
      if (events[i].email && events[i].time)
      {
        comma = ", ";
      }
      var stme = "saveToMyEvents('" + app.user.uid + "','" + events[i].key + "')"
      // console.log(stme)
      lis += '<li class="accordion-item swipeout"><a href="#" class="item-content item-link">' +
        ' <div class="item-inner swipeout-content">' +
        '   <div class="item-title"><small>' + longDateStr + '</small></br> <b><span class="title">' + events[i].name + '</span> </b></div>' +
        ' </div></a>' +

        '<div class="accordion-item-content">' +
        '  <div class="block">' +
        '   <p style="margin: 1px 0;">' + events[i].description + '</p>' +
        '   <p style="margin: 1px 0;">' + events[i].club + '</p>' +
        '   <p style="margin: 1px 0;">' + events[i].time + comma + roomInfo + '</p>' +
        '   <p style="margin: 1px 0;">' + emailInfo + '<a style="color: #7B1FA2;" class="external" target="_system" href="mailto:' + events[i].email + '">' + events[i].email + '</a></p>' +
        ' </div>' +
        '</div>' +
        '<div class="swipeout-actions-right">' +
        '   <a class="color-blue" href="#" onclick=' + stme + '>Add to My Events</a>' +
        '</div>'
        '</li>';

    };
    if (!events.length) {
      lis += '<li class="searchbar-hide-on-search" style="padding: 15px;">No Events</li>'
    }

    lis += '</ul>'

    cbt += lis + '</div></div>';
  }

  $$('#eventsID').html(cbt);

  // create searchbar
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.components-list',
    searchIn: 'li',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });

  // app.statusbar.show()
  // app.statusbar.iosOverlaysWebView(true)
};

function refreshEventPage() {
  if (typeof app.form.getFormData('settings-form') !== 'undefined' &&
    typeof app.form.getFormData('settings-form')['view-by'] !== 'undefined' &&
    app.form.getFormData('settings-form')['view-by'] === 'club') {
      getEventsByClub()
    } else {
      getEventsByMonth();
    }
}

refreshEventPage()

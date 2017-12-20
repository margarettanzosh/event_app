var monthName = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function eventAdd() {
  var name = $$('#name').val();
  var date = $$('#date').val();
  var club = $$('#picker-device').val();
  var desc = $$('#desc').val();
  var email = $$('#email').val();
  var time = $$('time').val();
  // check that date and name entered
  if (!name || !date) {
    alert("Enter a name and date!");
  }
  else {
    // add to DB here
    saveToFB(name, date, club, desc);
    console.log("Added to DB!");
  }
  $$('#name').val("");
  $$('#date').val("");
  $$('#club').val("");
  $$('#desc').val("");
  $$('email').val("");
  $$('time').val("");
};

function eventRemove(key) {
  eventsRef.child(key).remove();
  console.log("Event Deleted!");
}

// adds existing values to form
function eventUpdate(key) {

  // get value by key
  eventsRef.orderByKey().equalTo(key).limitToFirst(1).on("child_added", function(snapshot) {
    var formData = snapshot.val();

    // myApp.formFromJSON('#update-form', JSON.stringify(formData));
    myApp.onPageInit('update', function() {
      $$('#nameUpdate').val(formData.name);

      $$('#clubUpdate').val(formData.club);
      $$('#descUpdate').val(formData.description);

      $$('#dateUpdate').val(formData.date);
      $$('#emailUpdate').val(formData.email);
      $$('timeUpdate').val(formData.time);
      var addclick = '<a href="#" class="back link" id="update_event" onclick = updateEventDB("' + snapshot.key + '")>Save  </a>';
      $$('#onclicksave').html(addclick);
      
      var calendar = myApp.calendar({
        input: '#dateUpdate',
        dateFormat: 'yyyy-mm-dd'
      });
    });
  });
  
  // load update page with current input field data
  mainView.router.loadPage('update.html');
  
  // when event clicked on, call function to update database
  // $$('#update_event').on('click', function() {
  //   updateEventDB(key);
  // });
}

function updateEventDB(key) {
  var name = $$('#nameUpdate').val();
  var date = $$('#dateUpdate').val();
  var club = $$('#clubUpdate').val();
  var desc = $$('#descUpdate').val();
  var email = $$('emailUpdate').val();
  var time = $$('timeUpdate').val();
  // update DB here. Puts the new entry into the database
  eventsRef.child(key).update({
    name: name,
    date: date,
    club: club,
    description: desc,
    email: email,
    time: time
    
  })
  console.log("Event Updated! Key: " + key);

};

// not currently used clears out input fields
function eventClear() {
  $$('#name').val("");
  $$('#date').val("");
  $$('#club').val("");
  $$('#desc').val("");
  $$('email').val("");
  $$('time').val("");
}

function saveToFB(name, date, club, desc) {
  // this will save data to Firebase
  eventsRef.push({
    name: name,
    date: date,
    club: club,
    description: desc,
    email: email,
    time: time
  });
};

// swipeout for events or delete event
function refreshEventEdit(elist) {
  var elis = '<ul>';
  for (var i = 0; i < elist.length; i++) {
    
    

    var longDateStr = moment(elist[i].date, 'Y-M-D').format('ddd MMM D');
    elis += '<li class = "swipeout">' +
      '<div class="swipeout-content item-content">' +

      ' <div class="item-inner">' + longDateStr + ':  ' + elist[i].name + ' </div>' +

      ' </div>' +
      '<div class="swipeout-actions-right">' +
      ' <a href="#" data-popup=".popup-update" class="action1 bg-orange open-popup" onclick=eventUpdate("' + elist[i].key + '");>Edit</a>' +

      ' <a href="#" class="action2 swipeout-delete" onclick=eventRemove("' + elist[i].key + '");>Delete</a></div>' +
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
    cbt += '<div class="content-block-title">' + monthName[month % 12] + '</div>' +
      '<div class="list-block accordion-list">';

    var lis = '<ul>';
    for (var i = 0; i < list[month % 12].length; i++) {
      var longDateStr = moment(list[month % 12][i].date, 'Y-M-D').format('dddd MMM D');
      // console.log(longDateStr);
      lis += '<li class="accordion-item"><a href="#" class="item-content item-link">' +
        ' <div class="item-inner">' +
        '   <div class="item-title"><small>' + longDateStr + '</small></br> <b><span class="title">' + list[month % 12][i].name + '</span> </b></div>' +
        ' </div></a>' +
        '<div class="accordion-item-content">' +
        '  <div class="content-block">' +
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
            email: email,
            time: time,
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
    
    for (var key in data)
    {
      options.push(data[key].club_name);
    }
    console.log(options);
  })
  return options;
  // $$('#optionID').html(options);
}




function getEventsByMonth() {
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

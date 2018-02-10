function clubAdd() {
  var name = $$('#name').val();
  var leader = $$("#leader").val();
  var room  = $$('#room').val();
  var email = $$('#email').val();
  
  }
  
  // check that date and name entered
  if (!name || !email) {
    alert("Enter a name and email!");
  }
  else {
    // add to DB here
    saveClub(name, leader, room, email);
    console.log("Club added!");
  }
  
};

function clubRemove(key) {
  clubsRef.child(key).remove();
  console.log("Club Deleted!");
}

// adds existing values to form
function clubUpdate(key) {
  myApp.router.navigate('/update-club/' + key);
};


function saveClub(name, leader, room, email ) {
  // this will save data to Firebase
  eventsRef.push({
    name: name,
    leader: leader,
    room: room,
    email: email
  });
};

// swipeout for events or delete event
function refreshClubEdit(clist) {
  var clis = '<ul>';
  for (var i = 0; i < elist.length; i++) {


    elis += '<li class = "swipeout">' +
      '<div class="swipeout-content">' +

      ' <div class="item-inner margin-left">'  + elist[i].name + ' </div>' +

      ' </div>' +
      '<div class="swipeout-actions-right">' +
      ' <a href="#" class="color-orange" onclick=clubUpdate("' + elist[i].key + '");>Edit</a>' +

      ' <a href="#" class="swipeout-delete" onclick=clubRemove("' + elist[i].key + '");>Delete</a></div>' +
      '</li>';
  };


  clis += '</ul>'
  // console.log(elis);
  $$('#clubEditList').html(clis);
};



  // console.log(lis);
  $$('#eventsID').html(cbt);
  
  // create searchbar
  var searchbar = myApp.searchbar.create({
    el: '.searchbar',
    searchContainer: '.components-list',
    searchIn: 'a',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });
};

function getClubsByKey() {
  //  this will get fired on inital load as well as when ever there is a change in the data
  clubsRef.on("value", function(snapshot) {
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
            club: data[key].club,
            room: data[key].room,
            email: data[key].email,
           })
        }
      }
    }
    refreshClubEdit(elist);
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





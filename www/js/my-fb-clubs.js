function clubAdd() {
  var name = $$('#name').val();
  var leader = $$("#leader").val();
  var room  = $$('#room').val();
  var email = $$('#email').val();
  
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
  clubsRef.push({
    name: name,
    leader: leader,
    room: room,
    email: email
  });
};

// swipeout for clubs or delete clubs
function refreshClubEdit(clist) {
  var clis = '<ul>';
  for (var i = 0; i < clist.length; i++) {


    clis += '<li class = "swipeout">' +
      '<div class="swipeout-content">' +

      ' <div class="item-inner margin-left">'  + clist[i].name + ' </div>' +

      ' </div>' +
      '<div class="swipeout-actions-right">' +
      ' <a href="#" class="color-orange" onclick=clubUpdate("' + clist[i].key + '");>Edit</a>' +

      ' <a href="#" class="swipeout-delete" onclick=clubRemove("' + clist[i].key + '");>Delete</a></div>' +
      '</li>';
  };
  clis += '</ul>'
  // console.log(clis);
  $$('#clubEditList').html(clis);
};



  // console.log(lis);
  // $$('#clubsID').html(cbt);
  
  // create searchbar
  // var searchbar = app.searchbar.create({
  //   el: '.searchbar',
  //   searchContainer: '.components-list',
  //   searchIn: 'a',
  //   on: {
  //     search(sb, query, previousQuery) {
  //       console.log(query, previousQuery);
  //     }
  //   }
  // });

function getClubsByKey() {
  //  this will get fired on inital load as well as when ever there is a change in the data
  clubsRef.on("value", function(snapshot) {
    var data = snapshot.val();
    var clist = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        // name = data[key].name ? data[key].name : '';
        // if (name.trim().length > 0) {
          clist.push({
            key: key,
            club_name: data[key].club_name,
            club_description: data[key].club_description,
            room_number: data[key].room_number,
            email: data[key].email,
           })
        // }
      }
    }
    refreshClubEdit(clist);
  })

}

// function getClubs() {
//   var options = [];
//   clubsRef.on("value", function(snapshot) {
//     var data = snapshot.val();

//     for (var key in data) {
//       options.push(data[key].club_name);
//     }
//     console.log(options);
//   })
//   return options;
// }





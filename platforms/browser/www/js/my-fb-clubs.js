function clubAdd() {
  var club_name = $$('#clubname').val();
  var club_description = $$("#clubdesc").val();
  var club_room  = $$('#clubroom').val();
  var club_email = $$('#clubemail').val();

  // check that date and name entered
  if (!club_name || !club_email) {
    alert("Enter a club name and email!");
  }
  else {
    // add to DB here
    saveClub(club_name, club_description, club_room, club_email);
    console.log("Club added!");
  }

};

function clubRemove(key) {
  clubsRef.child(key).remove();
  console.log("Club Deleted!");
}

// adds existing values to form
function clubUpdate(key) {
  app.router.navigate('/update-club/' + key);
};


function saveClub(club_name, club_description, club_room, club_email ) {
  // this will save data to Firebase
  clubsRef.push({
    club_name: club_name,
    club_description: club_description,
    club_room: club_room,
    club_email: club_email
  });
};

// swipeout for clubs or delete clubs
function refreshClubEdit(clist) {
  var clis = '<ul>';
  for (var i = 0; i < clist.length; i++) {


    clis += '<li class = "swipeout">' +
      '<div class="swipeout-content">' +

      ' <div class="item-inner margin-left">'  + clist[i].club_name + ' </div>' +

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



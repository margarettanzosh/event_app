var monthName = ["January", "Februrary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

function eventAdd() {
  var name=$$('#name').val();
  var date = $$('#date').val();
  var teacher = $$('#teacher').val();
  var desc = $$('#desc').val();
  // check that date and name entered
  if (!name || !date){
    alert("Enter a name and date!");
  }
  else {
    // add to DB here
    saveToFB(name, date, teacher, desc);
    console.log("Added to DB!");
  }
  $$('#name').val("");
  $$('#date').val("");
  $$('#teacher').val("");
  $$('#desc').val("");
};

function eventClear() {
  $$('#name').val("");
  $$('#date').val("");
  $$('#teacher').val("");
  $$('#desc').val("");
}

function saveToFB(name, date, teacher, desc) {
    // this will save data to Firebase
    eventsRef.push({
        name: name,
        date: date,
        teacher: teacher,
        description: desc
    });
};

// function refreshUI(list) {
//     var lis = '<ul>';
//     for (var i = 0; i < list.length; i++) {
//         lis +=  '<li class="item-content">' +
//                 ' <div class="item-inner">' +
//                 '   <div class="item-title">' + list[i].name +' </div>' +
//                 ' </div>' +
//                 '</li>';
//     };
//     lis += '</ul>'
//     console.log(lis);
//     $$('#eventsID').html(lis);
// };

function refreshUI(list) {
  var cbt = "";
  var thisMonth = new Date().getMonth();
  for (var month = thisMonth; month < thisMonth + 3; month++)
  {
    cbt += '<div class="content-block-title">' + monthName[month % 12] + '</div>' +
            '<div class="list-block accordion-list">';

      var lis = '<ul>';
      for (var i = 0; i < list[month % 12].length; i++) {
          var longDateStr = moment(list[month % 12][i].date, 'Y-M-D').format('dddd MMM D');
          console.log(longDateStr);
          lis +=  '<li class="accordion-item"><a href="#" class="item-content item-link">' +
                  ' <div class="item-inner">' +
                  '   <div class="item-title"><small>' + longDateStr + '</small></br> <b><span class="title">'+ list[month % 12][i].name +'</span> </b></div>' +
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

    console.log(lis);
    $$('#eventsID').html(cbt);
};


//
// this will get fired on inital load as well as when ever there is a change in the data
// eventsRef.on("value", function(snapshot) {
//     var data = snapshot.val();
//     var list = [];
//     for (var key in data) {
//         if (data.hasOwnProperty(key)) {
//             name = data[key].name ? data[key].name : '';
//             date = data[key].date;
//             if (name.trim().length > 0 && date >= todayDate()) {
//                 list.push({
//                     key: key,
//                     name: name,
//                     date: date,
//                     teacher: data[key].teacher
//                 })
//             }
//         }
//     }
var list = [];
for (var i = 0; i < 12; i++) {
  list[i] = [];
}

eventsRef.orderByChild("date").on("child_added", function(snapshot) {
    var data = snapshot.val();
    date = data["date"];
    var month = eventMonth(date) - 1;
    if (date >= todayDate() && month >= 0 && month <=11)
    {
      list[month].push({
            name: data["name"],
            date: data["date"],
            teacher: data["teacher"],
            description: data["description"]
      })
    }



function todayDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if(dd<10){
      dd='0'+dd;
  }
  if(mm<10){
      mm='0'+mm;
  }
  var todayDate = yyyy +'-'+mm+'-'+dd;
  return todayDate;
}

function eventMonth(date) {
  month = date.substring(5,7);
  return month;
}
function eventDay(date) {
  day = date.substring(8,9);
  return day;
}
function eventYear(date) {
  year = date.substring(0,4);
  return year;
}
// refresh the UI
refreshUI(list);
console.log(list);
});

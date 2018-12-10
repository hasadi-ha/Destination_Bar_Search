var root_url = "http://comp426.cs.unc.edu:3001/"
var yelp_url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search"

$(document).ready(() => {
  let body = $('body');
  $('#signup_btn').on('click', () => {
    body.empty();

    body.append('<h1 style="text-align: center; margin-bottom: 15px;">Tool Sign Up Form</h1>')

    body.append('<div class="form"></div>');
    $('.form').append('<div class="image_container"> <img src="yelp.png" alt="Login Image" class="image"> </div>');

    $('.form').append('<div class="login_div"><div>');
    $('.login_div').append('<label for="login_user"><b>New Username</b></label>');
    $('.login_div').append('<input type="text" placeholder="Enter New Username" id="login_user" required>');

    $('.login_div').append('<label for="login_pass"><b>New Password</b></label>');
    $('.login_div').append('<input type="password" placeholder="Enter New Password" id="login_pass" required>');

    $('.login_div').append('<button id="login_btn">Sign Up</button>');
    $('.login_div').append('<div class="mesg_div"></div>');

    $('.form').append('<div class="signup_div" style="background-color: #f1f1f1"></div>');
    $('.signup_div').append('<button id="signup_btn" style="background-color: red; border-color: red;">Cancel</button>');

    $('#signup_btn').on('click', () => {
      recreateLogin();
    });

    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $('#login_btn').on('click', () => {
      $.ajax(root_url + 'users', {
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: {
          "username": user,
          "password": pass
        },
        success: (response) => {
          $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              "user": {
                "username": user,
                "password": pass
              }
            },
            success: (response) => {
              createMainPage();
            },
            error: () => {
              $('.mesg_div').empty();
              $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
            }
          });
        },
        error: () => {
          $('.mesg_div').empty();
          $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Sign Up Failed! Try Again!</h5>');

        }
      });
    });
  });

  $('#login_btn').on('click', () => {
    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        "user": {
          "username": user,
          "password": pass
        }
      },
      success: (response) => {
        createMainPage();
      },
      error: () => {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
      }
    });
  });
});

let createMainPage = () => {
  let body = $('body');
  $('*').css('text-align', 'center');
  body.empty();
  body.append('<nav class="navbar"><nav>');
  $('.navbar').append('<button class="home">Home</button');
  $('.navbar').append('<button class="user">Username</button');
  $('.navbar').append('<button class="logout">Logout</button');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.user').on('click', () => {
    body.empty();
  });

  $('.logout').on('click', () => {
    $.ajax(root_url + 'sessions', {
      type: 'DELETE',
      success: (response) => {
        body.empty();
        body.append('<h1>YOU ARE NOW LOGGED OUT! HAVE A NICE DAY!</h1>');
        setTimeout(() => {
          recreateLogin();
        }, 1000);
      },
      error: (xhr) => {
        console.log("logout fail");
      }
    });
  });

  body.append('<div class="search"><div>');
  $('.search').append('<h2>Destination_Bar_Search</h2>');
  $('.search').append('<p>Date: <input type="text" id="datepicker"></p>')
  $('.search').append('Destination: <input type="text" id="location">');
  $('.search').append(' from <input type="text" id="start_location">');
  $('.search').append('<button id="search_location">Search</button>');
  $('.search').append('<div class="search_result"></div>');
  $("#datepicker").datepicker();

  //(functionality) search for airport with location and date
  $('#search_location').on('click', () => {
    $('.search_result').empty();
    let search_list = [];
    let search_list2 = [];
    let location = $('#location').val();
    let start_location = $('#start_location').val();
    let departure_date = $('#datepicker').val();
    departure_date = departure_date.split("/");
    d_date = departure_date[2] + '-' + departure_date[0] + '-' + departure_date[1];
    if (departure_date == '' || location == '' || start_location == '') {
      $('.search_result').append('<p style="color:red">Must choose a date and an arrival/departure location.</p>')
    }
    else {
      location.toLowerCase();
      for (let i = 0; i < airport_list.length; i++) {
        let air_loc = airport_list[i];
        if (location == air_loc) {
          search_list.push(airport_data_list[i]);
        }
        if (start_location == air_loc) {
          search_list2.push(airport_data_list[i]);
        }
      }
      for (let i = 0; i < search_list.length; i++) {
        let this_airport = search_list[i];
        let start_airport = search_list2[0];
        let this_div = $('<div style="border:1px solid black" id="search_div_' + this_airport.id + '"></div>');
        $(this_div).append('<div style="font-size:18px">From: ' + this_airport.code + ' - ' + this_airport.name + '</div>');
        $(this_div).append('<div style="font-size:18px">To: ' + start_airport.code + ' - ' + start_airport.name + '</div>');

        $('.search_result').append(this_div);
        if (i == search_list.length - 1) {
          $('.search_result').append('<button class="find_flights">Find flights</button>');
        }
        //functionality on button click to find flights based on specific airport
        $('.find_flights').on('click', () => {
          if (search_list.length > 1 || search_list2.length > 1) {
            flightsListMultiple(search_list, search_list2, location, start_location);
          }
          else {
            flightListById(this_airport.id, start_airport.id, location, start_location);
          }
        });
      }
    }
    //createYelpList(location, 10000, 'bars', 20);
  });
  let airport_data_list = [];
  let airport_list = [];
  let clean_airport_list = [];
  let search_list = [];
  // let flights_list = [];
  // let instance_list =[];


  //gets list of airports
  $.ajax(root_url + 'airports', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      let data = response;
      for (let i = 0; i < data.length; i++) {
        airport_list.push(data[i].city);
        airport_data_list.push(data[i]);
      }
      clean_airport_list = airport_list.slice();
      clean_airport_list = cleanArray(clean_airport_list);
      $('#location').autocomplete({ source: clean_airport_list });
      $('#start_location').autocomplete({ source: clean_airport_list });



    }
  });
  //gets flight list
  // $.ajax(root_url + 'flights', {
  //   type: 'GET',
  //   xhrFields: { withCredentials: true },
  //   data: { 'filter[arrival_id]': id },
  //   success: (response) => {
  //     flights_list = response;
  //   }
  // });
  // //gets instance list
  // $.ajax(root_url + 'instances', {
  //   type: 'GET',
  //   xhrFields: { withCredentials: true },
  //   data: { 'filter[arrival_id]': id },
  //   success: (response) => {
  //     instance_list = response;
  //   }
  // });
}


let cleanArray = (a) => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

let flightListById = (id, did, loc, starLoc) => {
  $.ajax(root_url + 'flights', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    data: {
      'filter[arrival_id]': id,
      'filter[departure_id]': did
    },
    success: (response) => {
      flights_list = response;
      matchFlightInstance(flights_list, loc, starLoc);
    }
  });
}

let flightsListMultiple = (toList, fromList, loc, starLoc) => {
  flights_list = [];
  for (let i = 0; i < toList.length; i++) {
    for (let j = 0; j < fromList.length; j++) {
      let aid = toList[i].id;
      let did = fromList[j].id;
      $.ajax(root_url + 'flights', {
        type: 'GET',
        xhrFields: { withCredentials: true },
        data: {
          'filter[arrival_id]': aid,
          'filter[departure_id]': did,
        },
        success: (response) => {
          flights_list.push(...response);
          console.log(flights_list);
          if (i == toList.length - 1 && j == fromList.length - 1) {
            matchFlightInstance(flights_list, loc, starLoc);
          }
        }

      });
    }
  }
}

// //inputs id and list of flights to get matching flights by id
// let flightListById = (aid, did, list) => {
//   let this_flight_list = [];
//   console.log(aid);
//   console.log(did);
//   for (let i=0; i<list.length; i++) {
//     if (list[i].arrival_id==aid && list[i].departure_id==did) {
//       this_flight_list.push(list[i]);
//     }
//    });
// }

let matchFlightInstance = (flights, loc, starLoc) => {
  let instance_list = [];
  let flightid_list = [];
  if (flights.length == 0) {
    $('.search_result').empty();
    $('.search_result').append('<div style="border:1px solid black" class="f_div"></div>');
    $('.f_div').append('There are no flights from ' + loc + ' to ' + starLoc);
    $('.f_div').append('Here are the dates that have available flights:');
  } else {
    for (let i = 0; i < flights.length; i++) {
      let tid = flights[i].id;
      flightid_list.push(tid);
      $.ajax(root_url + 'instances', {
        type: 'GET',
        xhrFields: { withCredentials: true },
        data: {
          'filter[flight_id]': tid,
        },
        success: (response) => {
          for (let i = 0; i < response.length; i++) {
            instance_list.push(response[i]);
          }
          if (i == flights.length - 1) {
            showFlights(instance_list, flightid_list, flights, starLoc, loc);
          }
        }
      });
    }
  }

}
let showFlights = (instance_list, flightid_list, flights, starLoc, loc) => {
  $('.search_result').empty();
  $('.search_result').append('<div style="border:1px solid black" class="f_div"></div>');
  $('.f_div').append('Showing flights to ' + loc + ' from ' + starLoc);
  for (let i = 0; i < instance_list.length; i++) {
    let this_instance = instance_list[i];
    let a = flightid_list.indexOf(this_instance.flight_id);
    let this_flight = flights[a];
    let div_id = 'flight-' + this_instance.flight_id;
    let instance_div = $('<div class="flight_div" id="' + div_id + '"></div>');
    instance_div.append('<p>Flight: ' + this_flight.number + '<p>');
    $('.f_div').append(instance_div);
  }
}


//takes a list of flights and a date and returns a list of instances with matching values
// let matchFlightInstance = (flights, instances, aDate) => {
//   let this_instance_list = [];
//   for (let i=0; i<flights.length; i++) {
//     let tid = flights[i].id;
//     for (let j=0 ;j<instances.length; j++) {
//       let cresult = aDate.localeCompare(instances[j].date);
//       if (instances[j].flight_id==tid && cresult==0) {
//         this_instance_list.push(instances[j]);
//       }
//     }
//   }
//   return this_instance_list;
// }

// let matchFlightInstanceNoDate = (flights, instances) => {
//   let this_instance_list = [];
//   for (let i=0; i<flights.length; i++) {
//     let tid = flights[i].id;
//     for (let j=0 ;j<instances.length; j++) {
//       if (instances[j].flight_id==tid) {
//         this_instance_list.push(instances[j]);
//       }
//   }
// }

// //inputs id and list of flights to get matching flights by id
// let flightListById = (id, list) => {
//   let this_flight_list = [];
//   for (let i = 0; i < list.length; i++) {
//     if (list[i].arrival_id == id) {
//       this_flight_list.push(list[i]);
//     }
//   }
//   return this_flight_list;
// }

// //takes a list of flights and a date and returns a list of instances with matching values
// let matchFlightInstance = (flights, instances, aDate) => {
//   let this_instance_list = [];
//   for (let i = 0; i < flights.length; i++) {
//     let tid = flights[i].id;
//     for (let j = 0; j < instances.length; j++) {
//       let cresult = aDate.localeCompare(instances[j].date);
//       if (instances[j].flight_id == tid && cresult == 0) {
//         this_instance_list.push(instances[j]);
//       }
//     }
//   }
//   return this_instance_list;
// }

let createYelpList = (loc, rad, bus, lim) => {
  let body = $('body');

  body.append('<div class="yelp_list"></div>');

  $.ajax(yelp_url, {
    type: 'GET',
    data: {
      location: loc,
      radius: rad,
      categories: bus,
      limit: lim,
      sort_by: 'distance'
    },
    dataType: 'json',
    headers: {
      Authorization: 'Bearer eaTwgscQLIKIx8ZovotD79mww3utAeWyJDoX2Y0J2mJsqqaP_mfbRV9rUZXus6z_Oo6WqsR9REowDEC1UDEbb1pSsPmSZ5V4T1mmlhpMFle3hLYkCLuUZP-DQKgNXHYx',
    },
    success: (response) => {
      // console.log(response);
      let data = response['businesses'];
      // console.log(data);
      data.forEach(element => {
        if (element['display_phone'] === '') {
          element['display_phone'] = 'None'
        }

        $('.yelp_list').append('<div class="yelp_item"></div>');
        $('.yelp_list').last().append('<p>Name: ' + element['name'] + '</p>');
        $('.yelp_list').last().append('<p>Rating: ' + element['rating'] + '</p>');
        $('.yelp_list').last().append('<p>Phone #: ' + element['display_phone'] + '</p>');
      });
    },
    error: (xhr) => {
      alert('fail');
      console.log(xhr);
    }
  });
};

let createBuyPage = (instance_id) => {
  let body = $('body');
  body.empty();

  body.append('<nav class="navbar"><nav>');
  $('.navbar').append('<button class="home">Home</button');
  $('.navbar').append('<button class="user">Username</button');
  $('.navbar').append('<button class="logout">Logout</button');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.user').on('click', () => {
    body.empty();
  });

  $('.logout').on('click', () => {
    $.ajax(root_url + 'sessions', {
      type: 'DELETE',
      success: (response) => {
        body.empty();
        body.append('<h1>YOU ARE NOW LOGGED OUT! HAVE A NICE DAY!</h1>');
        setTimeout(() => {
          recreateLogin();
        }, 1000);
      },
      error: (xhr) => {
        console.log("logout fail");
      }
    });
  });

};

let recreateLogin = () => {
  let body = $('body');
  body.empty();

  body.append('  <h1 style="text-align: center; margin-bottom: 0px;">Bar Search Tool</h1>' +
    '<h5 style="color: red; text-align: center; margin-top: 0px; margin-bottom: 15px;">Login Required</h5>' +
    '<div class="form">' +

    '<div class="image_container"><img src="yelp.png" alt="Login Image" class="image"></div>' +

    '<div class="login_div">' +

    '<label for="login_user"><b>Username</b></label>' +
    '<input type="text" placeholder="Enter Username" id="login_user" required>' +

    '<label for="login_pass"><b>Password</b></label>' +
    '<input type="password" placeholder="Enter Password" id="login_pass" required>' +

    '<button id="login_btn">Login</button>' +

    '<div class="mesg_div">' +

    '</div>' +

    '</div>' +

    '<div class="signup_div" style="background-color: #f1f1f1"><button id="signup_btn">Sign Up</button></div>' +

    '</div>'
  );

  $('#signup_btn').on('click', () => {
    body.empty();

    body.append('<h1 style="text-align: center; margin-bottom: 15px;">Tool Sign Up Form</h1>')

    body.append('<div class="form"></div>');
    $('.form').append('<div class="image_container"> <img src="yelp.png" alt="Login Image" class="image"> </div>');

    $('.form').append('<div class="login_div"><div>');
    $('.login_div').append('<label for="login_user"><b>New Username</b></label>');
    $('.login_div').append('<input type="text" placeholder="Enter New Username" id="login_user" required>');

    $('.login_div').append('<label for="login_pass"><b>New Password</b></label>');
    $('.login_div').append('<input type="password" placeholder="Enter New Password" id="login_pass" required>');

    $('.login_div').append('<button id="login_btn">Sign Up</button>');
    $('.login_div').append('<div class="mesg_div"></div>');

    $('.form').append('<div class="signup_div" style="background-color: #f1f1f1"></div>');
    $('.signup_div').append('<button id="signup_btn" style="background-color: red; border-color: red;">Cancel</button>');

    $('#signup_btn').on('click', () => {
      recreateLogin();
    });

    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $('#login_btn').on('click', () => {
      $.ajax(root_url + 'users', {
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: {
          "username": user,
          "password": pass
        },
        success: (response) => {
          $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              "user": {
                "username": user,
                "password": pass
              }
            },
            success: (response) => {
              createMainPage();
            },
            error: () => {
              $('.mesg_div').empty();
              $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
            }
          });
        },
        error: () => {
          $('.mesg_div').empty();
          $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Sign Up Failed! Try Again!</h5>');

        }
      });
    });
  });

  $('#login_btn').on('click', () => {
    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        "user": {
          "username": user,
          "password": pass
        }
      },
      success: (response) => {
        createMainPage();
      },
      error: () => {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
      }
    });
  });
};
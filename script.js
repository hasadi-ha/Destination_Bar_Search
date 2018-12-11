var root_url = "http://comp426.cs.unc.edu:3001/"
var yelp_url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search"

$(document).ready(() => {
  let body = $('body');
  $('#signup_btn').on('click', () => {
    body.empty();

    body.append('<h1 style="text-align: center; margin-bottom: 30px;">Tool Sign Up Form</h1>')

    body.append('<div class="form"></div>');
    $('.form').append('<div class="image_container"> <img src="yelp.png" alt="Login Image" class="image"> </div>');

    $('.form').append('<div class="login_div"><div>');
    $('.login_div').append('<label for="login_user"><b>New Username</b></label>');
    $('.login_div').append('<input type="text" placeholder="Enter New Username" id="login_user" required>');

    $('.login_div').append('<label for="login_pass"><b>New Password</b></label>');
    $('.login_div').append('<input type="password" placeholder="Enter New Password" id="login_pass" required>');

    $('.login_div').append('<button id="login_btn">Sign Up</button>');
    $('.login_div').append('<div class="mesg_div"></div>');

    $('.form').append('<div class="signup_div" style="background-color: #d4d4d4"></div>');
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
  body.append('<h1 style="margin-bottom: 30px;">Bar Search Tool</h1>');
  body.append('<nav class="navbar"><nav>');
  $('.navbar').append('<div class="home">Home</div>');
  $('.navbar').append('<div class="user">Username</div>');
  $('.navbar').append('<div class="logout">Logout</div>');

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
  $('.search').append('<h2>Destination Search</h2>');
  $('.search').append('Destination: <input type="text" id="location">');
  $('.search').append(' from <input type="text" id="start_location">');
  $('.search').append('<button id="search_location">Search</button>');
  $('.search').append('<div class="search_result"></div>');

  //(functionality) search for airport with location and date
  $('#search_location').on('click', () => {
    $('.search_result').empty();
    let search_list = [];
    let search_list2 = [];
    let location = $('#location').val();
    let start_location = $('#start_location').val();
    if (location == '' || start_location == '') {
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
      let this_div = $('<div style="border:1px solid black"></div>');
      for (let i = 0; i < search_list.length; i++) {
        for (let j=0; j< search_list2.length;j++) {
          let this_airport = search_list[i];
          let start_airport = search_list2[j];
          $(this_div).append('<div class="airbox" style="font-size:18px">From: ' + this_airport.code + ' - ' + this_airport.name + '</div>');
          $(this_div).append('<div class="airbox" style="font-size:18px">To: ' + start_airport.code + ' - ' + start_airport.name + '</div>');
          if (i == search_list.length - 1 && j==search_list2.length-1) {
            $('.search_result').append(this_div);
            $('.search_result').append('<button class="find_flights">Find flights</button>');
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

        //functionality on button click to find flights based on specific airport

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
          if (i == toList.length - 1 && j == fromList.length - 1) {
            matchFlightInstance(flights_list, loc, starLoc);
          }
        }

      });
    }
  }
}


let matchFlightInstance = (flights, loc, starLoc) => {
  let instance_list = [];
  let flightid_list = [];
  if (flights.length == 0) {
    $('.search_result').empty();
    $('.search_result').append('<div style="border:1px solid black" class="f_div"></div>');
    $('.f_div').append('There are no flights from ' + loc + ' to ' + starLoc);
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
  flights.sort(compareTimes);
  for (let i=0;i<flights.length;i++) {
    let flight_item = flights[i];
    let flight_item_div = $('<div class="flight_div"></div>');
    flight_item_div.append('<p>Flight: ' + flight_item.number + '</p>');
    let dtime = flight_item.departs_at[11]+flight_item.departs_at[12]+flight_item.departs_at[13]+flight_item.departs_at[14]+flight_item.departs_at[15];
    flight_item_div.append('<p>Departure time: ' + dtime + '</p>');
    flight_item_div.append('<button class="flight_item_btn" onClick="getDates('+flight_item.id+')">View available tickets</button>');
    $('.f_div').append(flight_item_div);
  }

}

let getDates = (flight_id) => {
  var flight;
  $.ajax(root_url + 'flights/' + flight_id, {
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      flight=response;
    }
  });
  $('.f_div').empty();
  $.ajax(root_url + 'instances', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    data: {
      'filter[flight_id]': flight_id,
    },
    success: (response) => {
      r_rev = response.reverse();
      $('.f_div').append('<p>Select a date:</p>');
      for (let i=0; i<r_rev.length;i++) {
        let fixed_date = r_rev[i].date.split("-");
        fixed_date = fixed_date[1]+'/'+fixed_date[2]+'/'+fixed_date[0]; 
        $('.f_div').append('<div class="time_div">'+fixed_date+'</div>');
      }
      $('.time_div').on('click', () => {
        clicked_div = event.target;
        let flight_date = clicked_div.innerHTML;
        flight_date = flight_date.split("/");
        flight_date = flight_date[2]+'-'+flight_date[0]+'-'+flight_date[1];
        var instance_id;
        for (let i=0;i<response.length;i++) {
          if (response[i].date==flight_date) {
            instance_id=response[i].id
          }
        }
        createBuyPage(instance_id);
        
      });

    }
  });

}


let compareTimes= (a, b) => {
  if (a.departs_at<b.departs_at) {return -1}
  if (b.departs_at<a.departs_at) {return 1}
  else {return 0}
}


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
  $('*').css('text-align', '');

  body.append('  <h1 style="text-align: center; margin-bottom: 30px;">Bar Search Tool</h1>' +
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

    '<div class="signup_div" style="background-color: #d4d4d4"><button id="signup_btn">Sign Up</button></div>' +

    '</div>'
  );

  $('#signup_btn').on('click', () => {
    body.empty();

    body.append('<h1 style="text-align: center; margin-bottom: 30px;">Tool Sign Up Form</h1>')

    body.append('<div class="form"></div>');
    $('.form').append('<div class="image_container"> <img src="yelp.png" alt="Login Image" class="image"> </div>');

    $('.form').append('<div class="login_div"><div>');
    $('.login_div').append('<label for="login_user"><b>New Username</b></label>');
    $('.login_div').append('<input type="text" placeholder="Enter New Username" id="login_user" required>');

    $('.login_div').append('<label for="login_pass"><b>New Password</b></label>');
    $('.login_div').append('<input type="password" placeholder="Enter New Password" id="login_pass" required>');

    $('.login_div').append('<button id="login_btn">Sign Up</button>');
    $('.login_div').append('<div class="mesg_div"></div>');

    $('.form').append('<div class="signup_div" style="background-color: #d4d4d4"></div>');
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

let buy_flight_page = (destination, start) => {
  let body = $('body');
  body.empty();

  body.append('<h1 style="text-align: center; margin-bottom: 15px;">Flight from' + start + 'to ' + destination + '</h1>')

  body.append('<div class="form"></div>');

  $('.form').append('<div class="flightbuy_div"><div>');

  $('.flightbuy_div').append('<label for="first_name"><b>First Name</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="First Name" id="first_name" required>');

  $('.flightbuy_div').append('<label for="middle_init"><b>Middle Initial</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="Middle Initial (Optional)" id="middle_init">');

  $('.flightbuy_div').append('<label for="last_name"><b>Last Name</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="Last Name" id="last_name" required>');

  $('.flightbuy_div').append('<label for="age"><b>Age</b></label>');
  $('.flightbuy_div').append('<input type="number" placeholder="Age" id="age" required>');

  $('.flightbuy_div').append('<label for="gender"><b>Gender</b></label>');
  $('.flightbuy_div').append('<form class="gender_radio"></form>');
  $('.gender_radio').append('<input type="radio" name="gender" value="male">');
  $('.gender_radio').append('<input type="radio" name="gender" value="female">');
  $('.gender_radio').append('<input type="radio" name="gender" value="other">');

  $('.flightbuy_div').append('<button id="buyflight_btn">Buy Flight</button>');
  $('.flightbuy_div').append('<div class="mesg_div"></div>');

  $('.form').append('<div class="signup_div" style="background-color: #f1f1f1"></div>');
  $('.signup_div').append('<button id="signup_btn" style="background-color: red; border-color: red;">Cancel</button>');

  $('#buyflight_btn').on('click', () => {
    let f_name = $('#first_name').val();
    let m_name = $('#middle_init').val();
    let l_name = $('#last_name').val();
    let age = $('#age').val();
    let gender = $('input[name="gender"]:checked').val();

    $.ajax(root_url + 'tickets', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        "first_name": f_name,
        "middle_name": m_name,
        "last_name": l_name,
        "age": age,
        "gender": gender
      },
      success: (response) => {

      },
      error: () => {

      }
    });
  });

};

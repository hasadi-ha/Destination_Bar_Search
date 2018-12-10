var root_url = "http://comp426.cs.unc.edu:3001/"
var yelp_url = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search"

$(document).ready(() => {
  let body = $('body');
  $('#signup_btn').on('click', () => {
    body.empty();

    body.append('<div id="mesg_div"></div>');
    body.append('<div id="login_div"><div>');
    $('#login_div').append('New Username: <input type="text" id="newlogin_user"><br> New Password: <input type="text" id="newlogin_pass"><br> <button id="newsignup_btn">Sign Up</button>');

    let user = $('#newlogin_user').val();
    let pass = $('#newlogin_pass').val();

    $('#newsignup_btn').on('click', () => {
      $.ajax(root_url + 'users', {
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: {
          "username": user,
          "password": pass
        },
        success: (response) => {
          $('#mesg_div').append('<p>Success</p>')
        },
        error: () => {
          $('#mesg_div').append('<p>Failure</p>')
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
        alert('error login');
      }
    });
  });
});

let createMainPage = () => {
  let body = $('body');
  body.empty();
  body.append('<nav class="navbar"><nav>');
  $('.navbar').append('<button class="home">Home</button');
  $('.navbar').append('<button class="user">Username</button');
  $('.navbar').append('<button class="logout">Logout</button');

  body.append('<div class="search"><div>');
  $('.search').append('<h2>Destination_Bar_Search</h2>');
  $('.search').append('<p>Departure date: <input type="text" id="datepicker"></p>')
  $('.search').append('Destination: <input type="text" id="location">');
  $('.search').append('<button id="search_location">Search</button>');
  $('.search').append('<div class="search_result"></div>');
  $("#datepicker").datepicker();

  //(functionality) search for airport with location and date
  $('#search_location').on('click', () => {
    $('.search_result').empty();
    search_list = [];
    let location = $('#location').val();
    let departure_date = $('#datepicker').val();
    departure_date = departure_date.split("/");
    d_date = departure_date[2] + '-' + departure_date[0] + '-' + departure_date[1];
    if (departure_date == '' || location == '') {
      $('.search_result').append('<p style="color:red">Must choose a date and location.</p>')
    }
    else {
      location.toLowerCase();
      for (let i = 0; i < airport_list.length; i++) {
        let air_loc = airport_list[i];
        if (location == air_loc) {
          search_list.push(airport_data_list[i]);
        }
      }
      for (let i = 0; i < search_list.length; i++) {
        let this_airport = search_list[i];
        let this_div = $('<div style="border:1px solid black" id="search_div_' + this_airport.id + '"></div>');
        $(this_div).append('<div style="font-size:18px">' + this_airport.code + ' - ' + this_airport.name + '</div>');
        $(this_div).append('<button class="find_flights">Find flights</button>');
        $('.search_result').append(this_div);
        //functionality on button click to find flights based on specific airport
        $('.find_flights').on('click', () => {
          flightListById(this_airport.id, d_date);
          // let clicked_flights = flightListById(this_airport.id, d_date);
          // console.log(clicked_flights);
          // console.log(clicked_flights_instances);
          //list of flight instances for specific airport and day
        });
      }
    }
    createYelpList(location, 10000, 'bars', 20);
  });

  let airport_data_list = [];
  let airport_list = [];
  let clean_airport_list = [];
  let search_list = [];

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

let flightListById = (id, aDate) => {
  $.ajax(root_url + 'flights', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    data: {
      'filter[arrival_id]': id
    },
    success: (response) => {
      flights_list = response;
      console.log(flights_list);
      matchFlightInstance(flights_list, aDate);
    }
  });
}

let matchFlightInstance = (flights, aDate) => {
  var instance_list = []
  for (let i = 0; i < flights.length; i++) {
    let tid = flights[i].id;
    $.ajax(root_url + 'instances', {
      type: 'GET',
      xhrFields: { withCredentials: true },
      data: {
        'filter[flight_id]': tid,
        'filter[date]': aDate,
      },
      success: (response) => {
        instance_list.push(response);
      }
    });
  }
  console.log(instance_list);
}

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
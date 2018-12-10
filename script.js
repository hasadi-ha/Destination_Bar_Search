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
  $('.search').append('<p>Date: <input type="text" id="datepicker"></p>')
  $('.search').append('Destination: <input type="text" id="location">');
  $('.search').append('from <input type="text" id="start_location">');
  $('.search').append('<button id="search_location">Search</button>');
  $('.search').append('<div class="search_result"></div>');
  $("#datepicker").datepicker();

//(functionality) search for airport with location and date
  $('#search_location').on('click', () => {
    $('.search_result').empty();
    search_list = [];
    search_list2=[];
    let location = $('#location').val();
    let start_location= $('#start_location').val();
    let departure_date = $('#datepicker').val();
    departure_date=departure_date.split("/");
    d_date = departure_date[2]+'-'+departure_date[0]+'-'+departure_date[1];
    if (departure_date == '' || location == '' || start_location=='') {
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
        if (i==search_list.length-1) {
          $('.search_result').append('<button class="find_flights">Find flights</button>');
        }
        //functionality on button click to find flights based on specific airport
        $('.find_flights').on('click', () => {
          let clicked_flights = flightListById(this_airport.id, start_airport.id, flights_list);
          console.log(clicked_flights);
          let clicked_flights_instances = matchFlightInstance(clicked_flights, instance_list, d_date);
          //list of flight instances for specific airport and day
          var flist=[];
          console.log(flist);
          for (let i=0; i<clicked_flights_instances.length;i++) {
            for (let j=0; j<clicked_flights.length; j++) {
              if (clicked_flights_instances[i].flight_id==clicked_flights[j].id) {
                flist.push(clicked_flights[j]);
              }
            }
          }
          $('.search_result').empty();
          $('.search_result').append('<div style="border:1px solid black" id="f_div"></div>');
          if (flist.length==0) {
            $('#f_div').append('There are no flights from '+location+' to '+start_location+ ' on ' +d_date+'.');
            $('#f_div').append('Here are the dates that have available flights:');
            let test_dates = matchFlightInstanceNoDate(clicked_flights,instance_list);
            console.log(test_dates);
          }
          else {
            $('#f_div').append('Showing flights to '+ location +' from '+start_location+' on '+ d_date +':');
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
  let flights_list = [];
  let instance_list =[];


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
  $.ajax(root_url+ 'flights', {
    type: 'GET',
    xhrFields:{withCredentials:true},
    success: (response) => {
      flights_list=response;
    }

  });
  //gets instance list
  $.ajax(root_url+ 'instances', {
    type: 'GET',
    xhrFields:{withCredentials:true},
    success: (response) => {
      instance_list=response;
    }
  });



}


let cleanArray = (a) => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

//inputs id and list of flights to get matching flights by id
let flightListById = (aid, did, list) => {
  let this_flight_list = [];
  console.log(aid);
  console.log(did);
  for (let i=0; i<list.length; i++) {
    if (list[i].arrival_id==aid && list[i].departure_id==did) {
      this_flight_list.push(list[i]);
    }
  }
  return this_flight_list;
}

//takes a list of flights and a date and returns a list of instances with matching values
let matchFlightInstance = (flights, instances, aDate) => {
  let this_instance_list = [];
  for (let i=0; i<flights.length; i++) {
    let tid = flights[i].id;
    for (let j=0 ;j<instances.length; j++) {
      let cresult = aDate.localeCompare(instances[j].date);
      if (instances[j].flight_id==tid && cresult==0) {
        this_instance_list.push(instances[j]);
      }
    }
  }
  return this_instance_list;
}

let matchFlightInstanceNoDate = (flights, instances) => {
  let this_instance_list = [];
  for (let i=0; i<flights.length; i++) {
    let tid = flights[i].id;
    for (let j=0 ;j<instances.length; j++) {
      if (instances[j].flight_id==tid) {
        this_instance_list.push(instances[j]);
      }
    }
  }
  return this_instance_list;
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
        if(element['display_phone'] === ''){
          element['display_phone'] = 'None'
        }
        
        $('.yelp_list').append('<div class="yelp_item"></div>');
        $('.yelp_list').last().append('<p>Name: '+element['name']+'</p>');
        $('.yelp_list').last().append('<p>Rating: '+element['rating']+'</p>');
        $('.yelp_list').last().append('<p>Phone #: '+element['display_phone']+'</p>');
      });
    },
    error: (xhr) => {
      alert('fail');
      console.log(xhr);
    }
  });
};
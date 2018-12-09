var root_url = "http://comp426.cs.unc.edu:3001/"

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
    console.log(departure_date);
    console.log(location);
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
        console.log(this_airport);
        let this_div = $('<div style="border:1px solid black" id="search_div_' + this_airport.id + '"></div>');
        $(this_div).append('<div style="font-size:18px">' + this_airport.code + ' - ' + this_airport.name + '</div>');
        $('.search_result').append(this_div);
      }
    }
  });
  let airport_data_list = [];
  let airport_list = [];
  let clean_airport_list = [];
  let search_list = [];
  //let location = $('#loction').val();
  //location=location.toLowerCase();
  //console.log(location);


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


}


let cleanArray = (a) => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}


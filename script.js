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

    $('#login_btn').on('click', () => {
      let user = $('#login_user').val();
      let pass = $('#login_pass').val();
      $.ajax(root_url + 'users', {
        type: 'POST',
        xhrFields: { withCredentials: true },
        data: {
          username: user,
          password: pass
        },
        success: (response) => {
          $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              user: {
                username: user,
                password: pass
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

    $('#login_pass').on('keypress', (e) => {
      if (e.which == 13) {
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        if (pass === "") {
          $('.mesg_div').empty();
          $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">All Fields Required! Try Again!</h5>');
        }
        else {
          $.ajax(root_url + 'users', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              username: user,
              password: pass
            },
            success: (response) => {
              $.ajax(root_url + 'sessions', {
                type: 'POST',
                xhrFields: { withCredentials: true },
                data: {
                  user: {
                    username: user,
                    password: pass
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
        }
      }
    });
  });

  $('#login_pass').on('keypress', (e) => {
    if (e.which == 13) {
      let user = $('#login_user').val();
      let pass = $('#login_pass').val();

      if (pass === "") {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">All Fields Required! Try Again!</h5>');
      }
      else {
        $.ajax(root_url + 'sessions', {
          type: 'POST',
          xhrFields: { withCredentials: true },
          data: {
            user: {
              username: user,
              password: pass
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
      }
    }
  });

  $('#login_btn').on('click', () => {
    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        user: {
          username: user,
          password: pass
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
  body.append('<ul class="navbar"></ul>');

  $('.navbar').append('<li class="home"></li>');
  $('.home').append('<a aria-current="false" class="active">Find Flight</a>');

  $('.navbar').append('<li class="plane"></li>');
  $('.plane').append('<a aria-current="false">Rent Plane</a>');

  $('.navbar').append('<li class="user"></li>');
  $('.user').append('<a aria-current="false">User</a>');

  $('.navbar').append('<li class="logout"></li>');
  $('.logout').append('<a aria-current="false">Logout</a>');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.plane').on('click', () => {
    body.empty();
    createPlanePage();
  });

  $('.user').on('click', () => {
    body.empty();
    createUserPage();
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
  $('.search').append('<h2 style="margin-top: 0;">Destination Search</h2>');
  $('.search').append('Destination: <input type="text" title="Locations shown in autocomplete are the only locations with airports" id="location" style="margin-bottom: 10px">');
  $('.search').append(' From: <input type="text" title="Locations shown in autocomplete are the only locations with airports" id="start_location">');
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
      $('.search_result').append('<p style="color:red">Must choose an arrival/departure location.</p>')
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
      let this_div = $('<div style="border:1px solid black; width: auto; max-width: 550px; margin: 10px auto auto auto;"></div>');
      for (let i = 0; i < search_list.length; i++) {
        for (let j = 0; j < search_list2.length; j++) {
          let this_airport = search_list[i];
          let start_airport = search_list2[j];
          $(this_div).append('<div class="airbox" style="font-size:18px; margin-top: 5px;">From: ' + start_airport.code + ' - ' + start_airport.name + '</div>');
          $(this_div).append('<div class="airbox" style="font-size:18px; margin-bottom: 5px;">To: ' + this_airport.code + ' - ' + this_airport.name + '</div>');
          if (i == search_list.length - 1 && j == search_list2.length - 1) {
            $('.search_result').append(this_div);
            $('.search_result').append('<button class="find_flights" style="margin-top: 10px;">Find flights</button>');
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
      }
    }
  });

  let airport_data_list = [];
  let airport_list = [];
  let clean_airport_list = [];


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
};

let cleanArray = (a) => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

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
};

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
};

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

};

let showFlights = (instance_list, flightid_list, flights, starLoc, loc) => {
  $('.search_result').empty();
  $('.search_result').append('<div style="border:1px solid black" class="f_div"></div>');
  $('.f_div').append('<p style="margin: 10px 0 10px 0;">Showing flights to ' + loc + ' from ' + starLoc + '</p>');
  flights.sort(compareTimes);
  for (let i = 0; i < flights.length; i++) {
    let flight_item = flights[i];
    let flight_item_div = $('<div class="flight_div"></div>');
    flight_item_div.append('<p>Flight: ' + flight_item.number + '</p>');
    let dtime = flight_item.departs_at[11] + flight_item.departs_at[12] + flight_item.departs_at[13] + flight_item.departs_at[14] + flight_item.departs_at[15];
    flight_item_div.append('<p>Departure time: ' + dtime + '</p>');
    flight_item_div.append('<button class="flight_item_btn" style="margin-bottom: 5px;" onClick="getDates(' + flight_item.id + ')">View available tickets</button>');
    $('.f_div').append(flight_item_div);
  }

};

let getDates = (flight_id) => {
  var flight;
  $.ajax(root_url + 'flights/' + flight_id, {
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      flight = response;
    }
  });
  let tdiv = $('.f_div').detach();
  $('.search_result').append('<div style="border:1px solid black" class="f_div"></div>');
  let today = new Date();
  let currentdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  $.ajax(root_url + 'instances', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    data: {
      'filter[flight_id]': flight_id,
      'fliter[date_gt]': currentdate,
    },
    success: (response) => {
      r_rev = response.reverse();
      $('.f_div').append('<button class="back_btn" style="margin-top: 10px;">Back to results</button>');
      if (response.length == 0) {
        $('.f_div').append('<p>Sorry, there are no available dates for this flight</p>');
      } else {
        $('.f_div').append('<p style="margin-bottom: 8px;">Select a date:</p>');
        for (let i = 0; i < r_rev.length; i++) {
          if (currentdate < r_rev[i].date) {
            let fixed_date = r_rev[i].date.split("-");
            fixed_date = fixed_date[1] + '/' + fixed_date[2] + '/' + fixed_date[0];
            $('.f_div').append('<div class="time_div" style="margin-bottom: 10px;">' + fixed_date + '</div>');
          }
        }
      }
      $('.back_btn').on('click', () => {
        $('.f_div').remove();
        $('.search_result').append(tdiv);
      });
      $('.time_div').on('click', () => {
        clicked_div = event.target;
        let flight_date = clicked_div.innerHTML;
        flight_date = flight_date.split("/");
        flight_date = flight_date[2] + '-' + flight_date[0] + '-' + flight_date[1];
        var instance_id;
        for (let i = 0; i < response.length; i++) {
          if (response[i].date == flight_date) {
            instance_id = response[i].id
          }
        }
        var startloc;
        var endloc;
        $.ajax(root_url + 'airports/' + flight.departure_id, {
          type: 'GET',
          xhrFields: { withCredentials: true },
          success: (response) => {
            startloc = response;
            $.ajax(root_url + 'airports/' + flight.arrival_id, {
              type: 'GET',
              xhrFields: { withCredentials: true },
              success: (response) => {
                endloc = response;
                let search_div = $('.search').detach();
                buy_flight_page(endloc, startloc, search_div, flight.number, flight_date, instance_id);

              }
            });
          }
        });

      });

    }
  });
};

let compareTimes = (a, b) => {
  if (a.departs_at < b.departs_at) { return -1 }
  if (b.departs_at < a.departs_at) { return 1 }
  else { return 0 }
};

let createPlanePage = () => {
  let body = $('body');
  body.empty();

  body.append('<h1 style="margin-bottom: 30px;">Bar Search Tool</h1>');
  body.append('<ul class="navbar"></ul>');

  $('.navbar').append('<li class="home"></li>');
  $('.home').append('<a aria-current="false">Find Flight</a>');

  $('.navbar').append('<li class="plane"></li>');
  $('.plane').append('<a aria-current="false" class="active">Rent Plane</a>');

  $('.navbar').append('<li class="user"></li>');
  $('.user').append('<a aria-current="false">User</a>');

  $('.navbar').append('<li class="logout"></li>');
  $('.logout').append('<a aria-current="false">Logout</a>');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.plane').on('click', () => {
    body.empty();
    createPlanePage();
  });

  $('.user').on('click', () => {
    body.empty();
    createUserPage();
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
  $('.search').append('<div class="first"></div>')
  $('.first').append('<h2 style="margin-top: 0;">Destination Selection</h2>');
  $('.first').append('Destination: <input type="text" title="Airport Code appearing in autocomplete" id="location" style="margin-bottom: 10px">');
  $('.first').append(' From: <input type="text" title="Airport Code appearing in autocomplete" id="start_location">');

  $('.search').append('<div class="second"><div>');
  $('.second').append('<label for="people"># of People: </label>'
    + '<select name="people" id="people" style="margin-bottom: 10px; margin-top: 0;">'
    + '<option selected="selected">5</option>'
    + '<option>6</option>'
    + '<option>7</option>'
    + '<option>8</option>'
    + '<option>9</option>'
    + '<option>10</option>'
    + '<option>11</option>'
    + '<option>12</option>'
    + '<option>13</option>'
    + '<option>14</option>'
    + '<option>15</option>'
    + '<option>16</option>'
    + '<option>17</option>'
    + '<option>18</option>'
    + '<option>19</option>'
    + '</select>');
  $('.second').append(' Date: <input type="text" id="date">');

  $('.search').append('<div class="third" style="margin-top: 10px;"><div>');
  $('.third').append(' Departure Time: <input type="text" title="Enter in 24 hr style (Example: 18:00 for 5pm)" id="leave_time">');
  $('.third').append('<button id="book">Book Plane</button>');
  $('.search').append('<div class="search_result"></div>');

  let airport_data_list = [];
  let airport_list = [];
  let clean_airport_list = [];

  $('#date').datepicker();
  $('#people').selectmenu().selectmenu("menuWidget");
  // $('#location').autocomplete({ source: clean_airport_list });
  // $('#start_location').autocomplete({ source: clean_airport_list });

  // let clean_airport_list = airportAJAX();

  $.ajax(root_url + 'airports', {
    type: 'GET',
    xhrFields: { withCredentials: true },
    success: (response) => {
      let data = response;
      let airport_data_list = [];
      let airport_list = [];
      for (let i = 0; i < data.length; i++) {
        airport_list.push(data[i].code);
        airport_data_list.push(data[i]);
      }
      clean_airport_list = airport_list.slice();
      clean_airport_list = cleanArray(clean_airport_list);
      $('#location').autocomplete({ source: clean_airport_list });
      $('#start_location').autocomplete({ source: clean_airport_list });

    }
  });
  let price_page = $('<div id="price_popup" class="modal"></div>');
  let animated_page = $('<div class="modal-content animate"><span class="close" onClick="closePopup()" title="Close Modal">&times;</span></div>');
  animated_page.append('<div class=imgcontainer" style="margin-top: 29px;"><button class="price_btn">Buy ticket</button></span></div>');
  price_page.append(animated_page);
  $('.search').append(price_page);

  $('.price_btn').on('click', () => {
    let destination = $('#location').val();
    let from = $('#start_location').val();
    let aDate = $('#date').val();
    let number = $('#people').val();
    let dest_id = "";
    let from_id = "";
    var dest_lat;
    var dest_lon;
    let leaveTime = $('#leave_time').val();
    $.ajax(root_url + 'airports', {
      type: 'GET',
      data: {
        'filter[code]': destination,
      },
      xhrFields: { withCredentials: true },
      success: (response) => {
        dest_id = response[0].id;
        dest_lat = response[0].latitude;
        dest_lon = response[0].longitude;
        $.ajax(root_url + 'airports', {
          type: 'GET',
          data: {
            'filter[code]': from,
          },
          xhrFields: { withCredentials: true },
          success: (response) => {
            from_id = response[0].id;
            postCalls(dest_id, from_id, aDate, number, leaveTime, dest_lat, dest_lon);
          }
        });
      }
    });
  });


  $('#book').on('click', () => {
    let destination = $('#location').val();
    let from = $('#start_location').val();
    let aDate = $('#date').val();
    let number = $('#people').val();
    let leaveTime = $('#leave_time').val();
    if (destination == '' || from == '' || aDate == '' || leaveTime == '') {
      alert("Must fill out all required fields!");
    }
    else {
      var remove_these = document.getElementsByClassName('ticket_info');
      for (let i = 0; i < remove_these.length; i++) {
        remove_these[i].remove();
        i--;
      }
      $('<p class="ticket_info">Flight from <b>' + from + '</b> to <b>' + destination + '</b></p>').insertBefore('.price_btn');
      $('<p class="ticket_info">Departs: <b>' + aDate + '</b> at <b>' + leaveTime + '</b></p>').insertBefore('.price_btn');
      $('<p class="ticket_info">Party size: <b>' + number + '</b></p>').insertBefore('.price_btn');
      let toStyle = document.getElementById('price_popup');
      var dest_object;
      var from_object;
      var price = 0;
      $.ajax(root_url + 'airports', {
        type: 'GET',
        data: {
          'filter[code]': destination,
        },
        xhrFields: { withCredentials: true },
        success: (response) => {
          dest_object = response[0]
          $.ajax(root_url + 'airports', {
            type: 'GET',
            data: {
              'filter[code]': from,
            },
            xhrFields: { withCredentials: true },
            success: (response) => {
              from_object = response[0]
              price = getPrice(from_object, dest_object);
              price = price.toFixed(2);
              price = ((price * number) + 50000);
              $('<p>Price: <b>$' + price.toLocaleString() + '</b></p>').insertBefore('.price_btn');
            }
          });
        }
      });
      toStyle.style.display = "block";
    }
  });


  //Private Plane ID: 16505
  //Bar Airlines ID: 76332

  // TODO: Create confirmation before doing AJAX Calls
  // TODO: Create pricing page and plan before doing AJAX Calls
  let postCalls = (dest_id, from_id, aDate, number, leaveTime, lat, lon) => {
    $.ajax(root_url + 'flights', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        flight: {
          departs_at: leaveTime,
          arrives_at: "17:10",
          number: "BA 0001",
          departure_id: dest_id,
          arrival_id: from_id
        },
      },
      success: (response) => {
        $.ajax(root_url + 'instances', {
          type: 'POST',
          xhrFields: { withCredentials: true },
          data: {
            instance: {
              flight_id: response['id'],
              date: aDate,
            },
          },
          success: (response) => {
            closePopup();
            $('.search').remove();
            body.append('<div class="search"><div>');
            $('.search').append('<h2 style="margin-top: 0; color: green; margin-bottom: 0;">Plane Booked! Enjoy!</h2>');
            body.append('<div class="search" id="2" style="overflow-y: scroll; max-height: 60vw;"><div>');
            $('#2').append('<h2 style="margin: 0; border-bottom: 4px solid black; padding-bottom: 10px;">Bars In The Area You Might Enjoy:</h2>');
            $('#2').append('<div class="yelp_div"></div>');
            createYelpandMapPage(lat, lon, 10000, "bars", 20);
          },
          error: (xhr) => {
            $('#flag').remove();
            body.append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" id="flag">Error! Try Again!</h5>');
            $('.search').append('<div class="yelp_div"></div>');
            console.log(xhr);
          }
        });
      },
      error: (xhr) => {
        console.log(xhr);
      }
    });
  }

};

let createUserPage = () => {
  let body = $('body');
  body.empty();

  body.append('<h1 style="margin-bottom: 30px;">Bar Search Tool</h1>');
  body.append('<ul class="navbar"></ul>');

  $('.navbar').append('<li class="home"></li>');
  $('.home').append('<a aria-current="false">Find Flight</a>');

  $('.navbar').append('<li class="plane"></li>');
  $('.plane').append('<a aria-current="false">Rent Plane</a>');

  $('.navbar').append('<li class="user"></li>');
  $('.user').append('<a aria-current="false" class="active">User</a>');

  $('.navbar').append('<li class="logout"></li>');
  $('.logout').append('<a aria-current="false">Logout</a>');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.plane').on('click', () => {
    body.empty();
    createPlanePage();
  });

  $('.user').on('click', () => {
    body.empty();
    createUserPage();
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

  body.append('<div class="form" style="margin-top: 10px; max-width: 2000px; width: 80%; margin: 15px auto auto auto;">' +

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

    '</div>'
  );

  $('#login_pass').on('keypress', (e) => {
    if (e.which == 13) {
      let user = $('#login_user').val();
      let pass = $('#login_pass').val();

      if (pass === "") {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">All Fields Required! Try Again!</h5>');
      }
      else {
        $.ajax(root_url + 'sessions', {
          type: 'POST',
          xhrFields: { withCredentials: true },
          data: {
            user: {
              username: user,
              password: pass
            }
          },
          success: (response) => {
            $('.form').remove();

            body.append('<div class="search"><div>');
            $('.search').append('<h2 style="margin-top: 0;">User Profile</h2>');
            $('.search').append('<div class="first"></div>');
            $('.first').append('New Password: <input type="password" id="newPass" style="margin-bottom: 15px">');
            $('.search').append('<div class="second"></div>');
            $('.second').append('Confirm New Password: <input type="password" id="confirmNew">');
            $('.search').append('<button id="change" style="margin-top: 10px;">Change</button>');

            $('#change').on('click', () => {
              let pass = $('#newPass').val();
              let confirmPas = $('#confirmNew').val();

              if (pass !== confirmPas) {
                $('.alert').remove();
                $('.search').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" class="alert">Passwords Do Not Match! Try Again!</h5>');
                $('#confirmNew').css('color', 'red');
              }
              else {
                $.ajax(root_url + 'passwords', {
                  type: 'PUT',
                  data: {
                    user: {
                      username: user,
                      old_password: pass,
                      new_password: newPass
                    }
                  },
                  success: (response) => {
                    $('.search').empty();
                    $('.search').append('<h3 style="color: green; text-align: center; margin: 10px 0 0 0;" class="alert">Password Changed!</h3>');
                    setTimeout(() => {
                      createUserPage();
                    }, 1000);
                  },
                  error: (xhr) => {
                    console.log(xhr);
                  }
                });
              }
            });

            $('#confirmNew').on('keypress', (x) => {
              if (x.which == 13) {
                let pass = $('#newPass').val();
                let confirmPas = $('#confirmNew').val();

                if (pass !== confirmPas) {
                  $('.alert').remove();
                  $('.search').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" class="alert">Passwords Do Not Match! Try Again!</h5>');
                  $('#confirmNew').css('color', 'red');
                }
                else {
                  $.ajax(root_url + 'passwords', {
                    type: 'PUT',
                    data: {
                      user: {
                        username: user,
                        old_password: pass,
                        new_password: newPass
                      }
                    },
                    success: (response) => {
                      $('.search').empty();
                      $('.search').append('<h3 style="color: green; text-align: center; margin: 10px 0 0 0;" class="alert">Password Changed!</h3>');
                      setTimeout(() => {
                        createUserPage();
                      }, 2000);
                    },
                    error: (xhr) => {
                      console.log(xhr);
                    }
                  });
                }
              }
            });
          },
          error: () => {
            $('.mesg_div').empty();
            $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
          }

        });

      }
    }
  });

  $('#login_btn').on('click', () => {
    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        user: {
          username: user,
          password: pass
        }
      },
      success: (response) => {
        $('.form').remove();

        body.append('<div class="search"><div>');
        $('.search').append('<h2 style="margin-top: 0;">User Profile</h2>');
        $('.search').append('<div class="first"></div>');
        $('.first').append('New Password: <input type="password" id="newPass" style="margin-bottom: 15px">');
        $('.search').append('<div class="second"></div>');
        $('.second').append('Confirm New Password: <input type="password" id="confirmNew">');
        $('.search').append('<button id="change" style="margin-top: 10px;">Change</button>');

        $('#change').on('click', () => {
          let pass = $('#newPass').val();
          let confirmPas = $('#confirmNew').val();

          if (pass !== confirmPas) {
            $('.alert').remove();
            $('.search').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" class="alert">Passwords Do Not Match! Try Again!</h5>');
            $('#confirmNew').css('color', 'red');
          }
          else {
            $.ajax(root_url + 'passwords', {
              type: 'PUT',
              data: {
                user: {
                  username: user,
                  old_password: pass,
                  new_password: newPass
                }
              },
              success: (response) => {
                $('.search').empty();
                $('.search').append('<h3 style="color: green; text-align: center; margin: 10px 0 0 0;" class="alert">Password Changed!</h3>');
                setTimeout(() => {
                  createUserPage();
                }, 2000);
              },
              error: (xhr) => {
                console.log(xhr);
              }
            });
          }
        });

        $('#confirmNew').on('keypress', (x) => {
          if (x.which == 13) {
            let pass = $('#newPass').val();
            let confirmPas = $('#confirmNew').val();

            if (pass !== confirmPas) {
              $('.alert').remove();
              $('.search').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" class="alert">Passwords Do Not Match! Try Again!</h5>');
              $('#confirmNew').css('color', 'red');
            }
            else {
              $.ajax(root_url + 'passwords', {
                type: 'PUT',
                data: {
                  user: {
                    username: user,
                    old_password: pass,
                    new_password: newPass
                  }
                },
                success: (response) => {
                  $('.search').empty();
                  $('.search').append('<h3 style="color: green; text-align: center; margin: 10px 0 0 0;" class="alert">Password Changed!</h3>');
                  setTimeout(() => {
                    createUserPage();
                  }, 2000);
                },
                error: (xhr) => {
                  console.log(xhr);
                }
              });
            }
          }
        });
      },
      error: () => {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">Login Failed! Try Again!</h5>');
      }
    });
  });


}

let createYelpandMapPage = (lat, lon, rad, bus, lim) => {
  let body = $('body');

  // body.append('<div class="map_div"></div>');

  $.ajax(yelp_url, {
    type: 'GET',
    data: {
      latitude: lat,
      longitude: lon,
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
      let data = response['businesses'];

      data.forEach(element => {
        if (element['display_phone'] === '') {
          element['display_phone'] = 'None'
        }

        $('.yelp_div').append('<div class="yelp_item" id="' + element['id'] + '"></div>');
        $('#' + element['id']).append('<div id="1' + element['id'] + '"></div>')
        $('#1' + element['id']).append('<p style="margin: 5px 5px 5px 0;"><b>Name:</b> ' + element['name'] + '</p>');
        $('#1' + element['id']).append('<p style="margin: 5px 5px 5px 0;"><b>Rating:</b> ' + element['rating'] + '</p>');
        $('#1' + element['id']).append('<p style="margin: 5px 5px 5px 0;"><b>Address:</b> ' + element['location']['address1'] + ', ' + element['location']['city'] + ', ' + element['location']['state'] + '</p>');
        $('#1' + element['id']).append('<p style="margin: 5px 5px 5px 0;"><b>Phone #:</b> ' + element['display_phone'] + '</p>');

        $('#' + element['id']).append('<div class="yelp_item" id="2' + element['id'] + '" style="border: none;margin-top: 12px; margin-left: auto; width: 120px; margin-bottom: 8px; float: right;"></div>');
        $('#2' + element['id']).append('<img src="' + element['image_url'] + '" alt="Bar Image" class="image2"></img>');

        $('#' + element['id']).on('click', () => {
          window.open(element['url'], '_blank');
        });

        // $('#' + element['id']).on('click', () => {
        //   initMap(element['coordinates']['latitude'], element['coordinates']['longitude'], element['name']);
        // });
      });
    },
    error: (xhr) => {
      alert('fail');
      console.log(xhr);
    }
  });
};

// Initialize Map to airport destination
// function f(lat, lng, name) {
//   var f_dest = { lat: lat, lng: lng };
//   var map = new google.maps.Map($('map_div'), {
//     zoom: 12,
//     center: f_dest
//   });

//   // let p_markers = [];
//   // let p_infow = [];

//   // for (let i = 0; i < yelpslist.length; i++) {
//   // let place_i = yelpslist[i];
//   let p_coord = { lat: lat, lng: lng };

//   let marker = new google.maps.Marker({
//     position: p_coord,
//     map: map,
//     title: name
//   });

//   // Or should it be
//   // p_markers[i] = new google.maps.Marker({
//   //   position: p_coord,
//   //   map: map,
//   //   title: place_i.title;
//   // })

//   var contentString = 'Info for ' + name;

//   let infowindow = new google.maps.InfoWindow({
//     content: contentString
//   });

//   // Or should it be
//   // p_infow[i] = new google.maps.InfoWindow({
//   //   content: contentString
//   // });

//   // p_markers.push(marker);
//   // p_infow.push(infoWindow);
//   // }

//   // for (let i = 0; i < p_markers.length; i++) {
//   marker.addListener('mouseover', function () {
//     infowindow.open(map, marker);
//   })

//   marker.addListener('mouseover', function () {
//     infowindow.close(map, marker);
//   })
//   // }
// };

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
          username: user,
          password: pass
        },
        success: (response) => {
          $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              user: {
                username: user,
                password: pass
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

    $('#login_pass').on('keypress', (e) => {
      if (e.which == 13) {
        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        if (pass === "") {
          $('.mesg_div').empty();
          $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">All Fields Required! Try Again!</h5>');
        }
        else {
          $.ajax(root_url + 'users', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
              username: user,
              password: pass
            },
            success: (response) => {
              $.ajax(root_url + 'sessions', {
                type: 'POST',
                xhrFields: { withCredentials: true },
                data: {
                  user: {
                    username: user,
                    password: pass
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
        }
      }
    });
  });

  $('#login_pass').on('keypress', (e) => {
    if (e.which == 13) {
      let user = $('#login_user').val();
      let pass = $('#login_pass').val();

      if (pass === "") {
        $('.mesg_div').empty();
        $('.mesg_div').append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;">All Fields Required! Try Again!</h5>');
      }
      else {
        $.ajax(root_url + 'sessions', {
          type: 'POST',
          xhrFields: { withCredentials: true },
          data: {
            user: {
              username: user,
              password: pass
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
      }
    }
  });

  $('#login_btn').on('click', () => {
    let user = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        user: {
          username: user,
          password: pass
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

let buy_flight_page = (destination, start, back, flight_number, flight_date, instance_id) => {
  let body = $('body');
  body.empty();

  body.append('<h1 style="margin-bottom: 30px;">Bar Search Tool</h1>');
  body.append('<ul class="navbar"></ul>');

  $('.navbar').append('<li class="home"></li>');
  $('.home').append('<a aria-current="false" class="active">Find Flight</a>');

  $('.navbar').append('<li class="plane"></li>');
  $('.plane').append('<a aria-current="false">Rent Plane</a>');

  $('.navbar').append('<li class="user"></li>');
  $('.user').append('<a aria-current="false">User</a>');

  $('.navbar').append('<li class="logout"></li>');
  $('.logout').append('<a aria-current="false">Logout</a>');

  $('.home').on('click', () => {
    body.empty();
    createMainPage();
  });

  $('.plane').on('click', () => {
    body.empty();
    createPlanePage();
  });

  $('.user').on('click', () => {
    body.empty();
    createUserPage();
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

  body.append('<div class="form" style="max-width: 2000px; width: 80%; margin: 15px auto auto auto;"></div>');

  $('.form').append('<h1 class="form_header" style="text-align: center; margin-bottom: 15px;">Flight ' + flight_number + ' from ' + start.code + ' to ' + destination.code + ' on ' + flight_date + '</h1>')

  $('.form').append('<div class="flightbuy_div"><div>');

  $('.flightbuy_div').append('<label for="first_name" style="margin-top: 10px;" class="notThis"><b>First Name</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="First Name" id="first_name" required style="margin: 8px 10px 8px 10px;">');

  $('.flightbuy_div').append('<label for="middle_init" class="notThis"><b>Middle Initial</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="Middle Initial (Optional)" id="middle_init" style="margin: 8px 10px 8px 10px;">');

  $('.flightbuy_div').append('<label for="last_name" class="notThis"><b>Last Name</b></label>');
  $('.flightbuy_div').append('<input type="text" placeholder="Last Name" id="last_name" required style="margin: 8px 10px 8px 10px;">');

  $('.flightbuy_div').append('<label for="age" class="notThis"><b>Age</b></label>');
  $('.flightbuy_div').append('<input type="number" placeholder="Age" id="age"  style="margin: 8px 10px 8px 10px">');

  $('.flightbuy_div').append('<label for="gender" style="margin: 8px 0 8px 0;"><b>Gender</b></label>');
  $('.flightbuy_div').append('<form class="gender_radio"></form>');
  $('.gender_radio').append('M:<input type="radio" name="gender" value="Male">');
  $('.gender_radio').append('F:<input type="radio" name="gender" value="Female">');
  $('.gender_radio').append('O:<input type="radio" name="gender" value="Other">');

  $('.flightbuy_div').append('<button id="buyflight_btn">Buy Flight</button>');
  $('.flightbuy_div').append('<div class="mesg_div"></div>');

  $(' .form').append('<div class="signup_div" style="background-color: #d4d4d4; padding: 16px;"></div>');
  $('.signup_div').append('<button id="cancel_btn" style="background-color: red; border-color: red; margin-left: 90%;">Cancel</button>');

  let price_page = $('<div id="price_popup" class="modal"></div>');
  let animated_page = $('<div class="modal-content animate"><span class="close" onClick="closePopup()" title="Close Modal">&times;</span></div>');
  animated_page.append('<div class=imgcontainer" style="margin-top: 29px;"><button class="price_btn">Buy ticket</button></span></div>');
  price_page.append(animated_page);
  let price = getPrice(start, destination);
  price = price.toFixed(2);
  $('.form').append(price_page);

  $('.price_btn').on('click', () => {
    let f_name = $('#first_name').val();
    let m_name = $('#middle_init').val();
    let l_name = $('#last_name').val();
    let age = $('#age').val();
    let gender = $('input[name="gender"]:checked').val();
    $.ajax(root_url + 'tickets', {
      type: 'POST',
      xhrFields: { withCredentials: true },
      data: {
        "ticket": {
          first_name: f_name,
          midde_Name: m_name,
          last_name: l_name,
          age: age,
          gender: gender,
          price_paid: price,
          is_purchased: true,
          instance_id: instance_id
        }
      },
      success: (response) => {
        closePopup();
        $('.form').remove();
        body.append('<div class="search"><div>');
        $('.search').append('<h2 style="margin-top: 0; color: green; margin-bottom: 0;">Ticket Purchased! Enjoy!</h2>');
        body.append('<div class="search" id="2" style="overflow-y: scroll; max-height: 60vw;"><div>');
        $('#2').append('<h2 style="margin: 0; border-bottom: 4px solid black; padding-bottom: 10px;">Bars In The Area You Might Enjoy:</h2>');
        $('#2').append('<div class="yelp_div"></div>');
        createYelpandMapPage(destination.latitude, destination.longitude, 10000, "bars", 20);
      },
      error: (xhr) => {
        console.log(xhr);
        $('#flag').remove();
        body.append('<h5 style="color: red; text-align: center; margin: 10px 0 0 0;" id="flag">Error! Try Again!</h5>');
      }
    });
  });

  $('#cancel_btn').on('click', () => {
    $('.form_header').remove();
    $('.form').remove();
    body.append(back);

  });

  $('#buyflight_btn').on('click', () => {
    let f_name = $('#first_name').val();
    let m_name = $('#middle_init').val();
    let l_name = $('#last_name').val();
    let age = $('#age').val();
    let gender = $('input[name="gender"]:checked').val();
    if (f_name == '' || l_name == '' || age == '') {
      alert('Must fill out all required fields!');
    }
    else {
      let name = f_name + ' ' + m_name + ' ' + l_name;
      var remove_these = document.getElementsByClassName('ticket_info');
      for (let i = 0; i < remove_these.length; i++) {
        remove_these[i].remove();
        i--;
      }
      $('<p class="ticket_info"><b>Name: </b>' + name + '</p>').insertBefore('.price_btn');
      $('<p class="ticket_info"><b>Age: </b>' + age + '</p>').insertBefore('.price_btn');
      $('<p class="ticket_info"><b>Gender: </b>' + gender + '</p>').insertBefore('.price_btn');
      $('<p class="ticket_info"><b>Price: </b>$' + price + '</p>').insertBefore('.price_btn');
      let toStyle = document.getElementById('price_popup');
      toStyle.style.display = "block";
    }
  });

};
let closePopup = () => {
  let toStyle = document.getElementById('price_popup');
  toStyle.style.display = "none";
};

let getPrice = (start, end) => {
  let slat = start.latitude;
  let slon = start.longitude;
  let elat = end.latitude;
  let elon = end.longitude;
  let distance = Math.sqrt(Math.pow((elat - slat), 2) + Math.pow((elon - slon), 2));
  return (50 + (7.59 * distance));
}

// For the tooltip
$(function () {
  $(document).tooltip({
    position: {
      my: "left top",
      at: "right+5 top-5",
      collision: "none"
    }
  });
});

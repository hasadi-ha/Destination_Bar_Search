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

<<<<<<< HEAD
    $('#login_btn').on('click', () => {

        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        console.log(user);
        console.log(pass);

        $.ajax(root_url + 'sessions', {
            type: 'POST',
            xhrFields: {withCredentials: true},
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
=======
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
        alert('successful login');
        createMainPage();
      },
      error: () => {
        alert('error login');
      }
>>>>>>> 9a328eb6d333ae9fbcd11ff0eed1422b1d0e404e
    });
  });
});

let createMainPage = () => {
<<<<<<< HEAD
    let body = $('body');
    body.empty();
    body.append('<nav class="navbar"><nav>');
    $('.navbar').append('<button class="home">Home</button');
    $('.navbar').append('<button class="user">Username</button');
    $('.navbar').append('<button class="logout">Logout</button');
    
    body.append('<div class="search"><div>');
    $('.search').append('<h2>Destination_Bar_Search</h2>');
    $('.search').append('Destination: <input type="text" id="location">');
    $('.search').append('<button id="search_location">Search</button>');
    
     $('#search_location').on('click', () => {
         search_list=[];
         let location = $('#location').val();
         location.toLowerCase();
         console.log(location);    
         for (let i=0; i<airport_list.length; i++) {
             let air_loc = airport_list[i];
             if (location==air_loc) {
                 search_list.push(airport_data_list[i]);
             }
         }
         console.log(search_list);
             
     });
    let airport_data_list=[];
    let airport_list=[];
    let clean_airport_list=[];
    let search_list=[];
    //let location = $('#loction').val();
    //location=location.toLowerCase();
    //console.log(location);
    
    
    //gets list of airports
    $.ajax(root_url + 'airports', {
        type: 'GET',
        xhrFields: {withCredentials:true},
        success: (response) => {
            let data = response;
            for (let i=0; i<data.length;i++) {
                airport_list.push(data[i].city);
                airport_data_list.push(data[i]);
            }
            clean_airport_list=airport_list.slice();
            clean_airport_list=cleanArray(clean_airport_list);
            $('#location').autocomplete({source: clean_airport_list});
            

        }
    });
    
    
=======
  let body = $('body');
  body.empty();
  body.append('<nav class="navbar"><nav>');
  $('.navbar').append('<button class="home">Home</button');
  $('.navbar').append('<button class="user">Username</button');
  $('.navbar').append('<button class="logout">Logout</button');

  body.append('<div class="search"><div>');
  $('.search').append('<h2>Destination_Bar_Search</h2>');
  $('.search').append('Destination: <input type="text" id="location">');
  $('.search').append('<button id="search_location">Search</button>');

  $('#search_location').on('click', () => {
    let location = $('#location').val();
    console.log(location);
  });

  let airport_list = [];
  let clean_airport_list = [];
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
      }
      clean_airport_list = airport_list.slice();
      clean_airport_list = cleanArray(clean_airport_list);
      $('#location').autocomplete({ source: clean_airport_list });
    }
  });


>>>>>>> 9a328eb6d333ae9fbcd11ff0eed1422b1d0e404e
}


let cleanArray = (a) => {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
}

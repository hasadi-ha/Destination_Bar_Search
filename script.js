var root_url = "http://comp426.cs.unc.edu:3001/"

$(document).ready(() => {

    $('#signup_btn').on('click', () => {

        let user = $('#login_user').val();
        let pass = $('#login_pass').val();
        console.log(user);
        console.log(pass);

        $.ajax(root_url + 'users', {
            type: 'POST',
            xhrFields: {withCredentials: true},
            data: {
                "user": {
                    "username": user,
                    "password": pass
                }
            },
            success: (response) => {
                alert('success');
            },
            error: () => {
                alert('error');
            }
        });
    });
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
                alert('successful login');
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
    $('.navbar').append('<button id="mapper">Maps</button');

    body.append('<div class="search"><div>');
    $('.search').append('<h2>Destination_Bar_Search</h2>');
    $('.search').append('Destination: <input type="text" id="location">');
    $('.search').append('<button id="search_location">Search</button>');

     $('#search_location').on('click', () => {
         let location = $('#location').val();
         console.log(location);
     });

    let airport_list=[];
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
            }
        }
    });
    console.log(airport_list);
    $('#location').autocomplete({source: airport_list});

    // Google maps
    body.append('<div id="googleMap" style="width:100%;height:400px;"></div>')

    $('#mapper').on('click', () => {
      var mapProp= {
          center:new google.maps.LatLng(51.508742,-0.120850),
          zoom:5,
      };

      var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);
    });


}

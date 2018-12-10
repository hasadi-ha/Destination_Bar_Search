

// Start of google maps code!!
// Need to create div for map right next to the div for yelp places list

// Initialize Map to airport destination
function initMap() {
  // TODO: Need to get the coordinates of airport destination
  var f_dest = {lat: (Insert destination Info).lat, lng: (Insert destination Info).lng;
  var map = new google.maps.Map(document.getElementById('map_div'), {
    zoom: 12,
    center: f_dest
  });

  let p_markers = [];
  let p_infow = [];

  for(let i = 0; i < yelpslist.length; i++) {
    let place_i = yelpslist[i];
    let p_coord = {lat: place_i.lat, lng: place_i.lng};

    let marker = new google.maps.Marker({
      position: p_coord,
      map: map,
      title: place_i.title;
    });

    // Or should it be
    // p_markers[i] = new google.maps.Marker({
    //   position: p_coord,
    //   map: map,
    //   title: place_i.title;
    // })

    var contentString = 'Info for ' + place_i.title;

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    // Or should it be
    // p_infow[i] = new google.maps.InfoWindow({
    //   content: contentString
    // });

    p_markers.push(marker);
    p_infow.push(infoWindow);

  }

for(let i = 0; i < p_markers.length; i++) {
  p_markers[i].addListener('mouseover', function() {
    p_infow[i].open(map, p_markers[i]);
  })

  p_markers[i].addListener('mouseover', function() {
    p_infow[i].close(map, p_markers[i]);
  })
}

}

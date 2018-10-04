import React, { Component } from 'react';
import './App.css';

import axios from 'axios';

class App extends Component {
  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?",
      parameters = {
        client_id: "",
        client_secret: "",
        query: "tacos",
        near: "Sydney",
        v: "20181003"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        console.log("ERROR!!" + error)
      })
  }

  initMap = () => {

    // Create map
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    })

    // Create an infowindow
    const infowindow = new window.google.maps.InfoWindow()

    // Display dynamic markers
    this.state.venues.map(myVenue => {

    const contentString = `${myVenue.venue.name}`;

    // Create a marker
    const marker = new window.google.maps.Marker({
      position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
      map: map,
      title: myVenue.venue.name
    });

    // Click on a marker
    marker.addListener('click', function() {

      // Change content
      infowindow.setContent(contentString)

      // Open infowindow
      infowindow.open(map, marker);
    });

  })
}

  render() {
    return (
      <main>
        <div id="map"></div>
      </main>
    )
  }
}

function loadScript(url) {
  let index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)

}

export default App;
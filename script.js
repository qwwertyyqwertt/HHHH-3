// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkmLm7QiYtI7ztJkCMniBHkmIxDjDu1lM",
  authDomain: "go-safe-12.firebaseapp.com",
  databaseURL: "https://go-safe-12-default-rtdb.firebaseio.com",
  projectId: "go-safe-12",
  storageBucket: "go-safe-12.firebasestorage.app",
  messagingSenderId: "20787155592",
  appId: "1:20787155592:web:8cd7511ff6a77d6426453d",
  measurementId: "G-N0BMNHLWCD"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let map, marker;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 15,
    });

    marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        title: "Your Location",
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                let lat = position.coords.latitude;
                let lng = position.coords.longitude;
                let newPos = { lat, lng };

                // Update marker and center map
                marker.setPosition(newPos);
                map.setCenter(newPos);

                // Send live location to Firebase
                db.ref("users/user1").set({
                    latitude: lat,
                    longitude: lng
                });
            },
            (error) => {
                console.error("Error getting location: ", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    // Get live updates from Firebase
    db.ref("users/user1").on("value", (snapshot) => {
        let data = snapshot.val();
        if (data) {
            let updatedPos = { lat: data.latitude, lng: data.longitude };
            marker.setPosition(updatedPos);
            map.setCenter(updatedPos);
        }
    });
}

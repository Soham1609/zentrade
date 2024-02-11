let map;
let locations = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
    });
}

function addLocation() {
    const address = document.getElementById("addressInput").value;
    if (address) {
        // Geocode the address
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, function (results, status) {
            if (status === "OK") {
                const location = results[0].geometry.location;
                const marker = new google.maps.Marker({
                    map: map,
                    position: location,
                    label: (locations.length + 1).toString(),
                });
                locations.push({
                    address: address,
                    position: location,
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }
}

function planRoute() {
    if (locations.length < 2) {
        alert("Please add at least two locations to plan a route.");
        return;
    }

    // Calculate the distance matrix between all locations
    const distanceMatrix = calculateDistanceMatrix(locations);

    // Greedy algorithm to find the shortest route
    let visited = new Array(locations.length).fill(false);
    let route = [];
    let totalDistance = 0;

    let currentLocationIndex = 0; // Starting location index

    visited[currentLocationIndex] = true;
    route.push(locations[currentLocationIndex]);

    for (let i = 1; i < locations.length; i++) {
        let minDistance = Number.MAX_SAFE_INTEGER;
        let nextLocationIndex = -1;

        for (let j = 0; j < locations.length; j++) {
            if (!visited[j] && distanceMatrix[currentLocationIndex][j] < minDistance) {
                minDistance = distanceMatrix[currentLocationIndex][j];
                nextLocationIndex = j;
            }
        }

        if (nextLocationIndex !== -1) {
            totalDistance += minDistance;
            currentLocationIndex = nextLocationIndex;
            visited[currentLocationIndex] = true;
            route.push(locations[currentLocationIndex]);
        }
    }

    // Display the optimized route on the map
    displayOptimizedRoute(route, totalDistance);
}

function calculateDistanceMatrix(locations) {
    // This function should calculate the distance between all pairs of locations
    // and return a distance matrix
    // You can use various methods such as the Haversine formula or Google Distance Matrix API
    // For simplicity, let's assume a dummy distance matrix for now
    const distanceMatrix = [];
    for (let i = 0; i < locations.length; i++) {
        distanceMatrix[i] = [];
        for (let j = 0; j < locations.length; j++) {
            // Dummy distance (straight-line distance, not actual route distance)
            const distance = google.maps.geometry.spherical.computeDistanceBetween(
                locations[i].position,
                locations[j].position
            );
            distanceMatrix[i][j] = distance;
        }
    }
    return distanceMatrix;
}

function displayOptimizedRoute(route, totalDistance) {
    // This function should draw the optimized route on the map
    // You can use the Google Maps Directions Service to get the actual route between locations
    // For simplicity, let's assume a basic display for now
    const routeCoordinates = route.map((location) => location.position);

    const routePath = new google.maps.Polyline({
        path: routeCoordinates,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });

    routePath.setMap(map);

    // Display total distance to the user
    alert(`Optimized route distance: ${totalDistance.toFixed(2)} meters`);
}

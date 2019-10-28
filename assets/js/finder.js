// Initialize Firebase
const config = {
    apiKey: "AIzaSyBXbVZnjOTHkSxkaB5ni4BM5T-xp8ghizQ",
    authDomain: "firstproject-1a761.firebaseapp.com",
    databaseURL: "https://firstproject-1a761.firebaseio.com",
    projectId: "firstproject-1a761",
    storageBucket: "firstproject-1a761.appspot.com",
    messagingSenderId: "1003282022340"
};
firebase.initializeApp(config);

let db = firebase.firestore()

// heart animation
/* when a user clicks, toggle the 'is-animating' class */
$("#addToFavorites").on('click touchstart', function(){
    $(this).toggleClass('is_animating')
})
  
 /*when the animation is over, remove the class*/
$("#addToFavorites").on('animationend', function(){
     $(this).toggleClass('is_animating')
})

//Variable Declaration//
let coordinates = {}
    city = ``


//Function Declaration//

// function to call Kanye quote
const kanyeQuote = _ => {
    fetch(`https://api.kanye.rest`)
        .then(r => r.json())
        .then(r => {
            document.querySelector('#kanyeQuote').textContent = `${r.quote}`
        })
}

// Function used for "x miles away" location tag
const distFunc = (lat1, lon1, lat2, lon2) => {
    let pi = Math.PI
    const toRadians = (numInDegrees) => {
        return numInDegrees * (pi / 180)
    }
    // barely modified formula from movable-type-scripts article
    const R = 3958.8
    let φ1 = toRadians(lat1)
    let φ2 = toRadians(lat2)
    let Δφ = toRadians((lat2 - lat1))
    let Δλ = toRadians((lon2 - lon1))

    let a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    let d = R * c

    return d
}

// Function for using coordinates to find nearby restaurants
const fetchNearbyBusinesses = (lat1, lon1) => {
    
    // to grab restaurant location from API
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?latitude=${lat1}&longitude=${lon1}&limit=50&open_now=true`, {
        headers: {
            "Authorization": "Bearer CYpONbq3tuPRivns5oh_FenCfkuVArzigVu7ay4XjSaw1vOOZjWIgvQ7lPiyMRvXF2vlajmHLfHWqCUCBAKPVssu1NVAfDhuv9cHwFNwz8rgYI4W5FIg2DRY-CWcXHYx"
        }
    })
        .then(r => r.json())
        .then(r => {
            // random number generator for restaurant selection
            let counter = 0
            const getRest = _ => {
            let randRest = Math.floor(Math.random() * r.businesses.length)
            let ratingThreshold = 2.5
            let randBusiness = r.businesses[randRest]
            counter++
            // filter for 2.5+ ratings
            if (randBusiness.rating >= ratingThreshold) {
                return randBusiness
            }else {
                if (counter > r.businesses.length) {
                return null
                }
                getRest()
            }
        }
        const highRatedRest = getRest()
            // filter to display only 2.5+ rated restaraunts
            if (highRatedRest) {
                // pulling coordinates for destination
                let { latitude: lat2, longitude: lon2 } = highRatedRest.coordinates

                // Function used for "x miles away" location tag
                const distance = distFunc(lat1, lon1, lat2, lon2)

                if (distance < 1) {
                    // shows distance in decimals if between 0 and 1
                    document.querySelector(`.card-subtitle`).innerHTML = `~ ${distance.toFixed(2)} Miles Away`
                } else {
                    // shows rounded distance otherwise
                    document.querySelector(`.card-subtitle`).innerHTML = `~ ${Math.round(distance)} Miles Away`
                }
                document.getElementById('restImage').src = `${highRatedRest.image_url}`
                document.querySelector('.card-title').textContent = `${highRatedRest.name}`
                document.querySelector('.card-price').textContent = `${highRatedRest.price}`
                document.querySelector('.card-transaction').textContent = `${highRatedRest.transactions}`
                document.querySelector('.card-telephone').textContent = `${highRatedRest.display_phone}`
                document.querySelector('.card-url').textContent = `${highRatedRest.url}`

                // .map returns a new array for us 
                // .join(' ') joins array and separates with a space
                const categories = highRatedRest.categories
                    .map(category => category.title)
                    .join(' ')

                document.querySelector('.card-type').textContent = `Type of food: ${categories}`
            }
        })
        .catch(e => console.error(e))
}

// function for searching nearby restaurants based on city text input
const fetchNearbyBusinessesCity = (city, lat1, lon1) => {
    // to grab restaurant location from API
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&limit=50&open_now=true`, {
        headers: {
          Authorization:
            "Bearer CYpONbq3tuPRivns5oh_FenCfkuVArzigVu7ay4XjSaw1vOOZjWIgvQ7lPiyMRvXF2vlajmHLfHWqCUCBAKPVssu1NVAfDhuv9cHwFNwz8rgYI4W5FIg2DRY-CWcXHYx"
        }
    })
    .then(r => r.json())
    .then(r => {
        // random number generator for restaurant selection
        let counter = 0
        const getRest = _ => {
            let randRest = Math.floor(Math.random() * r.businesses.length)
            let ratingThreshold = 2.5
            let randBusiness = r.businesses[randRest]
            counter++
            if (randBusiness.rating >= ratingThreshold) {
                return randBusiness
            }else {
                if (counter > r.businesses.length) {
                return null
                }
                getRest()
            }
        }
        const highRatedRest = getRest()
        // filter to display only 2.5+ rated restaraunts
        if (highRatedRest) {
            // pulling coordinates for destination
            let { latitude: lat2, longitude: lon2 } = highRatedRest.coordinates

            // Function used for "x miles away" location tag
            const distance = distFunc(lat1, lon1, lat2, lon2)

            if (distance < 1) {
                // shows distance in decimals if between 0 and 1
                console.log(`${highRatedRest.name} is ~ ${distance.toFixed(2)} Miles Away`)
            } else {
                // shows rounded distance otherwise
                console.log(`${highRatedRest.name} is ~ ${Math.round(distance)} Miles Away`)
            }
            document.getElementById("restImage").src = `${highRatedRest.image_url}`
            document.querySelector(".card-title").textContent = `${highRatedRest.name}`
            document.querySelector(".card-price").textContent = `${highRatedRest.price}`
            document.querySelector(".card-transaction").textContent = `${highRatedRest.transactions}`
            document.querySelector('.card-telephone').textContent = `${highRatedRest.display_phone}`
            document.querySelector('.card-url').textContent = `${highRatedRest.url}`

            // .map returns a new array for us
            // .join(' ') joins array and separates with a space
            const categories = highRatedRest.categories.map(category => category.title).join(" ")

            document.querySelector(".card-type").textContent = `Type of food: ${categories}`

        }
    })
    .catch(e => console.error(e))
}

//Page Functionality//

// current location coords generator
navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    console.log('latitude: ', latitude, 'longitude: ', longitude)

    // user's location
    coordinates = {
        lat1: latitude,
        lon1: longitude
    }
    return coordinates
})

// prevents enter key default
document.querySelector(`#locationInput`).addEventListener(`keydown`, e => {
    if (e.keyCode === 13) {
        e.preventDefault()
    }
})

// differentiates which fetch request to run
document.querySelector('#search').addEventListener(`click`, e => {
    // // variable to house city input
    city = document.getElementById(`locationInput`).value

    kanyeQuote()

    if (city === ``) {
        console.log(`search coords`)
        console.log(coordinates)
        fetchNearbyBusinesses(coordinates.lat1, coordinates.lon1)
    }else {
        console.log(`search a city`)
        console.log(`${city}`)
        fetchNearbyBusinessesCity(city, coordinates.lat1, coordinates.lon1)
    }
})

// Firebase integration and favorites page visualization //

//adding to firebase favorite
document.getElementById('addToFavorites').addEventListener('click', e => {
    e.preventDefault()
    document.querySelector("#heartImage").style.display = "block"
    db.collection("Favorites").doc(document.querySelector('.card-title').textContent).set({
        name: document.querySelector('.card-title').textContent,
        typeoffood: document.querySelector('.card-type').textContent,
        dollars: document.querySelector('.card-price').textContent,
        transaction: document.querySelector('.card-transaction').textContent,
        telephone: document.querySelector('.card-telephone').textContent,
        url: document.querySelector('.card-url').textContent,
    })
    .then(function() {
        //stops heart animation
        setTimeout(() => {
            document.querySelector("#heartImage").style.display = "none"
        }, 1000)
        console.log("Document successfully written!");
    })
    // reruns city/coords search functions on "Favorites" press
    city = document.getElementById(`locationInput`).value

    kanyeQuote()

    if (city === ``) {
        console.log(`search coords`)
        console.log(coordinates)
        fetchNearbyBusinesses(coordinates.lat1, coordinates.lon1)
    }else {
        console.log(`search a city`)
        console.log(`city`)
        fetchNearbyBusinessesCity(city, coordinates.lat1, coordinates.lon1)
    }
})

//adding to firebase rejected
document.getElementById('notFavorite').addEventListener('click', e => {
    e.preventDefault()

    db.collection("Dislikes").doc(document.querySelector('.card-title').textContent).set({
        name: document.querySelector('.card-title').textContent,
        typeoffood: document.querySelector('.card-type').textContent,
        dollars: document.querySelector('.card-price').textContent,
        transaction: document.querySelector('.card-transaction').textContent,
        telephone: document.querySelector('.card-telephone').textContent,
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    // reruns city/coords search and Kanye quote functions on "Dislike" press
    city = document.getElementById(`locationInput`).value

    kanyeQuote()

    if (city === ``) {
        console.log(`search coords`)
        console.log(coordinates)
        fetchNearbyBusinesses(coordinates.lat1, coordinates.lon1)
    }else {
        console.log(`search a city`)
        console.log(`city`)
        fetchNearbyBusinessesCity(city, coordinates.lat1, coordinates.lon1)
    }
})
    
//showing favorites(DOM)
db.collection('Favorites').onSnapshot(({ docs }) => {
    document.querySelector('#favorites').innerHTML = ''
    docs.forEach(doc => {
        let { name, dollars, typeoffood, url } = doc.data()
        let docElem = document.createElement('button')
        docElem.innerHTML = `
            <div class="favoritesDiv">
            <h3>${name}</h3>
            <h4>${typeoffood}</h4>
            <p>${dollars}</p>
            <a href="${url}">GO HERE</a>
            <hr>
            </div>
            `
        document.querySelector('#favorites').append(docElem)
    })
})


//////********* Screen Toggle *//////

// login to location page
function dispFunction() {
    document.getElementById("locationPage").style.display = "block";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("navigation1").style.display = "none";
    document.getElementById("navigation2").style.display = "block";
}

// display main page
function dispMainPage() {
    document.getElementById("mainPage").style.display = "block";
    document.getElementById("locationPage").style.display = "none";
}

// to favorites page
function dispFaves() {
    document.getElementById("favoritesPage").style.display = "block";
    document.getElementById("mainPage").style.display = "none"; 
    document.getElementById("locationPage").style.display = "none";
}

// back to location page
function dispLocationPage() {
    document.getElementById("locationPage").style.display = "block";
    document.getElementById("mainPage").style.display = "none";
    document.getElementById("favoritesPage").style.display = "none";
}
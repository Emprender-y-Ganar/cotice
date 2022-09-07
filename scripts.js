var directionsService = new google.maps.DirectionsService(); // Calcula la ruta de inicio y final 
var directionsRender = new google.maps.DirectionsRenderer();
const geocoder = new google.maps.Geocoder();

latLngMkr = 0,0
//Variables para el Geodecoding Inverso 
const invGcd= () =>{
    
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLngMkr.lat()},${latLngMkr.lng()}&key=AIzaSyBE8RxxJ10jyYCO1ijBn2xN1p19V-NROE8`;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        document.getElementById(inicio).value = data.results[0].formatted_address        
        })      
} 

const $map = document.querySelector('#map');
let dirIni  
let marker
let markerA

points = []

let inicio = "inicio"
let destino = "destino"

let latLngIni = 0
let latLngDes = 0
let tiempo = 0
let distancia = 0

let alert = document.querySelector(".alert")

let precioPasajero = document.querySelector(".precioPasajero")
let precioPaquete = document.querySelector(".precioPaquete")
    

let positionA = new google.maps.LatLng(3.43722, -76.5225)

/*DIBUJAR MAPA*/    

const map = new window.google.maps.Map ($map, {
        center: positionA, 
        zoom: 15, 
        disableDefaultUI: true,
        styles: [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#71ABC3"
            },
            {
                "saturation": -10
            },
            {
                "lightness": -21
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#7DC45C"
            },
            {
                "saturation": 37
            },
            {
                "lightness": -41
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#C3E0B0"
            },
            {
                "saturation": 23
            },
            {
                "lightness": -12
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#A19FA0"
            },
            {
                "saturation": -98
            },
            {
                "lightness": -20
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#FFFFFF"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    }
]
    })

    /*MARCADOR DRAW */
    
    marker = new window.google.maps.Marker ({
        position: positionA, 
        map: map,
        //draggable: true

    })
    
    

navigator.geolocation.getCurrentPosition(position => {
        latLngIni = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        }
    marker.setPosition(latLngIni)
    map.setCenter(latLngIni) 
    latLngMkr = marker.position  
    invGcd()    

       
    

    //Inicio de Autocomplete 

    var autocomplete = new google.maps.places.Autocomplete((document.getElementById(inicio)), {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(3.43722, -76.5224)
        )               
    });



    var autocompleteA = new google.maps.places.Autocomplete((document.getElementById(destino)), {
        bounds: new google.maps.LatLngBounds(
          new google.maps.LatLng(3.43722, -76.5225)
        ) 
                     
    });


    autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    latLngIni = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    }
        points.a = {
            latLng : dirIni
        }

       marker.setPosition(latLngIni)
       map.setCenter(latLngIni)
       map.setZoom(15)
        
        //console.log(marker.getPosition())  
                    
    });
    
    //Autocomplete 2 
    autocompleteA.addListener('place_changed', function() {
    var placeA = autocompleteA.getPlace();
    latLngDes = {
        lat: placeA.geometry.location.lat(),
        lng: placeA.geometry.location.lng()
    } 
    marker.setPosition(latLngDes)
    map.setCenter(latLngDes)
    map.setZoom(15)
    points.b = {
        latLng : dirIni
    }
   
    });  //Autocomplet final 


});

/* ajuste de calculos */

let calculadora = document.getElementById("btn")
    calculadora.addEventListener('click', ()=>{
      if(latLngIni == 0 || latLngDes == 0){
        alert.textContent = "¡Error! Verifique que los campos ORIGEN / DESTINO de la Ruta NO estén vacios"
        alert.style.backgroundColor = 'red';
        alert.style.color = 'white'
      } else {    
          
        
        let objSettinsDS = {
            origin: latLngIni, 
            destination: latLngDes, 
            travelMode: google.maps.TravelMode.DRIVING
        }
        
        directionsService.route(objSettinsDS, fnRutear)
        directionsRender.setMap(map)
        function fnRutear (resultados, status, ){        
            if(status=="OK") {
                let result = resultados
                directionsRender.setDirections(result)
                               
         
                distancia = result.routes[0].legs[0].distance.value;
                tiempo = result.routes[0].legs[0].duration.value;  
                dText = result.routes[0].legs[0].distance.text;
                         
                let precioKM = distancia * 1.05 // 1000 por KM
                let precioMin = (tiempo + 600) * 2.16 // 120 por min (incluye salraio del vehiculo por 1,2 millones)
          

                let $paquete = ((precioKM + precioMin) + 2500)*1.15  //Calculo t y d por un 60% ganancia

                let $pasajero = ((precioKM + precioMin) + 2000)

          
          //ENVIO CARRO 
                if ($pasajero <= 4961){   // Este if es para imprimir costo Express 
                    precioPasajero.textContent = " = $ 4960 aprox." 
                    alert.style.backgroundColor = 'white';
                    alert.textContent = "El recorrido es de: " + dText + " y toma un tiempo de " + Math.round(((tiempo + 300)/60)) + " minutos." 
                } else {
                    precioPasajero.textContent = " = $ " + Math.round($pasajero) + " aprox."; 
                    alert.style.backgroundColor = 'white';
                    alert.textContent = "El recorrido es de: " + dText + " y toma un tiempo de " + Math.round(((tiempo + 300)/60)) + " minutos.  "
                }

                /* PAQUETE 
                 */

                if ($paquete <= 7000){
                    precioPaquete.textContent = " = $ 7000"
                    
                   
                }else {
                  precioPaquete.textContent = " = $ " + Math.round($paquete) + "**"
                  
               } 
         
        } else {
          alert ("Error, no se ha podido crear la Ruta")
        }
      }
    } 
  })

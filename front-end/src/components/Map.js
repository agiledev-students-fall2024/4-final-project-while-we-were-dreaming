import React, {useContext, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import PinModal from './pinModal';
import 'leaflet/dist/leaflet.css';
import '../assets/styles/App.css';
import MapSettings from './MapSettings';
import { ReactComponent as SettingsIcon } from '../assets/images/icons/settings.svg';
import { ReactComponent as StarIcon } from '../assets/images/icons/star.svg';
import { PinContext } from '../PinContext';
import { UserContext } from '../UserContext';



// custom svg marker
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-icon-container',
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" class="custom-icon">
        <path d="M12 2C8.134 2 5 5.134 5 9c0 6.23 7 13 7 13s7-6.77 7-13c0-3.866-3.134-7-7-7zm0 10.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
      </svg>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

function InitializeMap({ setMap }) {
  const map = useMap(); // Access the map instance
  React.useEffect(() => {
    if (map) {
      console.log("Map instance created via useMap:", map); // Debug log
      setMap(map); // Pass the map instance to the state
    }
  }, [map, setMap]);
  return null;
}


const MapComponent = () => {

  const { userId, username } = useContext(UserContext); // Fetch current user context


  const {pins, addPin} = useContext(PinContext)
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState(null); // coords for new pin
  const [phantomPin, setPhantomPin] = useState(null); // coords for the phantom pin

  const [mapCenter, setMapCenter] = useState([40.7309, -73.9973]); // Default starting center
  const [map, setMap] = useState(null);


  const [isSettingsOpen, setSettingsOpen] = useState(false);


  // const [showPersonalPins, setShowPersonalPins] = useState(false);

  const toggleSettingsModal = () => {
    setSettingsOpen(!isSettingsOpen);
  };

  const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);

const handleSearchChange = async (e) => {
  setSearchQuery(e.target.value);
  console.log('Searching for:', searchQuery);
  

  if (e.target.value.length > 2) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${e.target.value}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      console.log('Results:', searchResults);
    } catch (error) {
      console.error('Error fetching geocode data:', error);
    }
  } else {
    setSearchResults([]);
  }
};

const [showPopularList, setShowPopularList] = useState(false);

const popularLocations = [
  { name: "Washington Square Park", coords: [40.7309, -73.9973] },
  { name: "Bobst Library", coords: [40.72965722194712, -73.99707897057179] },
  { name: "NYU Shanghai", coords: [31.225566443106725, 121.53388570181292] },
  { name: "NYU Abu Dhabi", coords: [24.524158345879982, 54.43489912275673] },
  { name: "Union Square", coords: [40.735788089603375, -73.9908750603095] },
  { name: "Paulson Center", coords: [40.72698409187966, -73.99729979683126] },
  { name: "Tisch School of Arts", coords: [40.72950671419619, -73.99382658320908] },
  { name: "Gallatin School of Individualized Study", coords: [40.72932439233608, -73.99391616387615] },
  { name: "Steinhardt Barney Building", coords: [40.72987294381137, -73.98800584486644] },
  { name: "Tandon School of Engineering", coords: [40.69440445841927, -73.98645217639368] },
  { name: "Kimmel Center", coords: [40.7295, -73.9979] },
  { name: "Stern School of Business", coords: [40.72920995777136, -73.99624593575685] },
];

const handleLocationClick = (coords) => {
  if (map) {
    map.flyTo(coords, 18); // Set map center
    setShowPopularList(false); // Close the list
  }
};




const [showPersonalPins, setShowPersonalPins] = useState(() => {
  const storedValue = localStorage.getItem('personalView');
  return storedValue === null ? false : JSON.parse(storedValue);
});

const togglePersonalPins = (newState) => {
  setShowPersonalPins(newState);
};

const filteredPins = showPersonalPins
  ? pins.filter((pin) => pin.username === username)
  : pins;

  // const togglePersonalPins = () => {
  //   setShowPersonalPins(!showPersonalPins);
  // };

  // const filteredPins = showPersonalPins ? pins.filter((pin) => pin.username === username): pins; //Replace 123 with actual userId logic

  const currentUser = userId; 
  const handleAddPin = async (message) => {
    console.log('User id:', userId);
    console.log('Username:', username);
    const newPin = {
      userId: userId || null,
      username: username,
      message: message,
      location: [newPinLocation.lat, newPinLocation.lng],
    };
  
    try {
      await addPin(newPin);
      // setPins((prevPins) => [...prevPins, response.data]);
  
      // Reset modal and phantom pin state
      setModalOpen(false);
      setPhantomPin(null);
    } catch (error) {
      console.error('Error adding new pin:', error);
    }
  };
  

  const handleMapClick = (latlng) => {
    setPhantomPin(latlng); // create the phantom pin on first click
  };

  const handlePhantomPinClick = () => {
    // open modal when the phantom pin is clicked / on second click
    setNewPinLocation(phantomPin); 
    setModalOpen(true); 
  };

  const handleReportPin = (index) => {
    alert(`Reporting pin ${index}`);
  };

  return (


<div className="map-wrapper w-full h-full relative">
      {/* map settings */}
      <button
        onClick={toggleSettingsModal}
        className="absolute top-4 right-4 z-[1000] bg-white p-2 rounded-full shadow-md hover:bg-purpleLight">
        <SettingsIcon className="w-6 h-6 text-purpleMedium"
        />
      </button>

     {/* Search Bar */}
     <div
      className="fixed md:absolute bottom-20 md:top-4 left-1/2 transform -translate-x-1/2 
        z-[1000] w-72 h-10 flex items-center"
    >

<div className="flex items-center w-full">


<button
      className="mr-2 mt-2 bg-purpleMedium hover:bg-purpleDark text-white p-2 rounded-md"
      onClick={() => setShowPopularList((prev) => !prev)}
  >
    
      <StarIcon className="w-5 h-5 text-purpleLight"
        />
    </button>


      <input 
        type="text"
        placeholder="Search for a location..."
        className="w-full h-10 p-2 border border-purpleMedium rounded-md focus:outline-none focus:ring-2 focus:ring-purpleDark"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchResults.length > 0 && (
        <ul
          className="absolute bottom-20 md:top-12 md:bottom-0 bg-white border border-gray-300 w-full rounded-md shadow-md max-h-40 overflow-auto z-[1000] divide-y divide-gray-200"
        >
          {searchResults.map((result, index) => (
            <li
              key={index}
              className="p-2 hover:bg-purpleLight cursor-pointer text-sm text-gray-700 flex items-start leading-snug"
              onClick={() => {
                setSearchResults([]); // Clear results first
                if (map) {
                    map.flyTo([parseFloat(result.lat), parseFloat(result.lon)], 15);
                } else {
                    console.error("Map instance is not defined.");
                }
            }}
            
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}

 


    </div>
    
  

    {showPopularList && (
    <ul className="absolute bottom-20 md:top-12 md:bottom-0 bg-white border border-gray-300 w-full rounded-md shadow-md max-h-40 overflow-auto z-[1000] divide-y divide-gray-200">
      {popularLocations.map((location, index) => (
        <li
          key={index}
          className="p-2 hover:bg-purpleLight cursor-pointer text-sm text-gray-700 flex items-start leading-snug"
          onClick={() => handleLocationClick(location.coords)}
        >
          {location.name}
        </li>
      ))}
    </ul>
  )}
  </div>


      <MapContainer
      key={pins.length}
        center={mapCenter}
        zoom={23}
        style={{ height: 'calc(100vh - 95px)', width: '100%' }}
        whenCreated={(mapInstance) => {
          console.log("Map instance created:", mapInstance);
          setMap(mapInstance);
        }}
      >
        <MapEvents handleMapClick={handleMapClick}/>

        <InitializeMap setMap={setMap} />



        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

{filteredPins.map((pin) => (
          <Marker key={pin._id} position={pin.location} icon={createCustomIcon()}>
            <Popup>
              <p className="text-sm text-purpleDark break-words">{pin.message}</p>
            </Popup>
          </Marker>
        ))}

        {/* evntually, render existing pins */}
      

        {/* render phantom pin if it exists */}
        {phantomPin && (
          <Marker
            position={[phantomPin.lat, phantomPin.lng]}
            icon={createCustomIcon()}
            opacity={0.5}
            eventHandlers={{
              click: handlePhantomPinClick, // open the modal on phantom pin click
            }}
          />
        )}
      </MapContainer>

      {/* modal for pin creation */}
      <PinModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleAddPin}
      />

        {/* modal for map settings */}
        {isSettingsOpen && (
            <MapSettings
            isOpen={isSettingsOpen}
            onClose={toggleSettingsModal}
            onTogglePersonal={togglePersonalPins}
            onToggleFriends={() => {}}
            />
        )}

      
    </div>
    
  );
};

// handle map click
function MapEvents({ handleMapClick }) {
  useMapEvents({
    click(e) {
      handleMapClick(e.latlng);
    },
  });
  return null;
}

export default MapComponent;

import React, { useState } from 'react';
import '../assets/styles/App.css';
import map from '../assets/images/map.png';
import Button from '../components/button';
import PinModal from '../components/pinModal';
import PinCreation from '../components/pinCreation';
import MapSettings from '../components/MapSettings';
import MapComponent from '../components/Map';

/**
 * A React component that represents a single page of the app.
 * Use this file to create new pages as needed.
 * Don't forget to add the new route to App.js.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */

const Home = (props) => {
  return (
    <div className="map-container w-full h-[80vh]">
      <MapComponent />
    </div>
  );
};

export default Home;

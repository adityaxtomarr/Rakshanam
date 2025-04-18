// src/components/MapComponent.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix the marker icon (important for proper display)
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const MapComponent = () => {
  const position = [28.3653, 77.5408]; // Your location

  return (
    <MapContainer center={position} zoom={15} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      <Marker 
        position={position}
        icon={L.icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
      >
        <Popup>
          📍 You are here!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;

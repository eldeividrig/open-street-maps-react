import React from 'react'
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Icon from '../assets/icon.svg';

const customIcon = new L.Icon({
    iconUrl: Icon,
    iconSize: [35, 35], // Size of the icon
    iconAnchor: [17, 35], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -35] // Point from which the popup should open relative to the iconAnchor
  });


const Markers = () => {
  return (
    <div>
        <Marker position={[-27.382281, -55.918723]} icon={customIcon}>
            <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </div>
  )
}

export default Markers
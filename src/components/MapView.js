import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IconLocation } from "./IconLocation";
import axios from "axios";

const MapView = () => {
  const [state, setState] = useState({
    currentLocation: { lat: "-27.427638", lng: "-55.915891" },
    zoom: 13,
  });

  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [inputAddress, setInputAddress] = useState("");


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setState({
        currentLocation: newLocation,
        zoom: 13,
      });
      setMarker(newLocation);
      fetchAddress(newLocation.lat, newLocation.lng);
    });
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      setAddress(response.data.display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const fetchCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}`
      );
      if (response.data.length > 0) {
        const location = response.data[0];
        const newLocation = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        };
        setState({
          currentLocation: newLocation,
          zoom: 13,
        });
        setMarker(newLocation);
      } else {
        console.error(
          "No se encontraron coordenadas para la dirección proporcionada."
        );
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    fetchCoordinates(inputAddress);
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const newMarker = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setMarker(newMarker);
        fetchAddress(newMarker.lat, newMarker.lng);
      },
    });
    return null;
  };

  const CenterMapOnMarker = () => {
    const map = useMap();
    useEffect(() => {
      if (marker) {
        map.setView([marker.lat, marker.lng], map.getZoom());
      }
    }, [map]);
    return null;
  };

  return (
    <div>
      <form onSubmit={handleAddressSubmit}>
        <input
          type="text"
          value={inputAddress}
          onChange={(e) => setInputAddress(e.target.value)}
          placeholder="Ingrese una dirección"
        />
        <button type="submit">Buscar</button>
      </form>
      <MapContainer
        center={state.currentLocation}
        zoom={state.zoom}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        <CenterMapOnMarker />
        {marker && (
          <Marker position={[marker.lat, marker.lng]} icon={IconLocation}>
            <Popup>
              Marcador en: {marker.lat}, {marker.lng}
              <br />
              Dirección: {address}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;

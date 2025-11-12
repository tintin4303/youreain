// app/admin/components/GoogleMapPicker.jsx
"use client";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const defaultCenter = { lat: 13.7563, lng: 100.5018 }; // Bangkok

export default function GoogleMapPicker({ lat, lng, onLocationSelect }) {
  const [center, setCenter] = useState(defaultCenter);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      const pos = { lat: Number(lat), lng: Number(lng) };
      setCenter(pos);
      setMarker(pos);
    }
  }, [lat, lng]);

  const handleMapClick = (e) => {
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarker(pos);
    onLocationSelect(pos.lat, pos.lng);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </LoadScript>
  );
}
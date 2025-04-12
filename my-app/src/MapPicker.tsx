import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LOCATION } from "./utils/constants";

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  onLocationSelect: (lat: number, lng: number) => void;
};

const LocationMarker = ({ onLocationSelect }: Props) => {
    const [position, setPosition] = useState<[number, number]>([LOCATION[0], LOCATION[1]]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return <Marker position={position} icon={markerIcon} />;
};

const MapPicker = ({ onLocationSelect }: Props) => {
  return (
    <div style={{ height: '500px', width: '100%', marginBottom: '24px' }}>
      <MapContainer
        center={[LOCATION[0], LOCATION[1]]}
        zoom={6.5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;

"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const defaultPosition: [number, number] = [12.9716, 77.5946]; // Bengaluru

export default function Map({ places }: { places: any[] }) {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place, index) => ( //markers 
        <Marker
          key={index}
          position={[
            place.location.coordinates[1], // lat
            place.location.coordinates[0], // lng
          ]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{place.name}</h3>
              <p>{place.category}</p>
              <p>{place.area}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
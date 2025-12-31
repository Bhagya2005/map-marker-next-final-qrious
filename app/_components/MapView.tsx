//What I Learn ?
//for find latlng I use useMapEvent and inside this use onMapClick or onMouseMove
//how to set Leaflet configuration
// MapContainer -> TileLayer -> MapClickHandler -> MapMouseMoveHandler
//In typeScript how to add type in function

import {MapContainer,TileLayer,Marker,Popup,useMap,useMapEvent} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import { MapViewProps,pin } from "../types";


const getColoredIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <svg width="35" height="35" viewBox="0 0 24 24"
        style="transform: translate(-5px, -5px)">
        <path fill="${color}"
          d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13
          c0-3.9-3.1-7-7-7zm0 9.5
          c-1.4 0-2.5-1.1-2.5-2.5
          S10.6 6.5 12 6.5s2.5 1.1
          2.5 2.5S13.4 11.5 12 11.5z"/>
      </svg>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });


    function MapClickHandler({
      onMapClick,
    }: {
      onMapClick?: (lat: number, lng: number) => void;
    }) {
      useMapEvent("click", (e: LeafletMouseEvent) => {
        onMapClick?.(e.latlng.lat, e.latlng.lng);
      });
      return null;
    }

    function MapMouseMoveHandler({
      onMouseMove,
    }: {
      onMouseMove?: (lat: number, lng: number) => void;
    }) {
      useMapEvent("mousemove", (e: LeafletMouseEvent) => {
        onMouseMove?.(e.latlng.lat, e.latlng.lng);
      });
      return null;
    }

    function PinMarker({
      pin,
      setSelectedPin,
    }: {
      pin: pin;
      setSelectedPin?: (pin: pin | null) => void;
    }) {
      const map = useMap();

  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={getColoredIcon(pin.color)}
      eventHandlers={{
        click: () => {
          setSelectedPin?.(pin);
          map.flyTo([pin.lat, pin.lng], 8, {
            animate: true,
            duration: 1.5,
          });
        },
      }}
    >
      <Popup>
        <h4>{pin.name}</h4>
        <p>{pin.description}</p>
        <p>
          <b>Category:</b> {pin.category}
        </p>
      </Popup>
    </Marker>
  );
}

export default function MapView({pins,onMapClick,onMouseMove,setSelectedPin,mapRef}: MapViewProps) {
  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]}
        zoom={5}
        className="map"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapClickHandler onMapClick={onMapClick} />
        <MapMouseMoveHandler onMouseMove={onMouseMove} />

        {pins.map((p) => (
          <PinMarker
            key={p.id}
            pin={p}
            setSelectedPin={setSelectedPin}
          />
        ))}
      </MapContainer>
    </div>
  );
}

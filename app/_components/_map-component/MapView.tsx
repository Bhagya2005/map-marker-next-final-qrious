//what I Learn ?
//Configure of Leaflet Map (Means Set Up)
//How To Convert Themable Map (Ushke liye TileLayer -> url -> Theme)

"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { MapViewProps } from "@/app/types";
import { useTheme } from "@/app/_components/theme-context";
import PinMarker from "@/app/_components/_map-component/PinMarker";
import ResetControl from "@/app/_components/_map-component/ResetControl";
import MapClickHandler from "@/app/_components/_map-component/MapClickHandler";
import TourControl from "@/app/_components/_map-component/TourControl";

export default function MapView({pins,mapRef,onMapClick,onSelectPin,openWalkthrough}: MapViewProps) {
  const { theme } = useTheme();

  return (
    <div className="h-screen w-full">
      <MapContainer
        ref={mapRef}
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
      >
        <TileLayer
          url={
            theme === "dark"
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />

        <ResetControl />

        {pins.map((p) => (
          <PinMarker key={p.id} pin={p} onSelectPin={onSelectPin} />
        ))}

        <MapClickHandler onMapClick={onMapClick} />
        <TourControl onTourClick={openWalkthrough} />
      </MapContainer>
    </div>
  );
}

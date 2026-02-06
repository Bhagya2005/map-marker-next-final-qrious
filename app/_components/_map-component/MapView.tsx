// //what I Learn ?
// //Configure of Leaflet Map (Means Set Up)
// //How To Convert Themable Map (Ushke liye TileLayer -> url -> Theme)
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { MapViewProps } from "@/app/types";
import { useMapThemeStore } from "@/stores/mapThemeStore";
import PinMarker from "@/app/_components/_map-component/PinMarker";
import MapClickHandler from "@/app/_components/_map-component/MapClickHandler";

export default function MapView({pins, mapRef, onMapClick, onSelectPin, openWalkthrough}: MapViewProps) {
  const { mapTheme, setMapTheme, bootstrapTheme } = useMapThemeStore();

  useEffect(() => {
    bootstrapTheme();
  }, [bootstrapTheme]);

  const handleReset = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([20.5937, 78.9629], 5, { animate: true, duration: 1.5 });
    }
  };

  return (
    <div className="h-screen w-full relative font-sans overflow-hidden pointer-events-none">
      
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <MapContainer
          ref={mapRef}
          center={[20.5937, 78.9629]}
          zoom={5}
          zoomControl={false} 
          className="h-full w-full"
        >
          <TileLayer
            url={mapTheme === "dark"
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          />
          <MapClickHandler onMapClick={onMapClick} />
          {pins.map((p) => (
            <PinMarker key={p._id || p.id} pin={p} onSelectPin={onSelectPin} />
          ))}
        </MapContainer>
      </div>

      <div 
        style={{ zIndex: 999999 }}
        className="absolute top-6 right-6 flex flex-row items-center gap-3 pointer-events-auto"
      >

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Reset Clicked");
            handleReset();
          }}
          className={`px-5 py-2.5 rounded-2xl border font-bold text-[10px] uppercase tracking-wider cursor-pointer backdrop-blur-xl shadow-2xl transition-all active:scale-90
            ${mapTheme === "dark" ? "bg-zinc-900/90 text-zinc-400 border-zinc-700" : "bg-white/90 text-zinc-600 border-zinc-200"}`}
        >
          Reset View
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("!!! TOUR BUTTON CLICKED !!!"); 
            if (openWalkthrough) openWalkthrough();
          }}
          className="px-5 py-2.5 rounded-2xl border font-bold text-[10px] uppercase tracking-wider bg-indigo-600 text-white border-indigo-400 cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all hover:scale-105 active:scale-90"
        >
          Start Tour
        </button>

        <div 
          onClick={(e) => {
            e.stopPropagation();
            setMapTheme(mapTheme === "dark" ? "light" : "dark");
          }}
          className={`relative flex items-center cursor-pointer p-1 rounded-full border transition-all duration-500 w-[74px] h-[36px] backdrop-blur-md
            ${mapTheme === "dark" ? "bg-zinc-900 border-zinc-700" : "bg-zinc-100 border-zinc-300"}`}
        >
          <div className={`absolute w-7 h-7 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg
            ${mapTheme === "dark" ? "translate-x-[36px] bg-indigo-500" : "translate-x-0 bg-white"}`}>
            {mapTheme === "dark" ? "🌙" : "☀️"}
          </div>
        </div>
      </div>
    </div>
  );
}

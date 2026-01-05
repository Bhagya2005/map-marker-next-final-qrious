//what I Learn ?
//Handle Event Propagation 

//Why manipulate DOM ?
//Leaflet : Imperative DOM Library
//Leaflet internally document.createElement , appendChild
//Real Leaflet control - > JS DOM


"use client";

import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { createPortal } from "react-dom";
import L from "leaflet";

export default function ResetControl() {
  const map = useMap();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const mapContainer = map.getContainer();
    mapContainer.style.position = "relative";

    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "10px"; 
    wrapper.style.right = "12px";
    wrapper.style.zIndex = "1000";
    wrapper.style.pointerEvents = "auto";

    L.DomEvent.disableClickPropagation(wrapper);
    L.DomEvent.disableScrollPropagation(wrapper);

    mapContainer.appendChild(wrapper);
    setContainer(wrapper);

    return () => {
      mapContainer.removeChild(wrapper);
      setContainer(null);
    };
  }, [map]);

  if (!container) return null;

  return createPortal(
    <div
      onClick={(e) => {
        e.stopPropagation();
        map.flyTo([20.5937, 78.9629], 5, {
          animate: true,
          duration: 1.2,
        });
      }}
      className="leaflet-bar leaflet-control cursor-pointer px-3 py-1.5 bg-white rounded-lg shadow-md text-xl font-bold select-none hover:scale-105 transition-all"
      title="Reset Map"
    >
      ⟳
    </div>,
    container
  );
}

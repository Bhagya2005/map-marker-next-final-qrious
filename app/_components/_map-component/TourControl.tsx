//Same Concept Used From ResetControl
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
import { useTheme } from "@/app/_components/theme-context";
import { TourControlProps } from "@/app/types";

export default function TourControl({onTourClick}: TourControlProps) {
  const map = useMap();
  const { theme } = useTheme();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
  if (!onTourClick) return;

  const mapContainer = map.getContainer();

  mapContainer.style.position = "relative";

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.top = "100px"
  wrapper.style.right = "10px";
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
}, [map, onTourClick, theme]);


  if (!container) return null;

  return createPortal(
    <button
      onClick={(e) => {
        e.stopPropagation(); 
        onTourClick?.();
      }}
      className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-sm cursor-pointer"
    >
      Tour
    </button>,
    container
  );
}

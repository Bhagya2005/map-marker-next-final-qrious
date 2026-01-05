//What I Learn ?
//How To find latlng using onMapClick and useMapEvent

import { useMapEvent } from "react-leaflet";
import { MapClickHandlerProps } from "@/app/types";

export default function MapClickHandler({onMapClick}: MapClickHandlerProps) {
  useMapEvent("click", (e) => {
    onMapClick(e.latlng.lat, e.latlng.lng);
  });

  return null;
}

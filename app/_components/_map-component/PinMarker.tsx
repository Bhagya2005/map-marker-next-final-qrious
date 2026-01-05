//What I Learn ?
//Solved Previous Problem Like Zoom Out 
//Here Apply Logic : Every time Zoom in  (Method used map.flyTO and map.getZoom)

import { Marker, useMap } from "react-leaflet";
import { PinMarkerProps } from "@/app/types";
import { simplePin } from "@/app/_components/_map-component/map-icons";

export default function PinMarker({pin,onSelectPin}: PinMarkerProps) {
  const map = useMap();

  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={simplePin(pin.color)}
      eventHandlers={{
        click: () => {
          onSelectPin(pin);
          map.flyTo([pin.lat, pin.lng], map.getZoom() + 1, {
            animate: true,
            duration: 0.8,
          });
        },
      }}
    />
  );
}

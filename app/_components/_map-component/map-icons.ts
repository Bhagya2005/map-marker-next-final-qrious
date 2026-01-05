//What I Learn ?
//Icon ko Color ke sath dynamic kaise banaye
//icon ki size ka configuration
// iconSize: [22, 22]
//  Icon ki total width = 22px, height = 22px

// iconAnchor: [11, 22]
//iconAnchor decide karta hai icon ka kaunsa hissa map ke actual location par fix hoga.
//Icon ka ye pixel map ke exact location par rahega

import L from "leaflet";

export const simplePin = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:22px;height:22px;transform:translate(-50%,-100%)">
        <div style="width:22px;height:22px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 0 0 2px white,0 2px 6px rgba(0,0,0,0.6)"></div>
        <div style="position:absolute;top:6px;left:6px;width:8px;height:8px;background:white;border-radius:50%"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });

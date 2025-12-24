import type { Map as LeafletMap } from "leaflet";

export type pin = {
    id:string;
    name:string;
    description:string;
    lat:number;
    lng:number;
    color:string;
    category:string;
    userId:string;
};

export type Category = {
    name: string;
    color: string;
    userId:string;
};

export type MapViewProps = {
  pins: pin[];
  onMapClick?: (lat: number, lng: number) => void;
  onMouseMove?: (lat: number, lng: number) => void;
  setSelectedPin?: (pin: pin | null) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
};

export type PinFormProps ={
    pin:pin;
    categories:Category[];
    onSave: (pin:pin) => void;
    onClose:() => void;
};

export type NewCategory = Omit<Category, "userId">;

export type SidebarProps = {
  pins: pin[];
  selectedPin: pin | null;
  onSelectPin: (pin: pin) => void;
  onDeletePin: (id: string) => void;
  onEditPin: (pin: pin) => void;
  filter: string;
  setFilter: (value: string) => void;
  cursorLocation: { lat: number; lng: number } | null;
  categories: Category[];
  onAddCategory: (cat: NewCategory) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
  userEmail:string;
};
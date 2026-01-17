//what I learn ?
//All types are declared in one file which method usefull to declare type in one file and easier Debugg for complex Project

import type { Map as LeafletMap } from "leaflet";
import MapClickHandler from './_components/_map-component/MapClickHandler';

export type UserRole = 'admin' | 'regular';

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  token: string;
};

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
  onMapClick: (lat: number, lng: number) => void;
  onMouseMove?: (lat: number, lng: number) => void;
  setSelectedPin?: (pin: pin | null) => void;
  onSelectPin: (pin: pin) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
  openWalkthrough: () => void; 
};

export type TourControlProps = {
   onTourClick?: () => void;
}

export type MapClickHandlerProps = {
  onMapClick: (lat: number, lng: number) => void;
}

export type PinMarkerProps = {
  pin: pin;
  onSelectPin: (pin: pin) => void;
}

export type Theme = "light" | "dark";

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
  onDeleteCategory: (categoryNames: string[]) => void;
  mapRef: React.MutableRefObject<LeafletMap | null>;
  username?:string;
};

export type WalkthroughModalProps = {
  onClose: () => void;
};

export interface PinModalProps {
  pin: pin | null;
  onClose: () => void;
};

export type UserSettingsModalProps = {
  currentEmail?: string;
  onSave: (email: string, password: string) => void;
  onClose: () => void;
};

export interface ShowAllPinsModalProps{
  pins: pin[];
  onClose: () => void;
}


export type CategoryFilterModalProps = {
  categories: { name: string; color: string }[];
  selectedCategories: string[];
  setSelectedCategories: (v: string[]) => void;
  onClose: () => void;
}

export type DeleteCategoryModalProps = {
  categories: Category[];
  onDeleteCategories: (names: string[]) => void;
  onClose: () => void;
}

export type FeedbackModalProps = {
  onClose: () => void;
  onSubmit: (rating: number, description?: string) => void;
}

export type AddCategoryModalProps = {
  newCat: { name: string; color: string };
  setNewCat: (v: { name: string; color: string }) => void;
  onAddCategory: (v: { name: string; color: string }) => void;
  onClose: () => void;
}

export type ReadMoreModalProps = {
  id: string;
  name: string;
  description: string;
  category: string;
  color: string;
  lat: number;
  lng: number;
  onClose: () => void;
}
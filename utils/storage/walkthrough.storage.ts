import { storageService } from "./storage.service";

const STORAGE_KEY = "walkthroughs";
const TOUR_SEEN_KEY = "walkthroughTourSeen";

export type Walkthrough = {
  id: string;
  title: string;
  description: string;
  points: string[];
  videoUrl: string;
  order?: number; 
};

export const getWalkthroughs = (): Walkthrough[] => {
  return storageService.get<Walkthrough[]>(STORAGE_KEY, []);
};

export const saveWalkthroughs = (walkthroughs: Walkthrough[]) => {
  storageService.set(STORAGE_KEY, walkthroughs);
};

export const markTourAsSeen = () => {
  localStorage.setItem(TOUR_SEEN_KEY, "true");
};

export const isTourSeen = (): boolean => {
  return localStorage.getItem(TOUR_SEEN_KEY) === "true";
};

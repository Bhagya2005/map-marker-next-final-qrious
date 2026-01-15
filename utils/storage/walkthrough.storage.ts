import { storageService } from "./storage.service";

export const markTourAsSeen = (): void => {
  storageService.set("hasSeenTour", true);
};

export const hasSeenTour = (): boolean => {
  return storageService.get<boolean>("hasSeenTour", false);
};

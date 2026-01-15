import { storageService } from "./storage.service";

export type Feedback = {
  rating: number;
  description?: string;
  date: string;
};

export const saveFeedback = (
  rating: number,
  description?: string
): void => {
  const feedbacks = storageService.get<Feedback[]>("feedbacks", []);

  feedbacks.push({
    rating,
    description,
    date: new Date().toISOString()
  });

  storageService.set("feedbacks", feedbacks);
};

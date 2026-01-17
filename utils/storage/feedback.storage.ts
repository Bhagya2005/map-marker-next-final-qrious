import { storageService } from "./storage.service";
import { getCurrentUser } from "./user.storage";

export type Feedback = {
  id: string;
  userId: string;
  title: string;
  message: string;
  rating: number;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
};

export const saveFeedback = (
  rating: number,
  message?: string,
  title?: string,
  category?: string
): void => {
  const feedbacks = storageService.get<Feedback[]>("feedbacks", []);
  const user = getCurrentUser();

  const feedback: Feedback = {
    id: Date.now().toString(),
    userId: user?.email || "anonymous",
    title: title || "Feedback",
    message: message || "",
    rating: rating,
    category: category || "other",
    status: "open",
    createdAt: new Date().toISOString()
  };

  feedbacks.push(feedback);
  storageService.set("feedbacks", feedbacks);
};

export const getFeedbacks = (): Feedback[] => {
  return storageService.get<Feedback[]>("feedbacks", []);
};

export const updateFeedbackStatus = (id: string, status: Feedback['status']): void => {
  const feedbacks = storageService.get<Feedback[]>("feedbacks", []);
  const index = feedbacks.findIndex(f => f.id === id);
  if (index !== -1) {
    feedbacks[index].status = status;
    storageService.set("feedbacks", feedbacks);
  }
};

export const deleteFeedback = (id: string): void => {
  const feedbacks = storageService.get<Feedback[]>("feedbacks", []);
  const updated = feedbacks.filter(f => f.id !== id);
  storageService.set("feedbacks", updated);
};

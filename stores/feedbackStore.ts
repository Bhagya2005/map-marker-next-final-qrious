import { create } from "zustand";
import { showSuccess, showError } from "@/utils/toast";

interface Feedback {
  _id: string;
  title: string;
  message: string;
  category: string;
  rating: number;
  status: string;
}

interface FeedbackStore {
  feedbacks: Feedback[];
  loading: boolean;
  feedbackPage: number;
  feedbackTotalPages: number;
  feedbackCategory: string;
  feedbackStatus: string;

  setFeedbackPage: (page: number) => void;
  setFeedbackCategory: (category: string) => void;
  setFeedbackStatus: (status: string) => void;
  fetchFeedbacks: () => Promise<void>;
  changeFeedbackStatus: (id: string, status: string) => Promise<void>;
  removeFeedback: (id: string) => Promise<void>;
  getRatingData: () => any;
}

export const useFeedbackStore = create<FeedbackStore>((set, get) => ({
  feedbacks: [],
  loading: false,
  feedbackPage: 1,
  feedbackTotalPages: 1,
  feedbackCategory: "",
  feedbackStatus: "",

  setFeedbackPage: (page) => set({ feedbackPage: page }),
  setFeedbackCategory: (category) => set({ feedbackCategory: category }),
  setFeedbackStatus: (status) => set({ feedbackStatus: status }),

  fetchFeedbacks: async () => {
    set({ loading: true });
    const { feedbackPage, feedbackCategory, feedbackStatus } = get();
    try {
      const res = await fetch(
        `/api/feedback?page=${feedbackPage}&category=${feedbackCategory}&status=${feedbackStatus}`
      );
      const data = await res.json();
      set({
        feedbacks: data.feedbacks,
        feedbackTotalPages: data.totalPages,
        loading: false,
      });
    } catch {
      showError("Failed to fetch feedbacks");
      set({ loading: false });
    }
  },

  changeFeedbackStatus: async (id, status) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      showSuccess("Status updated");
      get().fetchFeedbacks();
    } catch {
      showError("Failed to update status");
    }
  },

  removeFeedback: async (id) => {
    if (!confirm("Delete this feedback?")) return;
    try {
      await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      showSuccess("Deleted");
      get().fetchFeedbacks();
    } catch {
      showError("Failed to delete feedback");
    }
  },

  getRatingData: () => {
    const ratings = [1, 2, 3, 4, 5];
    const counts = ratings.map(
      (r) => get().feedbacks.filter((f) => f.rating === r).length
    );

    return {
      labels: ratings.map((r) => r + "★"),
      datasets: [
        {
          label: "Feedback Ratings",
          data: counts,
          backgroundColor: "#FBBF24",
        },
      ],
    };
  },
}));

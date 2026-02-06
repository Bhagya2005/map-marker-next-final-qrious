// useAppStore.ts
import { useAuthStore, useUserStore, usePinStore, useFeedbackStore, useWalkthroughStore, useTourStore, useCurrentUserStore } from "./appStore";

export const useAppStore = () => {
  return {
    auth: useAuthStore(),
    user: useUserStore(),
    pin: usePinStore(),
    feedback: useFeedbackStore(),
    walkthrough: useWalkthroughStore(),
    tour: useTourStore(),
    currentUser: useCurrentUserStore(),
  };
};

import { configureStore } from '@reduxjs/toolkit';
import storyReducer from './storySlice';

export const store = configureStore({
  reducer: {
    stories: storyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ADD THESE TWO LINES BELOW:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
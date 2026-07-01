import { configureStore } from '@reduxjs/toolkit';
import storyReducer from './storySlice';
import crewReducer from './crewSlice';

export const store = configureStore({
  reducer: {
    stories: storyReducer,
    crew: crewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
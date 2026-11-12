import { createSelector } from '@reduxjs/toolkit';

export const selectEventsState = (state) => state.events;
export const selectEvents = createSelector([selectEventsState], (e) => e?.events || []);
export const selectUpcomingEvents = createSelector([selectEventsState], (e) => e?.upcomingEvents || []);
export const selectEventsLoading = createSelector([selectEventsState], (e) => Boolean(e?.loading));
export const selectIsCreatingEvent = createSelector([selectEventsState], (e) => Boolean(e?.isCreating));
export const selectIsMutatingEvent = createSelector([selectEventsState], (e) => Boolean(e?.isMutating));

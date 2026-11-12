'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectEvents,
  selectUpcomingEvents,
  selectEventsLoading,
  selectIsCreatingEvent,
} from '../features/events/eventsSelectors';
import {
  setEvents as setReduxEvents,
  addEventToState,
  updateEventInState,
  removeEventFromState,
  setLoading as setReduxLoading,
  setIsCreating as setReduxIsCreating,
  checkUpcomingEventsAction,
} from '../features/events/eventsSlice';



export const useEvent = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showAlert } = useFeedback();

  const events = useAppSelector(selectEvents);
  const upcomingEvents = useAppSelector(selectUpcomingEvents);
  const loading = useAppSelector(selectEventsLoading);
  const isCreating = useAppSelector(selectIsCreatingEvent);

  const setIsCreating = useCallback(
    (val) => {
      dispatch(setReduxIsCreating(val));
    },
    [dispatch]
  );

  const fetchEvents = useCallback(async () => {
    if (!user?._id) return;
    dispatch(setReduxLoading(true));
    try {
      const res = await api.get(`/events/user/${user._id}`);

      if (res.data.success) {
        dispatch(setReduxEvents(res.data.events || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setReduxLoading(false));
    }
  }, [user?._id, dispatch]);

  const addEvent = useCallback(
    async (event) => {
      if (!user?._id) return;
      dispatch(setReduxIsCreating(true));
      try {
        const res = await api.post(
          '/events',
          { ...event, repeatYearly: event.repeatYearly || false }
        );
        if (res.data.success) {
          const newEvent = res.data.event;
          dispatch(addEventToState(newEvent));
          showAlert('Event Added Successfully');
        }
        return res.data.event;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        dispatch(setReduxIsCreating(false));
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const updateEvent = useCallback(
    async (event) => {
      if (!user?._id) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await api.put(`/events/${event._id}`, event);
        if (res.data.success) {
          dispatch(updateEventInState(res.data.event));
          showAlert('Event Updated Successfully');
        }
        return res.data.event;
      } catch (err) {
        console.error(err);
        return null;
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?._id, showAlert, dispatch]
  );

  const deleteEvent = useCallback(
    async (id) => {
      if (!user?._id) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await api.delete(`/events/${id}`);
        if (res.data.success) {
          dispatch(removeEventFromState(id));
          showAlert('Event Deleted Successfully');
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      } finally {
        dispatch(setReduxLoading(false));
      }
    },
    [user?._id, showAlert, dispatch]
  );

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (events.length > 0) {
      dispatch(checkUpcomingEventsAction());
    }
  }, [events, dispatch]);

  return useMemo(
    () => ({
      events,
      loading,
      fetchEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      upcomingEvents,
      setIsCreating,
      isCreating,
    }),
    [events, loading, fetchEvents, addEvent, updateEvent, deleteEvent, upcomingEvents, setIsCreating, isCreating]
  );
};

export default useEvent;

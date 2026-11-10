'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/backendUrl';
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
    if (!user?.token) return;
    dispatch(setReduxLoading(true));
    try {
      const res = await axios.get(`${API_BASE_URL}/events/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.data.success) {
        dispatch(setReduxEvents(res.data.events || []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setReduxLoading(false));
    }
  }, [user?._id, user?.token, dispatch]);

  const addEvent = useCallback(
    async (event) => {
      if (!user?.token) return;
      dispatch(setReduxIsCreating(true));
      try {
        const res = await axios.post(
          `${API_BASE_URL}/events`,
          { ...event, repeatYearly: event.repeatYearly || false },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
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
    [user?.token, showAlert, dispatch]
  );

  const updateEvent = useCallback(
    async (event) => {
      if (!user?.token) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await axios.put(`${API_BASE_URL}/events/${event._id}`, event, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
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
    [user?.token, showAlert, dispatch]
  );

  const deleteEvent = useCallback(
    async (id) => {
      if (!user?.token) return;
      dispatch(setReduxLoading(true));
      try {
        const res = await axios.delete(`${API_BASE_URL}/events/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
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
    [user?.token, showAlert, dispatch]
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

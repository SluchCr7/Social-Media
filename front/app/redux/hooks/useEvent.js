'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import api from '@/app/utils/api';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectEvents,
  selectUpcomingEvents,
  selectEventsLoading,
  selectIsCreatingEvent,
  selectIsMutatingEvent,
} from '../features/events/eventsSelectors';
import {
  setEvents as setReduxEvents,
  addEventToState,
  updateEventInState,
  removeEventFromState,
  setLoading as setReduxLoading,
  setIsCreating as setReduxIsCreating,
  setIsMutating as setReduxIsMutating,
  checkUpcomingEventsAction,
} from '../features/events/eventsSlice';

const editableEventFields = [
  'title',
  'description',
  'date',
  'startTime',
  'endTime',
  'location',
  'type',
  'isVirtual',
  'meetingLink',
  'repeatYearly',
  'repeatPattern',
  'repeatUntil',
  'priority',
  'status',
];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const selectEditableEventFields = (event) =>
  editableEventFields.reduce((payload, field) => {
    if (event[field] !== undefined) payload[field] = event[field];
    return payload;
  }, {});

export const useEvent = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const [error, setError] = useState(null);
  const fetchRequestId = useRef(0);

  const events = useAppSelector(selectEvents);
  const upcomingEvents = useAppSelector(selectUpcomingEvents);
  const loading = useAppSelector(selectEventsLoading);
  const isCreating = useAppSelector(selectIsCreatingEvent);
  const isMutating = useAppSelector(selectIsMutatingEvent);

  const fetchEvents = useCallback(async () => {
    const requestId = ++fetchRequestId.current;
    if (!user?._id) {
      dispatch(setReduxEvents([]));
      setError(null);
      dispatch(setReduxLoading(false));
      return [];
    }

    dispatch(setReduxLoading(true));
    setError(null);

    try {
      const response = await api.get(`/events/user/${user._id}`);
      if (requestId !== fetchRequestId.current) return null;
      if (!response.data?.success || !Array.isArray(response.data.events)) {
        throw new Error(response.data?.message || 'Unable to load events.');
      }

      dispatch(setReduxEvents(response.data.events));
      return response.data.events;
    } catch (requestError) {
      if (requestId !== fetchRequestId.current) return null;
      const message = getErrorMessage(requestError, 'Unable to load events.');
      setError(message);
      showToast(message, 'error');
      return null;
    } finally {
      if (requestId === fetchRequestId.current) dispatch(setReduxLoading(false));
    }
  }, [user?._id, dispatch, showToast]);

  const addEvent = useCallback(
    async (event) => {
      if (!user?._id) {
        showToast('Sign in to create an event.', 'error');
        return null;
      }

      dispatch(setReduxIsCreating(true));
      dispatch(setReduxIsMutating(true));
      try {
        const response = await api.post('/events', {
          ...event,
          repeatYearly: event.repeatYearly || false,
        });
        if (!response.data?.success || !response.data.event?._id) {
          throw new Error(response.data?.message || 'Unable to create the event.');
        }

        dispatch(addEventToState(response.data.event));
        showToast('Event added successfully.');
        return response.data.event;
      } catch (requestError) {
        showToast(getErrorMessage(requestError, 'Unable to create the event.'), 'error');
        return null;
      } finally {
        dispatch(setReduxIsCreating(false));
        dispatch(setReduxIsMutating(false));
      }
    },
    [user?._id, showToast, dispatch]
  );

  const updateEvent = useCallback(
    async (event) => {
      const eventId = event?._id?.toString();
      if (!user?._id || !eventId) {
        showToast('Unable to update this event.', 'error');
        return null;
      }

      dispatch(setReduxIsMutating(true));
      try {
        const response = await api.put(
          `/events/${eventId}`,
          selectEditableEventFields(event)
        );
        if (!response.data?.success || !response.data.event?._id) {
          throw new Error(response.data?.message || 'Unable to update the event.');
        }

        dispatch(updateEventInState(response.data.event));
        showToast('Event updated successfully.');
        return response.data.event;
      } catch (requestError) {
        showToast(getErrorMessage(requestError, 'Unable to update the event.'), 'error');
        return null;
      } finally {
        dispatch(setReduxIsMutating(false));
      }
    },
    [user?._id, showToast, dispatch]
  );

  const deleteEvent = useCallback(
    async (id) => {
      if (!user?._id || !id) {
        showToast('Unable to delete this event.', 'error');
        return false;
      }

      dispatch(setReduxIsMutating(true));
      try {
        const response = await api.delete(`/events/${id}`);
        if (!response.data?.success) {
          throw new Error(response.data?.message || 'Unable to delete the event.');
        }

        dispatch(removeEventFromState(id));
        showToast('Event deleted successfully.');
        return true;
      } catch (requestError) {
        showToast(getErrorMessage(requestError, 'Unable to delete the event.'), 'error');
        return false;
      } finally {
        dispatch(setReduxIsMutating(false));
      }
    },
    [user?._id, showToast, dispatch]
  );

  useEffect(() => {
    fetchEvents();
    return () => {
      fetchRequestId.current += 1;
    };
  }, [fetchEvents]);

  useEffect(() => {
    dispatch(checkUpcomingEventsAction());
  }, [events, dispatch]);

  return useMemo(
    () => ({
      events,
      loading,
      error,
      fetchEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      upcomingEvents,
      isCreating,
      isMutating,
    }),
    [
      events,
      loading,
      error,
      fetchEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      upcomingEvents,
      isCreating,
      isMutating,
    ]
  );
};

export default useEvent;

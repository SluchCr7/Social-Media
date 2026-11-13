'use client';

import { useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { getEventDay, getEventOccurrencesInRange } from '@/app/utils/eventDate';
import { useAuth } from './useAuth';
import { useFeedback } from './useFeedback';
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useGetEventsByUserQuery,
  useUpdateEventMutation,
} from '../features/events/eventsApi';

const EMPTY_EVENTS = [];

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
  error?.data?.message || error?.response?.data?.message || error?.message || fallback;

const selectEditableEventFields = (event) =>
  editableEventFields.reduce((payload, field) => {
    if (event[field] !== undefined) payload[field] = event[field];
    return payload;
  }, {});

export const useEvent = () => {
  const { user } = useAuth();
  const { showToast } = useFeedback();
  const eventsQuery = useGetEventsByUserQuery(
    { userId: user?._id },
    { skip: !user?._id }
  );
  const [createEventRequest, createEventState] = useCreateEventMutation();
  const [updateEventRequest, updateEventState] = useUpdateEventMutation();
  const [deleteEventRequest, deleteEventState] = useDeleteEventMutation();

  const events = eventsQuery.currentData || EMPTY_EVENTS;
  const loading = eventsQuery.isLoading;
  const error = getErrorMessage(eventsQuery.error, null);
  const refetchEvents = eventsQuery.refetch;
  const upcomingEvents = useMemo(() => {
    const now = dayjs();
    const today = now.startOf('day');
    const end = today.add(7, 'day');
    return events
      .flatMap((event) => getEventOccurrencesInRange(event, today, end))
      .filter((event) => {
        const eventDate = getEventDay(event.date);
        const [hours, minutes] = (event.startTime || '00:00').split(':').map(Number);
        return eventDate.hour(hours).minute(minutes).isAfter(now);
      })
      .sort((a, b) => getEventDay(a.date).valueOf() - getEventDay(b.date).valueOf());
  }, [events]);

  const fetchEvents = useCallback(async () => {
    if (!user?._id) return [];
    try {
      return await refetchEvents().unwrap();
    } catch (requestError) {
      const message = getErrorMessage(requestError, 'Unable to load events.');
      showToast(message, 'error');
      return null;
    }
  }, [refetchEvents, showToast, user?._id]);

  const addEvent = useCallback(async (event) => {
    if (!user?._id) {
      showToast('Sign in to create an event.', 'error');
      return null;
    }
    try {
      const response = await createEventRequest({
        ...event,
        repeatYearly: event.repeatYearly || false,
      }).unwrap();
      if (!response?.success || !response.event?._id) {
        throw new Error(response?.message || 'Unable to create the event.');
      }
      showToast('Event added successfully.');
      return response.event;
    } catch (requestError) {
      showToast(getErrorMessage(requestError, 'Unable to create the event.'), 'error');
      return null;
    }
  }, [createEventRequest, showToast, user?._id]);

  const updateEvent = useCallback(async (event) => {
    const eventId = event?._id?.toString();
    if (!user?._id || !eventId) {
      showToast('Unable to update this event.', 'error');
      return null;
    }
    try {
      const response = await updateEventRequest({
        id: eventId,
        changes: selectEditableEventFields(event),
      }).unwrap();
      if (!response?.success || !response.event?._id) {
        throw new Error(response?.message || 'Unable to update the event.');
      }
      showToast('Event updated successfully.');
      return response.event;
    } catch (requestError) {
      showToast(getErrorMessage(requestError, 'Unable to update the event.'), 'error');
      return null;
    }
  }, [showToast, updateEventRequest, user?._id]);

  const deleteEvent = useCallback(async (id) => {
    if (!user?._id || !id) {
      showToast('Unable to delete this event.', 'error');
      return false;
    }
    try {
      const response = await deleteEventRequest(id).unwrap();
      if (!response?.success) {
        throw new Error(response?.message || 'Unable to delete the event.');
      }
      showToast('Event deleted successfully.');
      return true;
    } catch (requestError) {
      showToast(getErrorMessage(requestError, 'Unable to delete the event.'), 'error');
      return false;
    }
  }, [deleteEventRequest, showToast, user?._id]);

  return useMemo(() => ({
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    upcomingEvents,
    isCreating: createEventState.isLoading,
    isMutating: createEventState.isLoading || updateEventState.isLoading || deleteEventState.isLoading,
  }), [
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    upcomingEvents,
    createEventState.isLoading,
    updateEventState.isLoading,
    deleteEventState.isLoading,
  ]);
};

export default useEvent;

"use client";

import React, { useState, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { getEventOccurrencesInRange } from "@/app/utils/eventDate";
import {
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
  FaBell,
  FaFlag,
} from "react-icons/fa";
import { useEvent } from '@/app/redux/hooks';
import { useFeedback } from '@/app/redux/hooks/useFeedback';
import DesignCalender from "./DesignCalender";
import CalendarSkeleton from "@/app/Skeletons/CalenderSkeleton";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "custom",
    repeatYearly: false,
    repeatPattern: "none",
    startTime: "09:00",
    endTime: "10:00",
    location: "",
    isVirtual: false,
    meetingLink: "",
    color: "#6366f1",
    priority: "medium",
    reminders: [],
    tags: [],
    invitedUsers: [],
    notes: ""
  });
  const [showDayEvents, setShowDayEvents] = useState(null);
  const [viewMode, setViewMode] = useState("month");
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const {
    events,
    loading,
    error,
    fetchEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    isCreating,
    isMutating,
  } = useEvent();
  const { confirmAction, showToast } = useFeedback();

  const typeIcons = useMemo(() => ({
    birthday: <FaBirthdayCake />,
    meeting: <FaUsers />,
    public: <FaCalendarAlt />,
    custom: <FaRegStar />,
    reminder: <FaBell />,
    deadline: <FaFlag />,
  }), []);

  const typeColors = useMemo(() => ({
    birthday: "bg-pink-500/10 text-pink-600 border-pink-500/20",
    meeting: "bg-green-500/10 text-green-600 border-green-500/20",
    public: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    custom: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    reminder: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    deadline: "bg-red-500/10 text-red-600 border-red-500/20",
  }), []);

  const days = useMemo(() => {
    if (viewMode === "week") {
      return Array.from({ length: 7 }, (_, index) =>
        currentDate.startOf("week").add(index, "day")
      );
    }

    const startDate = currentDate.startOf("month").startOf("week");
    const endDate = currentDate.endOf("month").endOf("week");
    const calendarDays = [];
    for (let date = startDate; !date.isAfter(endDate, "day"); date = date.add(1, "day")) {
      calendarDays.push(date);
    }
    return calendarDays;
  }, [currentDate, viewMode]);

  const handleAddEvent = useCallback(async () => {
    if (!newEvent.title.trim() || !selectedDate) return;
    if (newEvent.startTime && newEvent.endTime && newEvent.endTime <= newEvent.startTime) {
      showToast("End time must be after start time.", "error");
      return;
    }

    const event = {
      ...newEvent,
      date: selectedDate.format("YYYY-MM-DD"),
      repeatYearly: newEvent.repeatPattern === "yearly",
      repeatUntil: newEvent.repeatUntil || undefined,
    };
    const createdEvent = await addEvent(event);
    if (!createdEvent) return;

    setNewEvent({
      title: "",
      description: "",
      type: "custom",
      repeatYearly: false,
      repeatPattern: "none",
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      isVirtual: false,
      meetingLink: "",
      color: "#6366f1",
      priority: "medium",
      reminders: [],
      tags: [],
      invitedUsers: [],
      notes: ""
    });
    setSelectedDate(null);
  }, [newEvent, selectedDate, addEvent, showToast]);

  const handleUpdateEvent = useCallback(async () => {
    if (!selectedEvent?.title?.trim()) return;
    if (
      selectedEvent.startTime &&
      selectedEvent.endTime &&
      selectedEvent.endTime <= selectedEvent.startTime
    ) {
      showToast("End time must be after start time.", "error");
      return;
    }

    const eventToUpdate = { ...selectedEvent };
    if (
      selectedEvent.originalDate &&
      selectedEvent.date === selectedEvent.occurrenceDate
    ) {
      eventToUpdate.date = selectedEvent.originalDate;
    }
    if (
      !eventToUpdate.repeatPattern ||
      (eventToUpdate.repeatPattern === "none" && eventToUpdate.repeatYearly)
    ) {
      eventToUpdate.repeatPattern = eventToUpdate.repeatYearly ? "yearly" : "none";
    }
    eventToUpdate.repeatYearly = eventToUpdate.repeatPattern === "yearly";
    eventToUpdate.repeatUntil =
      eventToUpdate.repeatPattern === "none"
        ? null
        : eventToUpdate.repeatUntil || null;

    const updatedEvent = await updateEvent(eventToUpdate);
    if (updatedEvent) setSelectedEvent(null);
  }, [selectedEvent, updateEvent, showToast]);

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent?._id) return;
    const isRecurring =
      (selectedEvent.repeatPattern && selectedEvent.repeatPattern !== "none") ||
      selectedEvent.repeatYearly;
    const confirmed = await confirmAction({
      title: isRecurring ? "Delete recurring event?" : "Delete event?",
      text: isRecurring
        ? "This will delete the event and all of its calendar occurrences."
        : "This event will be permanently deleted.",
      confirmButtonText: "Delete",
      type: "danger",
    });
    if (!confirmed) return;

    const deleted = await deleteEvent(selectedEvent._id);
    if (deleted) setSelectedEvent(null);
  }, [selectedEvent, confirmAction, deleteEvent]);

  const rangeStart = viewMode === "agenda" ? currentDate.startOf("month") : days[0];
  const rangeEnd = viewMode === "agenda" ? currentDate.endOf("month") : days[days.length - 1];
  const expandedEvents = useMemo(
    () => events.flatMap((event) => getEventOccurrencesInRange(event, rangeStart, rangeEnd)),
    [events, rangeStart, rangeEnd]
  );

  const filteredEvents = useMemo(() => {
    let filtered = expandedEvents;
    if (filterType !== "all") filtered = filtered.filter((event) => event.type === filterType);
    if (filterPriority !== "all") {
      filtered = filtered.filter((event) => event.priority === filterPriority);
    }
    return filtered;
  }, [expandedEvents, filterType, filterPriority]);

  const isToday = useCallback((date) => dayjs().isSame(date, "day"), []);

  if (loading) {
    return (
      <div className="w-full">
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <DesignCalender
      setNewEvent={setNewEvent}
      newEvent={newEvent}
      setSelectedEvent={setSelectedEvent}
      selectedEvent={selectedEvent}
      currentDate={currentDate}
      days={days}
      isToday={isToday}
      setSelectedDate={setSelectedDate}
      typeIcons={typeIcons}
      setCurrentDate={setCurrentDate}
      showDayEvents={showDayEvents}
      setShowDayEvents={setShowDayEvents}
      events={filteredEvents}
      exportEvents={events}
      typeColors={typeColors}
      handleAddEvent={handleAddEvent}
      handleUpdateEvent={handleUpdateEvent}
      handleDeleteEvent={handleDeleteEvent}
      selectedDate={selectedDate}
      isCreating={isCreating}
      isMutating={isMutating}
      viewMode={viewMode}
      setViewMode={setViewMode}
      filterType={filterType}
      setFilterType={setFilterType}
      filterPriority={filterPriority}
      setFilterPriority={setFilterPriority}
      eventError={error}
      onRetry={fetchEvents}
    />
  );
};

export default Calendar;

"use client";
import React, { useState, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
  FaBell,
  FaFlag,
} from "react-icons/fa";
import { useEvent } from "@/app/Context/EventContext";
import DesignCalender from "./DesignCalender";
import CalenderSkeleton from "@/app/Skeletons/CalenderSkeleton";

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
  const [viewMode, setViewMode] = useState("month"); // month, week, agenda
  const [filterType, setFilterType] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const { events, loading, addEvent, updateEvent, deleteEvent, setIsCreating, isCreating } = useEvent();

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

  const priorityColors = useMemo(() => ({
    low: "bg-gray-500/10 text-gray-600",
    medium: "bg-blue-500/10 text-blue-600",
    high: "bg-orange-500/10 text-orange-600",
    urgent: "bg-red-500/10 text-red-600",
  }), []);

  const handleAddEvent = useCallback(async () => {
    if (!newEvent.title) return;
    const event = { ...newEvent, date: selectedDate.format("YYYY-MM-DD") };
    await addEvent(event);
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
  }, [newEvent, selectedDate, addEvent]);

  const handleUpdateEvent = useCallback(async () => {
    if (!selectedEvent.title) return;
    await updateEvent(selectedEvent);
    setSelectedEvent(null);
  }, [selectedEvent, updateEvent]);

  const handleDeleteEvent = useCallback(async () => {
    if (!selectedEvent) return;
    const originalId = selectedEvent._id?.split("_repeat_")[0] || selectedEvent._id;
    await deleteEvent(originalId);
    setSelectedEvent(null);
  }, [selectedEvent, deleteEvent]);

  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days = [];
  let date = startDate;
  while (date.isBefore(endDate) || date.isSame(endDate)) {
    days.push(date);
    date = date.add(1, "day");
  }

  // Generate recurring events
  const expandedEvents = useMemo(() => {
    return events.flatMap((ev) => {
      if (!ev.repeatYearly && ev.repeatPattern === "none") return [ev];

      const originalDate = dayjs(ev.date);
      const startYear = dayjs().year();
      const yearsToGenerate = 10;

      const repeatedInstances = Array.from({ length: yearsToGenerate }, (_, i) => {
        const year = startYear + i;
        return {
          ...ev,
          date: originalDate.year(year).format("YYYY-MM-DD"),
          _id: `${ev._id}_repeat_${year}`,
        };
      });

      return [ev, ...repeatedInstances];
    });
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = expandedEvents;

    if (filterType !== "all") {
      filtered = filtered.filter(ev => ev.type === filterType);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(ev => ev.priority === filterPriority);
    }

    return filtered;
  }, [expandedEvents, filterType, filterPriority]);

  const isToday = (d) => dayjs().isSame(d, "day");

  if (loading) return (
    <div className="w-full">
      <CalenderSkeleton />
    </div>
  );

  return (
    <>
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
        loading={loading}
        events={filteredEvents}
        typeColors={typeColors}
        priorityColors={priorityColors}
        handleAddEvent={handleAddEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        selectedDate={selectedDate}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filterType={filterType}
        setFilterType={setFilterType}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
      />
    </>
  );
};

export default Calendar;

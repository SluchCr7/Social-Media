"use client";
import React, { useState , useCallback , useMemo } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
} from "react-icons/fa";
import { useEvent } from "@/app/Context/EventContext";
import DesignCalender from "./DesignCalender";
import CalenderSkeleton from "@/app/Skeletons/CalenderSkeleton";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", type: "custom", repeatYearly: false });
  const [showDayEvents, setShowDayEvents] = useState(null);

  const { events, loading, addEvent, updateEvent, deleteEvent,setIsCreating , isCreating } = useEvent();

  const typeIcons = useMemo(() => ({
    birthday: <FaBirthdayCake />,
    meeting: <FaUsers />,
    public: <FaCalendarAlt />,
    custom: <FaRegStar />,
  }), []);

  const typeColors = useMemo(() => ({
    birthday: "bg-pink-200 text-pink-800",
    meeting: "bg-green-200 text-green-800",
    public: "bg-blue-200 text-blue-800",
    custom: "bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text",
  }), []);

  const handleAddEvent = useCallback(async () => {
    if (!newEvent.title) return;
    const event = { ...newEvent, date: selectedDate.format("YYYY-MM-DD") };
    await addEvent(event);
    setNewEvent({ title: "", description: "", type: "custom", repeatYearly: false });
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
   // توليد الأحداث السنوية المتكررة لعدة سنوات قادمة
  const expandedEvents = useMemo(() => {
    return events.flatMap((ev) => {
      if (!ev.repeatYearly) return [ev];

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

  const isToday = (d) => dayjs().isSame(d, "day");
  if (loading) return (
    <div className="w-full">
      <CalenderSkeleton />
    </div>
  )
  return (
    <>
      <DesignCalender
        setNewEvent={setNewEvent} newEvent={newEvent} 
        setSelectedEvent={setSelectedEvent} selectedEvent={selectedEvent}
        currentDate={currentDate} days={days} isToday={isToday} setSelectedDate={setSelectedDate}
        typeIcons={typeIcons} setCurrentDate={setCurrentDate} showDayEvents={showDayEvents} setShowDayEvents={setShowDayEvents}
        loading={loading} events={expandedEvents} typeColors={typeColors} handleAddEvent={handleAddEvent} handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent} selectedDate={selectedDate}
        setIsCreating={setIsCreating} isCreating={isCreating}
      />
    </>
  );
};

export default Calendar;

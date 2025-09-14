"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTrash, FaEdit } from "react-icons/fa";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  // 📌 جلب الأحداث من API
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 📌 إضافة حدث جديد
  const handleAddEvent = async () => {
    if (!newEvent.title) return;
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEvent.title,
          description: newEvent.description,
          date: selectedDate.format("YYYY-MM-DD"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents([...events, data.event]);
        setNewEvent({ title: "", description: "" });
        setSelectedDate(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 تحديث حدث
  const handleUpdateEvent = async () => {
    if (!selectedEvent.title) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedEvent.title,
          description: selectedEvent.description,
          date: selectedEvent.date,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEvents(events.map((ev) => (ev._id === data.event._id ? data.event : ev)));
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 حذف حدث
  const handleDeleteEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${selectedEvent._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setEvents(events.filter((ev) => ev._id !== selectedEvent._id));
        setSelectedEvent(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 حساب الأيام لعرض الشبكة
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

  const isToday = (d) => dayjs().isSame(d, "day");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-2xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <motion.div layout className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dayEvents = events.filter(
            (ev) => dayjs(ev.date).format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
          );

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`h-28 border rounded-lg p-2 cursor-pointer relative ${
                isToday(day) ? "bg-blue-100 border-blue-500" : "bg-white"
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="absolute top-1 right-1 text-xs font-bold text-gray-700">
                {day.date()}
              </div>

              {/* Events */}
              <div className="mt-6 space-y-1">
                {dayEvents.map((ev) => (
                  <div
                    key={ev._id}
                    className="text-xs bg-blue-500 text-white px-1 rounded truncate"
                    onClick={(e) => {
                      e.stopPropagation(); // يمنع فتح add panel
                      setSelectedEvent(ev);
                    }}
                  >
                    {ev.title}
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Event Panel */}
      {selectedDate && !selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-96 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4">
              Add Event on {selectedDate.format("DD MMM YYYY")}
            </h3>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border p-2 rounded mb-3"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setSelectedDate(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white flex items-center gap-1"
                onClick={handleAddEvent}
                disabled={loading}
              >
                <FaPlus />
                {loading ? "Saving..." : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Event Details Panel */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-96 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4">Event Details</h3>
            <input
              type="text"
              className="w-full border p-2 rounded mb-3"
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 rounded mb-3"
              value={selectedEvent.description}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, description: e.target.value })
              }
            />
            <p className="text-sm text-gray-500 mb-4">
              Date: {dayjs(selectedEvent.date).format("DD MMM YYYY")}
            </p>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded bg-blue-500 text-white flex items-center gap-1"
                  onClick={handleUpdateEvent}
                  disabled={loading}
                >
                  <FaEdit /> {loading ? "Saving..." : "Edit"}
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white flex items-center gap-1"
                  onClick={handleDeleteEvent}
                  disabled={loading}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

"use client";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaTrash,
  FaEdit,
  FaBirthdayCake,
  FaUsers,
  FaCalendarAlt,
  FaRegStar,
} from "react-icons/fa";
import { useAuth } from "@/app/Context/AuthContext";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    type: "custom",
  });
  const [loading, setLoading] = useState(false);
  const [showDayEvents, setShowDayEvents] = useState(null); // لعرض كل الأحداث داخل يوم معين
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchEvents();
    }
  }, [user]);

  // 📌 Map icons by type
  const typeIcons = {
    birthday: <FaBirthdayCake />,
    meeting: <FaUsers />,
    public: <FaCalendarAlt />,
    custom: <FaRegStar />,
  };

  const typeColors = {
    birthday: "bg-pink-200 text-pink-800",
    meeting: "bg-green-200 text-green-800",
    public: "bg-blue-200 text-blue-800",
    custom: "bg-gray-200 text-gray-800",
  };

  // 📌 إضافة حدث جديد
  const handleAddEvent = async () => {
    if (!newEvent.title) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            title: newEvent.title,
            description: newEvent.description,
            date: selectedDate.format("YYYY-MM-DD"),
            type: newEvent.type,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEvents([...events, data.event]);
        setNewEvent({ title: "", description: "", type: "custom" });
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events/${selectedEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            title: selectedEvent.title,
            description: selectedEvent.description,
            date: selectedEvent.date,
            type: selectedEvent.type,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEvents(
          events.map((ev) => (ev._id === data.event._id ? data.event : ev))
        );
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events/${selectedEvent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
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
    <div className="p-4 sm:p-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronLeft />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 text-center font-semibold text-gray-600 mb-2 text-sm sm:text-base">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <motion.div
        layout
        className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        {days.map((day, idx) => {
          const dayEvents = events.filter(
            (ev) =>
              dayjs(ev.date).format("YYYY-MM-DD") ===
              day.format("YYYY-MM-DD")
          );

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`min-h-[90px] sm:h-28 border rounded-lg p-1 sm:p-2 cursor-pointer relative ${
                isToday(day) ? "bg-blue-50 border-blue-400" : "bg-white"
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="absolute top-1 right-1 text-[10px] sm:text-xs font-bold text-gray-700">
                {day.date()}
              </div>

              {/* Events */}
              <div className="mt-4 space-y-1">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev._id}
                    className={`px-2 py-1 rounded-md font-medium flex items-center gap-1 cursor-pointer shadow-sm truncate ${typeColors[ev.type]}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(ev);
                    }}
                  >
                    <span className="text-sm">{typeIcons[ev.type]}</span>
                    <span className="truncate">{ev.title}</span>
                  </div>
                ))}

                {dayEvents.length > 3 && (
                  <button
                    className="text-[10px] sm:text-xs text-blue-600 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDayEvents(dayEvents);
                    }}
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
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
            className="bg-white rounded-xl p-4 sm:p-6 w-11/12 sm:w-96 shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4">
              Add Event on {selectedDate.format("DD MMM YYYY")}
            </h3>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border p-2 rounded mb-3"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-3"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <select
              className="w-full border p-2 rounded mb-3"
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
            >
              <option value="birthday">🎂 Birthday</option>
              <option value="meeting">👥 Meeting</option>
              <option value="public">📅 Public</option>
              <option value="custom">⭐ Custom</option>
            </select>
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
            className="bg-white rounded-xl p-4 sm:p-6 w-11/12 sm:w-96 shadow-xl"
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
                setSelectedEvent({
                  ...selectedEvent,
                  description: e.target.value,
                })
              }
            />
            <select
              className="w-full border p-2 rounded mb-3"
              value={selectedEvent.type}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, type: e.target.value })
              }
            >
              <option value="birthday">🎂 Birthday</option>
              <option value="meeting">👥 Meeting</option>
              <option value="public">📅 Public</option>
              <option value="custom">⭐ Custom</option>
            </select>
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

      {/* Show All Events in a Day */}
      {showDayEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-xl p-4 sm:p-6 w-11/12 sm:w-96 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <h3 className="text-lg font-bold mb-4">Day Events</h3>
            {showDayEvents.map((ev) => (
              <div
                key={ev._id}
                className={`px-3 py-2 mb-2 rounded-md font-medium flex items-center gap-2 cursor-pointer shadow-sm ${typeColors[ev.type]}`}
                onClick={() => {
                  setSelectedEvent(ev);
                  setShowDayEvents(null);
                }}
              >
                <span>{typeIcons[ev.type]}</span>
                <div className="flex-1">
                  <p className="font-semibold">{ev.title}</p>
                  <p className="text-xs">{ev.description}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200"
                onClick={() => setShowDayEvents(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

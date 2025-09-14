"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/Context/AuthContext";
import axios from "axios";
import { useAlert } from "./AlertContext";

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  // Fetch all events
  const fetchEvents = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACK_URL}/api/events`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.data.success) setEvents(res.data.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add new event
  const addEvent = async (event) => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events`,
        event,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
        if (res.data.success) setEvents((prev) => [...prev, res.data.event]);
        showAlert("Event Added Successfully")
      return res.data.event;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async (event) => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events/${event._id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (res.data.success)
        setEvents((prev) =>
          prev.map((ev) => (ev._id === res.data.event._id ? res.data.event : ev))
            );
        showAlert("Event Updated Successfully")
      return res.data.event;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACK_URL}/api/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
        if (res.data.success){
            setEvents((prev) => prev.filter((ev) => ev._id !== id));
        }
        showAlert("Event Deleted Successfully")
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?.token]);

  return (
    <EventContext.Provider
      value={{ events, loading, fetchEvents, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

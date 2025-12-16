import api from "./api";
import type { Event } from "@/types/events";

interface FetchEventsParams {
  timeMin: Date;
  timeMax: Date;
}

export const eventsService = {
  async fetchEvents(params: FetchEventsParams): Promise<Event[]> {
    try {
      const response = await api.get("/api/events", {
        params: {
          timeMin: params.timeMin.toISOString(),
          timeMax: params.timeMax.toISOString(),
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  async refreshEvents(): Promise<void> {
    try {
      await api.post("/api/events/refresh");
    } catch (error) {
      console.error("Error refreshing events:", error);
      throw error;
    }
  },

  async syncWithGoogle(): Promise<void> {
    try {
      await api.post("/api/events/sync");
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error);
      throw error;
    }
  },

  async createEvent(eventData: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
  }): Promise<Event> {
    try {
      const response = await api.post("/api/events", {
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.startTime.toISOString(),
        endTime: eventData.endTime.toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  getDateRange(days: number | "lastYear" = 7) {
    const now = new Date();
    let timeMin: Date;
    let timeMax: Date;

    if (days === "lastYear") {
      timeMin = new Date(now);
      timeMin.setDate(timeMin.getDate() - 365);
      timeMin.setHours(0, 0, 0, 0); // Start from beginning of day
      timeMax = new Date(now);
      timeMax.setHours(23, 59, 59, 999); // End of current day
    } else {
      timeMin = new Date(now);
      timeMin.setHours(0, 0, 0, 0); // Start from beginning of today
      timeMax = new Date(now);
      timeMax.setDate(timeMax.getDate() + days);
      timeMax.setHours(23, 59, 59, 999); // End of the last day
    }

    return { timeMin, timeMax };
  },
};

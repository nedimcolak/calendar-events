import { Response } from "express";
import { getEventsByUserId, syncUserEvents, upsertEvent } from "../services/eventService";
import { syncCalendarEvents, createCalendarEvent } from "../services/googleCalendarService";

/**
 * Get events for a date range
 * Query params: timeMin, timeMax (ISO datetime strings)
 */
export const getEvents = async (req: any, res: Response) => {
  try {
    // Use validated query parameters from validation middleware
    const { timeMin, timeMax } = req.validatedQuery || req.query;

    if (!timeMin || !timeMax) {
      return res.status(400).json({
        error: "Missing required query parameters: timeMin and timeMax",
      });
    }

    const userId = req.user.id;
    const startDate = new Date(timeMin);
    const endDate = new Date(timeMax);

    console.log("[getEvents] Query params:", {
      userId,
      timeMin,
      timeMax,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const events = await getEventsByUserId(userId, startDate, endDate);

    console.log("[getEvents] Found events:", events.length);
    events.forEach((e) => {
      console.log(`  - ${e.title}: ${new Date(e.start_time).toISOString()} to ${new Date(e.end_time).toISOString()}`);
    });

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events", details: error });
  }
};

/**
 * Refresh events from Google Calendar and sync to database
 */
export const refreshEvents = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    // Fetch all events from Google Calendar
    const googleEvents = await syncCalendarEvents(req.user);

    // Sync events to database
    await syncUserEvents(userId, googleEvents);

    // Return the synced events
    res.json({
      success: true,
      message: `Successfully synced ${googleEvents.length} events`,
      eventCount: googleEvents.length,
    });
  } catch (error) {
    console.error("Error refreshing events:", error);
    res.status(500).json({ error: "Failed to refresh events", details: error });
  }
};

/**
 * Create a new event
 * Validated body: title, description (optional), startTime, endTime
 * Validation is enforced by createEventBodySchema middleware
 */
export const createEvent = async (req: any, res: Response) => {
  try {
    // Use validated body from validation middleware
    const { title, description, startTime, endTime } = req.validatedBody || req.body;

    const userId = req.user.id;

    // Additional validation in case middleware wasn't applied
    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        error: "Missing required fields: title, startTime, endTime",
      });
    }

    // Validate that startTime and endTime are valid dates
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: "Invalid date format for startTime or endTime",
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        error: "startTime must be before endTime",
      });
    }

    // Create event in Google Calendar
    const googleEvent = await createCalendarEvent(req.user, {
      summary: title,
      description: description || "",
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: endDate.toISOString(),
      },
    });

    if (!googleEvent || !googleEvent.id) {
      throw new Error("Failed to create event in Google Calendar: no event ID returned");
    }

    // Extract the start and end times from the Google Calendar response
    const googleStartTime = googleEvent.start?.dateTime || googleEvent.start?.date;
    const googleEndTime = googleEvent.end?.dateTime || googleEvent.end?.date;

    if (!googleStartTime || !googleEndTime) {
      throw new Error("Failed to parse start/end times from Google Calendar response");
    }

    // Store in database
    console.log("[createEvent] Storing event:", {
      title: googleEvent.summary || title,
      googleEventId: googleEvent.id,
      googleStartTime,
      googleEndTime,
      startTimeISO: new Date(googleStartTime).toISOString(),
      endTimeISO: new Date(googleEndTime).toISOString(),
    });

    const event = await upsertEvent({
      userId,
      googleEventId: googleEvent.id,
      title: googleEvent.summary || title,
      summary: googleEvent.description || description || title,
      startTime: new Date(googleStartTime),
      endTime: new Date(googleEndTime),
    });

    console.log("[createEvent] Event stored:", {
      id: event.id,
      start_time: event.start_time,
      end_time: event.end_time,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event", details: error });
  }
};

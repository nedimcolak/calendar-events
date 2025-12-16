import { google } from "googleapis";
import { env } from "../config/env";

const calendar = google.calendar({ version: "v3" });
const oauth2Client = new google.auth.OAuth2(env.google.clientId, env.google.clientSecret, env.google.redirectUri);
google.options({ auth: oauth2Client });

export async function syncCalendarEvents(user: any) {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    const sixMonthsLater = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());

    oauth2Client.setCredentials({ access_token: user.access_token });
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: "primary",
      timeMin: sixMonthsAgo.toISOString(),
      timeMax: sixMonthsLater.toISOString(),
      orderBy: "startTime",
      singleEvents: true,
    });

    const events = response.data.items || [];
    return events;
  } catch (error) {
    console.error("Error syncing calendar events:", error);
    throw error;
  }
}

export async function createCalendarEvent(user: any, eventData: any) {
  try {
    oauth2Client.setCredentials({ access_token: user.access_token });

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: "primary",
      requestBody: eventData,
    });

    return response.data;
  } catch (error: any) {
    console.error("[createCalendarEvent] Error:", {
      message: error.message,
      code: error.code,
      status: error.status,
      errors: error.errors,
    });
    throw error;
  }
}

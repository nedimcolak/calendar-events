import { prisma } from "../db/prisma";
import type { EventModel as Event } from "../generated/prisma/models/Event";

export const upsertEvent = async (payload: {
  userId: string;
  googleEventId: string;
  title: string;
  summary?: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
}): Promise<Event> => {
  const { userId, googleEventId, title, summary, startTime, endTime, isAllDay = false } = payload;

  return prisma.event.upsert({
    where: { google_event_id: googleEventId },
    update: {
      title,
      summary: summary || title,
      start_time: startTime,
      end_time: endTime,
      is_all_day: isAllDay,
    },
    create: {
      user_id: userId,
      google_event_id: googleEventId,
      title,
      summary: summary || title,
      start_time: startTime,
      end_time: endTime,
      is_all_day: isAllDay,
    },
  });
};

export const getEventsByUserId = async (userId: string, startDate: Date, endDate: Date): Promise<Event[]> => {
  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setHours(23, 59, 59, 999);

  const events = await prisma.event.findMany({
    where: {
      user_id: userId,
      start_time: {
        gte: new Date(startDate),
      },
      end_time: {
        lte: new Date(adjustedEndDate),
      },
    },
    orderBy: {
      start_time: "asc",
    },
  });

  return events;
};

export const syncUserEvents = async (userId: string, googleEvents: any[]): Promise<void> => {
  for (const googleEvent of googleEvents) {
    if (googleEvent.start && googleEvent.end) {
      await upsertEvent({
        userId,
        googleEventId: googleEvent.id,
        title: googleEvent.summary || "Untitled",
        summary: googleEvent.description || googleEvent.summary,
        startTime: new Date(googleEvent.start.dateTime || googleEvent.start.date),
        endTime: new Date(googleEvent.end.dateTime || googleEvent.end.date),
        isAllDay: !googleEvent.start.dateTime,
      });
    }
  }
};

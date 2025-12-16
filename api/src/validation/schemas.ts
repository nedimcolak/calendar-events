import { z } from "zod";

export const getEventsQuerySchema = z.object({
  timeMin: z.string().datetime("Invalid ISO datetime format for timeMin").describe("Start date in ISO format (e.g., 2024-01-01T00:00:00Z)"),
  timeMax: z.string().datetime("Invalid ISO datetime format for timeMax").describe("End date in ISO format (e.g., 2024-12-31T23:59:59Z)"),
});

export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;

export const createEventBodySchema = z
  .object({
    title: z.string().min(1, "Event title is required").max(255, "Event title must be less than 255 characters").trim().describe("Event title/name"),
    description: z.string().max(2000, "Description must be less than 2000 characters").optional().describe("Optional event description"),
    startTime: z.string().datetime("Invalid ISO datetime format for startTime").describe("Event start time in ISO format"),
    endTime: z.string().datetime("Invalid ISO datetime format for endTime").describe("Event end time in ISO format"),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine((data) => new Date(data.startTime) > new Date(), {
    message: "Event must be scheduled for the future",
    path: ["startTime"],
  });

export type CreateEventBody = z.infer<typeof createEventBodySchema>;

export const eventResponseSchema = z.object({
  id: z.string().uuid().describe("Event ID"),
  userId: z.string().uuid().describe("User ID"),
  googleEventId: z.string().nullable().optional().describe("Google Calendar Event ID"),
  title: z.string().describe("Event title"),
  summary: z.string().nullable().optional().describe("Event summary/description"),
  startTime: z.date().describe("Event start time"),
  endTime: z.date().describe("Event end time"),
  isAllDay: z.boolean().optional().describe("Whether event is all-day"),
  createdAt: z.date().describe("Creation timestamp"),
  updatedAt: z.date().describe("Last update timestamp"),
});

export type EventResponse = z.infer<typeof eventResponseSchema>;

export const refreshEventsResponseSchema = z.object({
  success: z.boolean().describe("Success status"),
  message: z.string().describe("Status message"),
  eventCount: z.number().int().describe("Number of events synced"),
});

export type RefreshEventsResponse = z.infer<typeof refreshEventsResponseSchema>;

export const errorResponseSchema = z.object({
  error: z.string().describe("Error message"),
  details: z.unknown().optional().describe("Additional error details"),
  validationErrors: z.record(z.string(), z.array(z.string())).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const validationErrorResponseSchema = z.object({
  error: z.string().describe("Error message"),
  validationErrors: z.record(z.string(), z.array(z.string())),
});

export type ValidationErrorResponse = z.infer<typeof validationErrorResponseSchema>;

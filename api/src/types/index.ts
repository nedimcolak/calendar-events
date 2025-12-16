export interface GoogleUser {
  id: string;
  email: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface GoogleToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Express.Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
  };
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export interface EventPayload {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
}

export interface EventQueryParams {
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  days?: "1" | "7" | "30";
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
  validationErrors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateEventRequest {
  title: string;
  description?: string;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
}

export interface EventDto {
  id: string;
  userId: string;
  googleEventId?: string | null;
  title: string;
  summary?: string | null;
  startTime: Date;
  endTime: Date;
  isAllDay?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetEventsQueryParams {
  timeMin: string; // ISO datetime
  timeMax: string; // ISO datetime
}

export interface RefreshEventsResponseData {
  success: true;
  message: string;
  eventCount: number;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName?: string;
  picture?: string;
  googleId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
}

export interface ValidatedRequest extends Express.Request {
  user?: SessionUser;
  validatedBody?: any;
  validatedQuery?: any;
  validatedParams?: any;
}

export interface GoogleCalendarEventResponse {
  id: string;
  summary: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  organizer?: {
    email: string;
    displayName?: string;
  };
}

export class ValidationError extends Error {
  constructor(
    public validationErrors: Record<string, string[]>,
    message: string = "Validation failed",
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends Error {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  constructor(message: string = "Resource already exists") {
    super(message);
    this.name = "ConflictError";
  }
}

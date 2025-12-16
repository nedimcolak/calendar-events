import { Router } from "express";
import { getEvents, refreshEvents, createEvent } from "../controllers/eventController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateQuery, validateBody } from "../middlewares/validationMiddleware";
import { getEventsQuerySchema, createEventBodySchema } from "../validation/schemas";

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get events for a date range
 *     description: Fetches calendar events for the authenticated user within the specified time range
 *     tags:
 *       - Events
 *     security:
 *       - oauth2: []
 *     parameters:
 *       - in: query
 *         name: timeMin
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Start of time range (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: timeMax
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: End of time range (ISO 8601 format)
 *         example: "2024-01-31T23:59:59Z"
 *     responses:
 *       '200':
 *         description: List of events in the specified time range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   googleEventId:
 *                     type: string
 *                   title:
 *                     type: string
 *                   summary:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *       '400':
 *         description: Missing required query parameters
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '500':
 *         description: Server error
 */
router.get("/", authMiddleware, validateQuery(getEventsQuerySchema), getEvents);

/**
 * @swagger
 * /api/events/refresh:
 *   post:
 *     summary: Refresh events from Google Calendar
 *     description: Syncs the latest events from the user's Google Calendar to the database
 *     tags:
 *       - Events
 *     security:
 *       - oauth2: []
 *     responses:
 *       '200':
 *         description: Events successfully synced
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 eventCount:
 *                   type: integer
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '500':
 *         description: Server error
 */
router.post("/refresh", authMiddleware, refreshEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new calendar event for the authenticated user in Google Calendar and stores it in the database
 *     tags:
 *       - Events
 *     security:
 *       - oauth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *                 example: "Team Meeting"
 *               description:
 *                 type: string
 *                 description: Event description (optional)
 *                 example: "Weekly sync with the team"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Event start time (ISO 8601 format)
 *                 example: "2024-01-15T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Event end time (ISO 8601 format)
 *                 example: "2024-01-15T11:00:00Z"
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *     responses:
 *       '201':
 *         description: Event successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 googleEventId:
 *                   type: string
 *                 title:
 *                   type: string
 *                 summary:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *       '400':
 *         description: Invalid request body
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '500':
 *         description: Server error
 */
router.post("/", authMiddleware, validateBody(createEventBodySchema), createEvent);

export default router;

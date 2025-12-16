import { Router, Request, Response } from "express";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getUserById } from "../services/userService";

const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects to Google OAuth login page with calendar, profile, and email scopes
 *     tags:
 *       - Authentication
 *     responses:
 *       '302':
 *         description: Redirect to Google OAuth login page
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/calendar", "profile", "email"],
  }),
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback endpoint
 *     description: Handles the Google OAuth callback and redirects to frontend
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Authorization code from Google
 *     responses:
 *       '302':
 *         description: Redirect to frontend after successful authentication
 *       '400':
 *         description: Authentication failed
 */
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/");
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's profile information
 *     tags:
 *       - Authentication
 *     security:
 *       - oauth2: []
 *     responses:
 *       '200':
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       '401':
 *         description: Unauthorized - user not authenticated
 */
router.get("/me", authMiddleware, async (req: any, res: Response) => {
  console.log("Fetching user profile for user ID:", req.user);
  const user = await getUserById(req.user.id);
  return res.json({ user });
});

export default router;

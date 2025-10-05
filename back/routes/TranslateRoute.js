import express from "express";
import { translateText } from "../Controllers/TranslateController";
const { verifyToken } = require('../Middelwares/verifyToken');
const router = express.Router();

// POST /api/translate
router.post("/", verifyToken, translateText);

export default router;

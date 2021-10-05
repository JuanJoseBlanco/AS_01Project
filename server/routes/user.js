import express from "express";
const router = express.Router();

import { signin, signup, logout } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/logout/:user", logout);

export default router;
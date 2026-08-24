import { Router } from "express";

const profileRouterPublic = Router();

//Get Profile
profileRouterPublic.get('/', (_req, res) => {
    res.json({ message: "Get profile" });
});

export default profileRouterPublic;

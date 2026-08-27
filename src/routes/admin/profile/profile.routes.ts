import { Router } from "express";

const profileRouter = Router();

//Get Profile
profileRouter.get('/', (_req, res) => {
    res.json({ message: "Get profile" });
});

//Update Profile
profileRouter.patch('/', (_req, res) => {
    res.json({ message: "Update profile" });
});

export default profileRouter;
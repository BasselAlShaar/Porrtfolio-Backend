import { Router } from "express";

const experienceRouterPublic = Router();

//Get All Experiences
experienceRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List experiences" });
});

export default experienceRouterPublic;
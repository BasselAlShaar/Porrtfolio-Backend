import { Router } from "express";

const educationRouterPublic = Router();

//Get All Educations
educationRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List educations" });
});

export default educationRouterPublic;
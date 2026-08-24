import { Router } from "express";

const skillsRouterPublic = Router();

//Get All Skills
skillsRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List skills" });
});

export default skillsRouterPublic;

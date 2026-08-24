import { Router } from "express";

const projectRouterPublic = Router();

//Get All Projects
projectRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List projects" });
});

export default projectRouterPublic;

import { Router } from "express";

const technologyRouterPublic = Router();

//Get All Technologies
technologyRouterPublic.get('/', (_req, res) => {
    res.json({ message: "List technologies" });
});

export default technologyRouterPublic;
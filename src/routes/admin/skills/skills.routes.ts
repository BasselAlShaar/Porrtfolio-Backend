import { Router } from "express";
import skillsCategoryRouter from "./skills_category.routes.js"

const skillRouter = Router();

//Categories
skillRouter.use("/categories", skillsCategoryRouter);

//Create Skill
skillRouter.post("/",(_req, res) => {
    res.status(201).json({ message: "Create skill" });
});

//Get Skill by id
skillRouter.get("/:id",(_req, res) => {
        res.json({ message: "Get skill" });
});

//Update Skill by id
skillRouter.patch("/:id",(_req, res) => {
    res.json({ message: "Update skill" });
});

//Delete Skill by id
skillRouter.delete("/:id",(_req, res) => {
    res.json({ message: "Delete skill" });
});

export default skillRouter;

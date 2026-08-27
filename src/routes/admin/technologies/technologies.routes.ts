import { Router } from "express";

const technologyRouter = Router();

technologyRouter
    .route("/")
    .get((_req, res) => {
        res.json({ message: "List technologies" });
    })
    .post((_req, res) => {
        res.status(201).json({ message: "Create technology" });
    });

technologyRouter
    .route("/:id")
    .get((_req, res) => {
        res.json({ message: "Get technology" });
    })
    .patch((_req, res) => {
        res.json({ message: "Update technology" });
    })
    .delete((_req, res) => {
        res.json({ message: "Delete technology" });
    });

export default technologyRouter;

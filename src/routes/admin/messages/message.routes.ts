import { Router } from "express";

const messageRouter = Router();

//Get All Messages
messageRouter.get('/', (_req, res) => {
    res.json({ message: "List messages" });
});

//Update Message by id
messageRouter.patch('/:id', (_req, res) => {
    res.json({ message: "Update message" });
});

//Delete Message by id
messageRouter.delete('/:id', (_req, res) => {
    res.json({ message: "Delete message" });
});

export default messageRouter;
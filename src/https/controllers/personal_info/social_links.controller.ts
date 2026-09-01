import socialLinksService from "../../services/personal_info/social_links.service.js";

import type { Request, Response, NextFunction } from "express";

//get all
const getAllSocialLinks = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await socialLinksService.getAllSocialLinks();

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//get one
const getSocialLinkById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await socialLinksService.getSocialLinkById(req.params.id);

        if (!result) {
            return res.status(404).json({ message: "Social link not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//create
const createSocialLink = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await socialLinksService.createSocialLink(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

//update
const updateSocialLink = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await socialLinksService.updateSocialLink(req.params.id, req.body);

        if (!result) {
            return res.status(404).json({ message: "Social link not found" });
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

//delete
const deleteSocialLink = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await socialLinksService.deleteSocialLink(req.params.id);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export default {
    getAllSocialLinks,
    getSocialLinkById,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
}
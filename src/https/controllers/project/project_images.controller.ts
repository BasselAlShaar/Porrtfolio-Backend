import type { Request, Response } from "express";

import project_imagesService from "../../services/project/project_images.service.js";

// Get all
const getAllProjectImages = async (
    req: Request<{ slug: string }>,
    res: Response
) => {
    try {
        const projectImages =
            await project_imagesService.getAllProjectImages(
                req.params.slug
            );

        res.status(200).json(projectImages);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Get one
const getById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const projectImage =
            await project_imagesService.getProjectImageById(
                req.params.id
            );

        if (!projectImage) {
            res.status(404).json({
                message: "Project image not found",
            });
            return;
        }

        res.status(200).json(projectImage);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

const getProjectImageFile = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const filePath =
            await project_imagesService.getProjectImageFile(
                req.params.id
            );

        if (!filePath) {
            res.status(404).json({
                message: "Project image not found",
            });

            return;
        }

        res.sendFile(filePath);
    } catch (error) {
        res.status(404).json({
            message: "Image file not found",
        });
    }
};

// Create
const createProjectImage = async (
    req: Request,
    res: Response
) => {
    try {
        const projectImage =
            await project_imagesService.createProjectImage(
                req.file!,
                req.body
            );

        res.status(201).json(projectImage);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Update metadata
const updateProjectImageData = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const projectImage =
            await project_imagesService.updateProjectImageData(
                req.params.id,
                req.body
            );

        if (!projectImage) {
            res.status(404).json({
                message: "Project image not found",
            });
            return;
        }

        res.status(200).json(projectImage);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Replace image
const updateProjectImage = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const projectImage =
            await project_imagesService.updateProjectImage(
                req.params.id,
                req.file!
            );

        if (!projectImage) {
            res.status(404).json({
                message: "Project image not found",
            });
            return;
        }

        res.status(200).json(projectImage);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

// Delete
const deleteProjectImage = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    try {
        const projectImage =
            await project_imagesService.deleteProjectImage(
                req.params.id
            );

        if (!projectImage) {
            res.status(404).json({
                message: "Project image not found",
            });
            return;
        }

        res.status(200).json(projectImage);
    } catch (error) {
        res.status(500).json({
            error: (error as Error).message,
        });
    }
};

export default {
    getAllProjectImages,
    getById,
    getProjectImageFile,
    createProjectImage,
    updateProjectImageData,
    updateProjectImage,
    deleteProjectImage,
};
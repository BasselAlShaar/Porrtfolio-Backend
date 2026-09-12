import personal_infoService from "../../services/personal_info/personal_info.service.js";

import type { Request, Response, NextFunction } from "express";

//get public
const getPersonalInfoPublic = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const personalInfo = await personal_infoService.getPersonalInfoPublic();
        
        res.status(200).json(personalInfo);
    } catch (error) {
        next(error);
    }
};

//get admin
const getPersonalInfo = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const personalInfo = await personal_infoService.getPersonalInfo();
        
        res.status(200).json(personalInfo);
    } catch (error) {
        next(error);
    }
};
//update
const updatePersonalInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const updatedPersonalInfo = await personal_infoService.updatePersonalInfo(req.body);

        res.status(200).json({
            message: "Updated!"
        });
    } catch (error) {
        next(error);
    }
};

//update image
const updatePersonalInfoProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const updatedPersonalInfo = await personal_infoService.updatePersonalInfoProfileImage(req.file!);

        res.status(200).json({
            message: "Updated Image!"
        });
    } catch (error) {
        next(error);
    }
};

//get image
const getImage = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const filePath = await personal_infoService.getImageFile();
        
        if (!filePath) {
            res.status(404).json({
                message: "Image not found",
            });
    
            return;
        }
        
        res.sendFile(filePath);
    } catch (error) {
        next(error);
    }
}



export default {
    getPersonalInfoPublic,
    getPersonalInfo,
    getImage,
    updatePersonalInfo,
    updatePersonalInfoProfileImage
}
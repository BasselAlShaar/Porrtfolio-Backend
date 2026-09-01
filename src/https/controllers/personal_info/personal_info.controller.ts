import personal_infoService from "../../services/personal_info/personal_info.service.js";

import type { Request, Response, NextFunction } from "express";

//get one
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

        res.status(200).json(updatedPersonalInfo);
    } catch (error) {
        next(error);
    }
};

export default {
    getPersonalInfo,
    updatePersonalInfo
}
import type { Request, Response } from "express";

const getSession = (req: Request, res: Response) => {
    if (!req.session.adminAuthenticated) {
        return res.status(401).json({
            message: "Not authenticated",
        });
    }

    return res.status(200).json({
        authenticated: true,
    });
};

export default getSession
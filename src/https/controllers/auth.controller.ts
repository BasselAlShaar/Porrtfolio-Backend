import type { Request, Response } from "express";

import authService from "../services/auth.service.js";

const login = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { password } = req.body;

    const valid = await authService.login(password);

    if (!valid) {
        return res.status(401).json({
            message: "Invalid credentials.",
        });
    }

    req.session.adminAuthenticated = true;

    return res.status(200).json({
        message: "Login successful.",
    });
};

const logout = async (
    req: Request,
    res: Response
): Promise<Response> => {
    return new Promise((resolve) => {
        req.session.destroy((error) => {
            if (error) {
                resolve(
                    res.status(500).json({
                        message: "Failed to logout.",
                    })
                );

                return;
            }

            res.clearCookie("connect.sid");

            resolve(
                res.status(200).json({
                    message: "Logout successful.",
                })
            );
        });
    });
};

export default {
    login,
    logout,
};
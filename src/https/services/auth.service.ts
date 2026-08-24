import argon2 from "argon2";

const login = async (password: string): Promise<boolean> => {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!passwordHash) {
        throw new Error("ADMIN_PASSWORD_HASH is not configured.");
    }

    return argon2.verify(passwordHash, password);
};

export default {
    login,
};
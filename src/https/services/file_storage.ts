import fs from "node:fs/promises";
import path from "node:path";

const MEDIA_ROOT = process.env.MEDIA_ROOT;

if (!MEDIA_ROOT) {
    throw new Error("MEDIA_ROOT environment variable is not defined");
}

const deleteFolder = async (
    folder: string
): Promise<void> => {
    const directory = path.join(MEDIA_ROOT, folder);

    await fs.rm(directory, {
        recursive: true,
        force: true,
    });
};

const saveFile = async (
    buffer: Buffer,
    folder: string,
    filename: string
): Promise<string> => {
    const directory = path.join(MEDIA_ROOT, folder);

    await fs.mkdir(directory, {
        recursive: true,
    });

    const filePath = path.join(directory, filename);

    await fs.writeFile(filePath, buffer);

    return path.join(folder, filename);
};

const deleteFile = async (
    storageKey: string
): Promise<void> => {
    const filePath = path.join(MEDIA_ROOT, storageKey);

    await fs.unlink(filePath);
};

const getFilePath = (
    storageKey: string
): string => {
    return path.join(MEDIA_ROOT, storageKey);
};

export {
    saveFile,
    deleteFile,
    getFilePath,
    deleteFolder
};
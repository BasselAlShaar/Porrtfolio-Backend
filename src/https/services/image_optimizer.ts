import sharp from "sharp";

export interface OptimizedImage {
    buffer: Buffer;
    width: number;
    height: number;
    format: "webp";
}

const optimizeImage = async (
    input: Buffer,
    maxWidth = 1920,
    maxHeight = 1920
): Promise<OptimizedImage> => {
    const image = sharp(input);

    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
        throw new Error("Unable to determine image dimensions");
    }

    const buffer = await image
        .rotate()
        .resize({
            width: maxWidth,
            height: maxHeight,
            fit: "inside",
            withoutEnlargement: true,
        })
        .webp({
            quality: 82,
        })
        .toBuffer();

    const optimizedMetadata = await sharp(buffer).metadata();

    return {
        buffer,
        width: optimizedMetadata.width!,
        height: optimizedMetadata.height!,
        format: "webp",
    };
};

export default optimizeImage;
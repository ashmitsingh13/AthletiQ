export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function getCroppedImg(
  imageSrc: string,
  crop: CropArea
): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return reject("Canvas not supported");

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };

    image.onerror = () => reject("Failed to load image");
  });
}

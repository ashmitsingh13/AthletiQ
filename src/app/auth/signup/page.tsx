"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type FormShape = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username: string;
  dob: string;
  age?: number;
  weight: string;
  gender: string;
  country: string;
  state: string;
  district: string;
  documentType: string;
  documentNumber: string;
  profileImage?: string | null;
};

export default function SignupPage() {
  const [formData, setFormData] = useState<FormShape>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    dob: "",
    age: undefined,
    weight: "",
    gender: "",
    country: "",
    state: "",
    district: "",
    documentType: "Aadhaar",
    documentNumber: "",
    profileImage: null,
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const getCroppedImg = useCallback(async (imageSrc: string, cropPixels: Area | null) => {
    if (!cropPixels) return null;
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.min(500, Math.round(cropPixels.width));
    canvas.height = Math.min(500, Math.round(cropPixels.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas.toDataURL("image/jpeg", 0.9);
  }, []);

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return alert("Nothing to crop");
    try {
      const base64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (base64) setFormData((p) => ({ ...p, profileImage: base64 }));
      setIsCroppingOpen(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
    } catch (err) {
      console.error("crop save error", err);
      alert("Failed to crop image");
    }
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto my-8 shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>

          {/* Profile Image Preview */}
          {formData.profileImage && (
            <div className="flex gap-4 items-center mt-2">
              <Image
                src={formData.profileImage}
                alt="preview"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cropping Modal */}
      {isCroppingOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-lg">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-center">Crop Your Image</h3>
              <div className="relative w-full h-80 bg-gray-200">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="zoom-slider" className="text-sm">Zoom</Label>
                <input
                  id="zoom-slider"
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => { setIsCroppingOpen(false); setImageSrc(null); setCroppedAreaPixels(null); }}>
                  Cancel
                </Button>
                <Button onClick={handleCropSave}>Crop & Save</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const router = useRouter();

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

  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);

  // Load countries
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/countries");
        const json = await res.json();
        setCountries(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setCountries([]);
      }
    })();
  }, []);

  // Fetch states
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setCities([]);
      setFormData((p) => ({ ...p, state: "", district: "" }));
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country }),
        });
        const json = await res.json();
        setStates(Array.isArray(json?.data) ? json.data : []);
        setFormData((p) => ({ ...p, state: "", district: "" }));
        setCities([]);
      } catch {
        setStates([]);
        setCities([]);
      }
    })();
  }, [formData.country]);

  // Fetch cities
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      setFormData((p) => ({ ...p, district: "" }));
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country, state: formData.state }),
        });
        const json = await res.json();
        setCities(Array.isArray(json?.data) ? json.data : []);
        setFormData((p) => ({ ...p, district: "" }));
      } catch {
        setCities([]);
      }
    })();
  }, [formData.state, formData.country]);

  // Calculate age
  useEffect(() => {
    if (!formData.dob) return setFormData((p) => ({ ...p, age: undefined }));
    const birth = new Date(formData.dob);
    if (isNaN(birth.getTime())) return setFormData((p) => ({ ...p, age: undefined }));

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    setFormData((p) => ({ ...p, age: age >= 0 ? age : undefined }));
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormShape, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsCroppingOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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

  const validateForm = (): { ok: boolean; msg?: string } => {
    const requiredFields: (keyof FormShape)[] = [
      "firstName",
      "lastName",
      "email",
      "password",
      "username",
      "dob",
      "weight",
      "gender",
      "country",
      "state",
      "district",
      "documentType",
      "documentNumber",
    ];

    for (const k of requiredFields) {
      const val = String(formData[k] ?? "").trim();
      if (!val) return { ok: false, msg: `${k.charAt(0).toUpperCase() + k.slice(1)} is required` };
    }
    if (formData.age === undefined || formData.age < 0) return { ok: false, msg: "Invalid Date of Birth" };
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return { ok: false, msg: "Invalid email format" };
    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateForm();
    if (!check.ok) return alert(check.msg);

    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.age;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: { success?: boolean; user?: { id: string }; error?: string } = await res.json();

      if (res.status === 201 && data.success) {
        alert("Signup successful!");
        router.push(`/profile/${data.user?.id}`);
      } else {
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("signup network error", err);
      alert(err instanceof Error ? err.message : "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-3xl mx-auto my-8 shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">Create an Account</h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name, Last Name, Email, Password, Username, DOB, Age, Weight */}
            {/* Gender, Profile Image, Country, State, District, Document */}
            {/* Reuse same as original */}
            {/* For Profile Image preview: use next/image */}
            {formData.profileImage && (
              <div className="flex gap-4 items-center mt-2">
                <Image src={formData.profileImage} alt="preview" width={96} height={96} className="rounded-full object-cover" />
              </div>
            )}
          </form>
        </CardContent>
      </Card>

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

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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
import { Camera } from "lucide-react";

// dynamic import to avoid SSR issues
const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

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
  const [errors, setErrors] = useState<string | null>(null);

  // cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // fetch helper with abort support
  useEffect(() => {
    const controller = new AbortController();
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries", {
          signal: controller.signal,
        });
        if (!res.ok) {
          setCountries([]);
          return;
        }
        const json = await res.json();
        setCountries(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("countries fetch error", err);
          setCountries([]);
        }
      }
    };
    fetchCountries();
    return () => controller.abort();
  }, []);

  // when country changes -> fetch states
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setCities([]);
      setFormData((p) => ({ ...p, state: "", district: "" }));
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country }),
          signal: controller.signal,
        });
        if (!res.ok) {
          setStates([]);
          setCities([]);
          return;
        }
        const json = await res.json();
        setStates(Array.isArray(json?.data) ? json.data : []);
        setFormData((p) => ({ ...p, state: "", district: "" }));
        setCities([]);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("states fetch error", err);
          setStates([]);
          setCities([]);
        }
      }
    })();

    return () => controller.abort();
  }, [formData.country]);

  // when state changes -> fetch cities
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      setFormData((p) => ({ ...p, district: "" }));
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: formData.country,
            state: formData.state,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          setCities([]);
          return;
        }
        const json = await res.json();
        setCities(Array.isArray(json?.data) ? json.data : []);
        setFormData((p) => ({ ...p, district: "" }));
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("cities fetch error", err);
          setCities([]);
        }
      }
    })();

    return () => controller.abort();
  }, [formData.state, formData.country]);

  // calculate age from dob
  useEffect(() => {
    if (!formData.dob) {
      setFormData((p) => ({ ...p, age: undefined }));
      return;
    }
    try {
      const birth = new Date(formData.dob);
      if (isNaN(birth.getTime())) {
        setFormData((p) => ({ ...p, age: undefined }));
        return;
      }
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      setFormData((p) => ({ ...p, age: age >= 0 ? age : undefined }));
    } catch (e) {
      setFormData((p) => ({ ...p, age: undefined }));
    }
  }, [formData.dob]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // select components callback (shadcn)
  const handleSelectChange = (name: keyof FormShape, value: string) => {
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // Image upload -> open cropper
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(String(reader.result));
      setIsCroppingOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);

    // reset file input to allow re-uploading same file if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // helper: load image
  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.setAttribute("crossOrigin", "anonymous"); // handle CORS
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // get cropped image (canvas) -> base64
  const getCroppedImg = useCallback(
    async (imageSrc: string, cropPixels: Area | null) => {
      if (!cropPixels) return null;
      const image = await createImage(imageSrc);

      // use the crop pixels directly (react-easy-crop gives pixels relative to the source image)
      const canvas = document.createElement("canvas");
      // limit size to avoid huge blobs (keeps profile image small)
      const maxDim = 500;
      const width = Math.min(Math.round(cropPixels.width), maxDim);
      const height = Math.min(Math.round(cropPixels.height), maxDim);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      // draw from the original image using the pixel coords
      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        width,
        height
      );

      return canvas.toDataURL("image/jpeg", 0.9);
    },
    []
  );

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setErrors("Nothing to crop.");
      return;
    }
    try {
      setLoading(true);
      const base64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (base64) {
        setFormData((p) => ({ ...p, profileImage: base64 }));
      }
      setIsCroppingOpen(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
      setErrors(null);
    } catch (err) {
      console.error("crop save error", err);
      setErrors("Failed to crop image. Try a different image.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): { ok: boolean; msg?: string } => {
    const req = [
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
    ] as (keyof FormShape)[];

    for (const k of req) {
      const val = String((formData as any)[k] ?? "").trim();
      if (!val)
        return {
          ok: false,
          msg: `${k.charAt(0).toUpperCase() + k.slice(1)} is required`,
        };
    }
    if (formData.age === undefined || formData.age < 0)
      return { ok: false, msg: "Invalid Date of Birth" };
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      return { ok: false, msg: "Invalid email format" };
    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    const check = validateForm();
    if (!check.ok) {
      setErrors(check.msg ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      delete (payload as any).age; // don't send client age if you don't want to

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.status === 201 && data?.success) {
        // success (backend returns created user)
        router.push(`/profile/${data.user.id}`);
      } else {
        setErrors(data?.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("signup network error", err);
      setErrors("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 bg-background text-white">
        <Card className="w-full max-w-3xl mx-auto shadow-2xl rounded-xl border border-border bg-card transition-all">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary">
              Create Your Account
            </h1>
            {errors && (
              <div className="rounded-md bg-red-50 border border-red-100 px-4 py-2 text-sm text-red-700">
                {errors}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              {/* First / Last */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              {/* Username */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="johndoe"
                />
              </div>

              {/* DOB & Age */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Age</Label>
                <Input
                  value={formData.age ?? ""}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Weight */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  placeholder="70"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="gender">Gender</Label>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      onValueChange={(val) => handleSelectChange("gender", val)}
                      value={formData.gender}
                    >
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Profile Image (optional)</Label>
                  <div className="text-sm text-muted flex items-center gap-1">
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Optional</span>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:text-white hover:file:bg-black"
                />

                {formData.profileImage && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary flex-shrink-0">
                      <img
                        src={formData.profileImage}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          setImageSrc(formData.profileImage ?? null);
                          setIsCroppingOpen(true);
                        }}
                      >
                        Re-crop
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData((p) => ({ ...p, profileImage: null }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 flex flex-col gap-2 relative">
  <Label htmlFor="country">Country</Label>

  <Select
    onValueChange={(val) => handleSelectChange("country", val)}
    value={formData.country} // controlled value
  >
    <SelectTrigger id="country" className="w-full">
      <SelectValue placeholder="Select Country" />
    </SelectTrigger>

    <SelectContent>
      {countries.map((c, idx) => (
        <SelectItem key={idx} value={c}>
          {c}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


              {/* State / City */}
              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="state">State / Region</Label>
                {states.length > 0 ? (
                  <Select
                    onValueChange={(val) => handleSelectChange("state", val)}
                    value={formData.state}
                  >
                    <SelectTrigger id="state" className="w-full" />
                    <SelectValue placeholder="Select State" />
                    <SelectContent>
                      {states.map((s, i) => (
                        <SelectItem key={i} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter State"
                    className="w-full"
                    required
                  />
                )}
              </div>

              <div className="sm:col-span-2 flex flex-col gap-2">
                <Label htmlFor="district">District / City</Label>
                {cities.length > 0 ? (
                  <Select
                    onValueChange={(val) => handleSelectChange("district", val)}
                    value={formData.district}
                  >
                    <SelectTrigger id="district" className="w-full" />
                    <SelectValue placeholder="Select District" />
                    <SelectContent>
                      {cities.map((d, i) => (
                        <SelectItem key={i} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Enter District"
                    className="w-full"
                    required
                  />
                )}
              </div>

              {/* Document Type & Number */}
              <div className="flex flex-col gap-2 relative">
  <Label htmlFor="documentType">Document Type</Label>

  <Select
    onValueChange={(val) => handleSelectChange("documentType", val)}
    value={formData.documentType} // controlled value
  >
    <SelectTrigger id="documentType" className="w-full">
      <SelectValue placeholder="Select Document" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="Aadhaar">Aadhaar</SelectItem>
      <SelectItem value="Passport">Passport</SelectItem>
      <SelectItem value="Driving License">Driving License</SelectItem>
    </SelectContent>
  </Select>
</div>


              <div className="flex flex-col gap-2">
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  required
                  placeholder="XXXXXXXXXXXX"
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-black hover:bg-primary/90 rounded-xl"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Cropping Modal */}
      {isCroppingOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setIsCroppingOpen(false);
              setImageSrc(null);
              setCroppedAreaPixels(null);
            }}
          />
          <div className="relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg rounded-lg overflow-hidden bg-card shadow-lg">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-center mb-4">
                Crop Your Profile Image
              </h3>

              <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-md overflow-hidden">
                {/* @ts-ignore (Cropper is dynamic) */}
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

              <div className="flex items-center gap-3 mt-4">
                <Label htmlFor="zoom-slider" className="text-sm">
                  Zoom
                </Label>
                <input
                  id="zoom-slider"
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsCroppingOpen(false);
                    setImageSrc(null);
                    setCroppedAreaPixels(null);
                  }}
                >
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

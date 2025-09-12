"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCroppingOpen, setIsCroppingOpen] = useState(false);

  // load countries from our backend
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("/api/countries");
        const json = await res.json();
        setCountries(Array.isArray(json?.data) ? json.data : []);
      } catch (err) {
        console.error("countries fetch error", err);
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  // when country changes -> fetch states from backend
  useEffect(() => {
    if (!formData.country) {
      setStates([]);
      setCities([]);
      setFormData((p) => ({ ...p, state: "", district: "" }));
      return;
    }
    const fetchStates = async () => {
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
      } catch (err) {
        console.error("states fetch error", err);
        setStates([]);
        setCities([]);
      }
    };
    fetchStates();
  }, [formData.country]);

  // when state changes -> fetch cities
  useEffect(() => {
    if (!formData.country || !formData.state) {
      setCities([]);
      setFormData((p) => ({ ...p, district: "" }));
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: formData.country, state: formData.state }),
        });
        const json = await res.json();
        setCities(Array.isArray(json?.data) ? json.data : []);
        setFormData((p) => ({ ...p, district: "" }));
      } catch (err) {
        console.error("cities fetch error", err);
        setCities([]);
      }
    };
    fetchCities();
  }, [formData.state, formData.country]);

  // calculate age from dob on client so user sees it
  useEffect(() => {
    if (!formData.dob) {
      setFormData((p) => ({ ...p, age: undefined }));
      return;
    }
    try {
        const birth = new Date(formData.dob);
        if (isNaN(birth.getTime())) {
            setFormData(p => ({...p, age: undefined}));
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
        setFormData(p => ({...p, age: undefined}));
    }
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setImageSrc(reader.result as string);
      setIsCroppingOpen(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // create cropped image base64
  const getCroppedImg = useCallback(async (imageSrc: string, cropPixels: Area | null) => {
    if (!cropPixels) return null;
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = imageSrc;
    });

    const canvas = document.createElement("canvas");
    canvas.width = Math.min(500, Math.round(cropPixels.width)); // Max width 500px
    canvas.height = Math.min(500, Math.round(cropPixels.height)); // Max height 500px
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
    if (!imageSrc || !croppedAreaPixels) {
      alert("Nothing to crop");
      return;
    }
    try {
      const base64 = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (base64) {
        setFormData((p) => ({ ...p, profileImage: base64 }));
      }
      setIsCroppingOpen(false);
      setImageSrc(null);
      setCroppedAreaPixels(null);
    } catch (err) {
      console.error("crop save error", err);
      alert("Failed to crop image");
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
      if (!val) return { ok: false, msg: `${k.charAt(0).toUpperCase() + k.slice(1)} is required` };
    }
    if (formData.age === undefined || formData.age < 0) return { ok: false, msg: "Invalid Date of Birth" };
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return { ok: false, msg: "Invalid email format" };
    return { ok: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateForm();
    if (!check.ok) {
      alert(check.msg);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };
      delete payload.age; // Don't send client-calculated age to backend

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      // Check for success (201 Created)
      if (res.status === 201 && data.success) {
        alert("Signup successful!");
        router.push(`/profile/${data.user.id}`);
      } else {
        // Use the 'error' field from the backend response
        alert(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("signup network error", err);
      alert("An unexpected network error occurred.");
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
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div>
              <Label>Age</Label>
              <Input value={formData.age ?? ""} readOnly disabled />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(val) => handleSelectChange("gender", val)} value={formData.gender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
               <Label>Profile Image (optional)</Label>
               <Input type="file" accept="image/*" onChange={handleImageUpload} className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
               {formData.profileImage && (
                 <div className="flex gap-4 items-center mt-2">
                   <img src={formData.profileImage} alt="preview" className="w-24 h-24 object-cover rounded-full" />
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
                     <Button type="button" variant="ghost" size="sm" onClick={() => setFormData((p) => ({ ...p, profileImage: null }))}>
                       Remove
                     </Button>
                   </div>
                 </div>
               )}
             </div>

            <div className="md:col-span-2">
              <Label htmlFor="country">Country</Label>
              <Select onValueChange={(val) => handleSelectChange("country", val)} value={formData.country}>
                <SelectTrigger id="country">
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

            <div className="md:col-span-2">
              <Label htmlFor="state">State / Region</Label>
              {states.length > 0 ? (
                 <Select onValueChange={(val) => handleSelectChange("state", val)} value={formData.state}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select State"/>
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s, i) => (
                        <SelectItem key={i} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              ) : (
                <Input name="state" value={formData.state} onChange={handleChange} placeholder="Enter state" required />
              )}
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="district">District / City</Label>
              {cities.length > 0 ? (
                <Select onValueChange={(val) => handleSelectChange("district", val)} value={formData.district}>
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((d, i) => (
                      <SelectItem key={i} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input name="district" value={formData.district} onChange={handleChange} placeholder="Enter district/city" required />
              )}
            </div>

            <div>
              <Label htmlFor="documentType">Document Type</Label>
               <Select onValueChange={(val) => handleSelectChange("documentType", val)} value={formData.documentType}>
                 <SelectTrigger id="documentType">
                   <SelectValue placeholder="Select Document" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                   <SelectItem value="Passport">Passport</SelectItem>
                   <SelectItem value="Driving License">Driving License</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            <div>
              <Label htmlFor="documentNumber">Document Number</Label>
              <Input id="documentNumber" name="documentNumber" value={formData.documentNumber} onChange={handleChange} required />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Signup"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* cropping modal */}
      {isCroppingOpen && imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-lg">
            <div className="p-4 space-y-4">
              <h3 className="text-lg font-semibold text-center">Crop Your Image</h3>
              <div className="relative w-full h-80 bg-gray-200">
                <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} cropShape="round" showGrid={false}/>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="zoom-slider" className="text-sm">Zoom</Label>
                <input id="zoom-slider" type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
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

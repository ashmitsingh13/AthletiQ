"use client";
import { useAuth } from "@/context/AuthContext";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertTriangle, Video } from "lucide-react";
import Link from "next/link";

type ExerciseId = "situps" | "vertical_jump" | "shuttle_run" | "endurance_run";
const TEST_ORDER: ExerciseId[] = [
  "situps",
  "vertical_jump",
  "shuttle_run",
  "endurance_run",
];
const MAX_VIDEO_SECONDS = 60;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface AnalysisResult {
  exercise: string;
  score: number;
  feedback: string[];
  corrections: string[];
  reps?: number;
  jumpHeightCm?: number;
  jumpDisplacementNorm?: number;
  turns?: number;
  splitTimes?: number[];
  cadence?: number;
  trunkAngleAvg?: number;
  trunkAngleMin?: number;
  trunkAngleMax?: number;
  distanceKm?: number;
  durationSec?: number;
  paceMinPerKm?: number;
}

export default function AnnexureFlow() {
  // ---- basic UI / flow state ----
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseId>(
    TEST_ORDER[0]
  );

  // recording/upload
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [recording, setRecording] = useState(false);

  // analysis & results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  // Cloudinary upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  // GPS endurance
  const [isTracking, setIsTracking] = useState(false);
  const watchRef = useRef<number | null>(null);
  const coordsRef = useRef<{ lat: number; lng: number; time: number }[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // video + overlay refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // athleteId (required by server)
  const [athleteId, setAthleteId] = useState<string | null>(null);

  // useAuth context — recommended single source of truth for logged-in user
  const { user: authUser, refreshUser, isAuthenticated } = useAuth();

  useEffect(() => {
    setSelectedExercise(TEST_ORDER[currentStepIndex]);
  }, [currentStepIndex]);

  // Use auth context to populate athleteId. If context hasn't loaded yet, call refreshUser once.
  useEffect(() => {
    if (authUser && (authUser as any)._id) {
      setAthleteId(String((authUser as any)._id));
      return;
    }

    // fallback: attempt one refresh (AuthProvider might still be fetching)
    let mounted = true;
    (async () => {
      try {
        const u = await refreshUser();
        if (mounted && u && (u as any)._id) setAthleteId(String((u as any)._id));
      } catch (e) {
        console.error("Auth refresh fallback failed:", e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authUser, refreshUser, isAuthenticated]);

  // Video source management
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (mediaStream) {
      videoEl.srcObject = mediaStream;
      videoEl.muted = true;
      videoEl.play().catch(console.error);
    } else if (videoUrl) {
      videoEl.srcObject = null;
      videoEl.src = videoUrl;
      videoEl.muted = false;
      videoEl.play().catch(console.error);
    } else {
      videoEl.srcObject = null;
      videoEl.removeAttribute("src");
      videoEl.load();
    }
  }, [mediaStream, videoUrl]);

  useEffect(() => {
    return () => {
      if (videoUrl && videoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const clearVideoSource = () => {
    if (videoUrl && videoUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoUrl);
    }
    setRecordedBlob(null);
    setUploadedFile(null);
    setVideoUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      setMediaStream(stream);
      clearVideoSource();

      const options: MediaRecorderOptions = {
        mimeType: "video/webm;codecs=vp8",
      };
      const mr = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        setVideoUrl(URL.createObjectURL(blob));

        stream.getTracks().forEach((t) => t.stop());
        setMediaStream(null);
        setRecorder(null);
        setRecording(false);
      };

      mr.start();
      setRecorder(mr);
      setRecording(true);

      setTimeout(() => {
        if (mr && mr.state === "recording") mr.stop();
      }, MAX_VIDEO_SECONDS * 1000);
    } catch (err) {
      console.error("startRecording error:", err);
      alert("Camera access error. Please ensure you have given permission.");
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state === "recording") recorder.stop();
    setRecording(false);
  };

  // FILE UPLOAD (local selection)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    clearVideoSource();
    setUploadedFile(f);
    setRecordedBlob(null);
    setVideoUrl(URL.createObjectURL(f));
  };

  // Haversine for GPS
  const haversineKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // START GPS RUN
  const startRun = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not available.");
      return;
    }
    coordsRef.current = [];
    setDistanceKm(0);
    setDurationSec(0);
    setAnalysisResult(null);

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const t = Date.now();
        const prev = coordsRef.current[coordsRef.current.length - 1];
        coordsRef.current.push({ lat, lng, time: t });
        if (prev) {
          const d = haversineKm(prev.lat, prev.lng, lat, lng);
          setDistanceKm((p) => +(p + d).toFixed(4));
        }
      },
      (err) => {
        console.error("GPS error", err);
        alert("GPS error: " + err.message);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );

    watchRef.current = id;
    setIsTracking(true);
    timerRef.current = setInterval(() => setDurationSec((s) => s + 1), 1000);
  };

  // STOP GPS RUN
  const stopRun = async () => {
    if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTracking(false);

    const dist = distanceKm;
    const dur = durationSec;
    const pace = dist > 0 ? dur / 60 / dist : 0;

    let score = 60;
    if (pace > 0) {
      if (pace <= 4) score = 95;
      else if (pace <= 5) score = 85;
      else if (pace <= 6) score = 75;
      else score = Math.max(40, 60 - (pace - 6) * 5);
    }

    const feedback: string[] = [];
    const corrections: string[] = [];
    if (dist >= 3) feedback.push(`Distance: ${dist.toFixed(2)} km`);
    else corrections.push(`Short distance: ${dist.toFixed(2)} km`);

    if (pace <= 5) feedback.push(`Pace: ${pace.toFixed(2)} min/km`);
    else corrections.push(`Pace: ${pace.toFixed(2)} min/km — improve pacing.`);

    const res: AnalysisResult = {
      exercise: "endurance_run",
      score,
      feedback,
      corrections,
      distanceKm: +dist.toFixed(3),
      durationSec: dur,
      paceMinPerKm: +(pace || 0),
    };

    setAnalysisResult(res);

    // submit metadata (no video)
    await submitMetadataAndVideo(res, null);
    advanceStep();
  };

  // CLOUDINARY unsigned upload (client) using Fetch API
  const uploadToCloudinary = async (file: File) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        "Missing Cloudinary config (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)."
      );
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    if (process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER) {
      formData.append(
        "folder",
        String(process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER)
      );
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Cloudinary upload failed: ${res.status} ${res.statusText} — ${text}`
        );
      }

      const data = await res.json();
      return {
        secure_url: data.secure_url,
        public_id: data.public_id,
        raw: data,
      };
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  // SUBMIT metadata + videoUrl to server (/api/submit)
  const submitMetadataAndVideo = async (
    metadata: AnalysisResult,
    videoBlob: Blob | null
  ) => {
    // defensive: ensure athleteId
    if (!athleteId) {
      alert(
        "Missing athlete ID. Please login or ensure your user session is active."
      );
      console.error("submit aborted: missing athleteId");
      return null;
    }

    try {
      let videoUrlToSend = "";
      if (videoBlob) {
        setUploadProgress(1);
        const file =
          videoBlob instanceof File
            ? videoBlob
            : new File(
                [videoBlob],
                `video-${metadata.exercise}-${Date.now()}.webm`,
                { type: "video/webm" }
              );
        const cloudRes = await uploadToCloudinary(file);
        videoUrlToSend = cloudRes.secure_url;
        setUploadProgress(100);
      }

      const payload = { metadata, videoUrl: videoUrlToSend, athleteId };

      const res = await fetch("/api/submit", {
        method: "POST",
        credentials: "include", // ensure session cookie is sent
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("server error response:", data);
        throw new Error(data?.error || "Server save failed");
      }
      return data.result;
    } catch (err) {
      console.error("submitMetadataAndVideo error:", err);
      alert("Failed to save result. See console for details.");
      return null;
    } finally {
      setUploadProgress(0);
    }
  };

  // RUN analysis and submit for video-based tests:
  const runAnalyzeAndSubmit = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const source = recordedBlob ?? uploadedFile ?? null;
    if (!source) {
      alert("Please record or upload a video first.");
      setIsAnalyzing(false);
      return;
    }

    const metadataOk = await checkVideoDurationWithinLimit(
      source,
      MAX_VIDEO_SECONDS
    );
    if (!metadataOk) {
      setIsAnalyzing(false);
      return;
    }

    try {
      const res = await analyzeVideoFrontend(source as Blob);
      setAnalysisResult(res);

      await submitMetadataAndVideo(res, source as Blob);

      alert("Analysis complete and results saved successfully!");
      advanceStep();
    } catch (err) {
      console.error("analysis error:", err);
      alert("Analysis failed. Please try again. See console for details.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const checkVideoDurationWithinLimit = (blob: Blob, maxSeconds: number) => {
    return new Promise<boolean>((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      const url = URL.createObjectURL(blob);
      video.src = url;

      video.onloadedmetadata = () => {
        const dur = video.duration || 0;
        URL.revokeObjectURL(url);
        if (dur > maxSeconds) {
          alert(
            `Video is too long (${Math.round(
              dur
            )}s). Maximum duration is ${maxSeconds}s.`
          );
          resolve(false);
        } else resolve(true);
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        alert("Could not read video metadata. The file may be corrupt.");
        resolve(false);
      };
    });
  };

  // MEDIA PIPE analysis function (kept mostly same as your original, but minimal tuning)
  const analyzeVideoFrontend = async (blob: Blob): Promise<AnalysisResult> => {
    const mpPose = await import("@mediapipe/pose");
    const mpDraw = await import("@mediapipe/drawing_utils");
    const { Pose } = mpPose;

    const pose = new Pose({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const v = videoRef.current!;
    const overlay = overlayRef.current!;
    const ctx = overlay.getContext("2d")!;

    // internal metrics:
    const hipYs: number[] = [];
    const timestamps: number[] = [];
    const trunkAngles: number[] = [];
    const turnTimestamps: number[] = [];
    const baselineSamples: number[] = [];
    let sitReps = 0;
    let inUp = false;
    let lastHipX = NaN;
    let lastDirection = 0;
    let baselineMeasured = false;
    const baselineSampleDuration = 0.8;

    function angleBetween(ax:number, ay:number, bx:number, by:number, cx:number, cy:number) {
      const v1x = ax - bx, v1y = ay - by;
      const v2x = cx - bx, v2y = cy - by;
      const dot = v1x * v2x + v1y * v2y;
      const mag1 = Math.hypot(v1x, v1y), mag2 = Math.hypot(v2x, v2y);
      if (mag1 === 0 || mag2 === 0) return 0;
      const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
      return (Math.acos(cos) * 180) / Math.PI;
    }

    pose.onResults((results: any) => {
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      if (!results.poseLandmarks) return;
      try {
        mpDraw.drawConnectors(ctx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
        mpDraw.drawLandmarks(ctx, results.poseLandmarks, { color: "#FF0000", lineWidth: 1 });
      } catch (e) {
        console.error("draw error:", e);
      }

      const lm = results.poseLandmarks;
      const leftShoulder = lm[11], rightShoulder = lm[12];
      const leftHip = lm[23], rightHip = lm[24];
      const leftKnee = lm[25], rightKnee = lm[26];

      if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) return;

      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const hipX = (leftHip.x + rightHip.x) / 2;
      hipYs.push(hipY);
      timestamps.push(v.currentTime);

      const trunkAngle = angleBetween(
        (leftShoulder.x + rightShoulder.x) / 2,
        shoulderY,
        hipX,
        hipY,
        (leftKnee.x + rightKnee.x) / 2,
        (leftKnee.y + rightKnee.y) / 2
      );
      trunkAngles.push(trunkAngle);

      if (selectedExercise === "situps") {
        const diff = shoulderY - hipY;
        if (diff < -0.16 && !inUp) inUp = true;
        if (diff > -0.06 && inUp) {
          sitReps++;
          inUp = false;
        }
      }

      if (selectedExercise === "shuttle_run") {
        if (!isNaN(lastHipX)) {
          const dx = hipX - lastHipX;
          const dir = dx > 0.001 ? 1 : dx < -0.001 ? -1 : lastDirection;
          if (dir !== lastDirection && lastDirection !== 0) turnTimestamps.push(v.currentTime);
          lastDirection = dir;
        } else lastDirection = 0;
        lastHipX = hipX;
      }

      if (!baselineMeasured && v.currentTime <= baselineSampleDuration) baselineSamples.push(hipY);
      else if (!baselineMeasured) baselineMeasured = true;
    });

    // run pose on video frames
    await new Promise<void>((resolve) => {
      const onLoaded = () => {
        overlay.width = v.videoWidth;
        overlay.height = v.videoHeight;

        v.currentTime = 0;
        v.play().catch(console.error);

        let rafId = 0;
        const tick = async () => {
          if (v.paused || v.ended || v.currentTime >= MAX_VIDEO_SECONDS) {
            cancelAnimationFrame(rafId);
            resolve();
            return;
          }
          await pose.send({ image: v });
          rafId = requestAnimationFrame(tick);
        };
        tick();
      };

      if (v.readyState >= 2) onLoaded();
      else v.addEventListener("loadedmetadata", onLoaded, { once: true });
      v.addEventListener("ended", () => resolve(), { once: true });
    });

    pose.close();

    const trunkAvg = trunkAngles.reduce((s, v) => s + v, 0) / Math.max(1, trunkAngles.length);
    const trunkMin = Math.min(...(trunkAngles.length ? trunkAngles : [0]));
    const trunkMax = Math.max(...(trunkAngles.length ? trunkAngles : [0]));

    const median = (arr:number[]) => {
      if (!arr.length) return 0;
      const s = [...arr].sort((a,b)=>a-b);
      const m = Math.floor(s.length/2);
      return s.length%2 ? s[m] : (s[m-1]+s[m]) / 2;
    };

    if (selectedExercise === "situps") {
      const reps = sitReps;
      const angleStd = Math.sqrt(trunkAngles.reduce((s,v)=>s+(v-trunkAvg)**2,0) / Math.max(1, trunkAngles.length));
      const repsScore = Math.min(40, reps);
      const stabilityBonus = Math.max(0, 20 - angleStd);
      const finalScore = Math.round(Math.max(0, Math.min(100, 40 + repsScore + stabilityBonus)));
      const feedback:string[] = [];
      const corrections:string[] = [];
      if (reps >= 30) feedback.push("Great rep volume");
      else if (reps >= 15) feedback.push("Moderate reps");
      else corrections.push("Increase reps and control");
      if (angleStd < 12) feedback.push("Consistent trunk movement");
      else corrections.push("Improve trunk stability");
      return {
        exercise: "situps",
        score: finalScore,
        feedback,
        corrections,
        reps,
        trunkAngleAvg: Math.round(trunkAvg * 10) / 10,
        trunkAngleMin: Math.round(trunkMin * 10) / 10,
        trunkAngleMax: Math.round(trunkMax * 10) / 10,
      } as AnalysisResult;
    }

    if (selectedExercise === "vertical_jump") {
      const baseline = baselineSamples.length ? median(baselineSamples) : median(hipYs.slice(0, Math.min(10, hipYs.length)));
      const minHip = Math.min(...(hipYs.length ? hipYs : [baseline]));
      const displacement = baseline - minHip;
      const approxJumpCm = Math.round(displacement * 170);
      const dispScore = Math.min(40, Math.round(displacement * 200));
      const angleStd = trunkAngles.length ? Math.sqrt(trunkAngles.reduce((s,v)=>s+(v-trunkAvg)**2,0) / trunkAngles.length) : 0;
      const stabilityBonus = Math.max(0, 20 - angleStd);
      const finalScore = Math.round(Math.max(0, Math.min(100, 40 + dispScore + stabilityBonus)));
      const feedback:string[] = [];
      const corrections:string[] = [];
      if (displacement < 0.01) corrections.push("Low displacement; check camera framing.");
      else feedback.push(`Displacement detected: ${Math.round(displacement * 1000) / 1000}`);
      if (approxJumpCm >= 40) feedback.push(`~${approxJumpCm} cm`);
      else corrections.push("Work on jump power and arm swing");
      return {
        exercise: "vertical_jump",
        score: finalScore,
        feedback,
        corrections,
        jumpDisplacementNorm: Math.round(displacement * 1000) / 1000,
        jumpHeightCm: approxJumpCm,
        trunkAngleAvg: Math.round(trunkAvg * 10) / 10,
        trunkAngleMin: Math.round(trunkMin * 10) / 10,
        trunkAngleMax: Math.round(trunkMax * 10) / 10,
      } as AnalysisResult;
    }

    if (selectedExercise === "shuttle_run") {
      const turns = turnTimestamps.length;
      const splitTimes:number[] = [];
      for (let i = 1; i < turnTimestamps.length; i++) splitTimes.push(Math.max(0, turnTimestamps[i] - turnTimestamps[i - 1]));
      if (turnTimestamps.length > 0) {
        splitTimes.unshift(Math.max(0, turnTimestamps[0] - (timestamps[0] || 0)));
        const lastTime = timestamps.length ? timestamps[timestamps.length - 1] : 0;
        splitTimes.push(Math.max(0, lastTime - turnTimestamps[turnTimestamps.length - 1]));
      } else {
        const dur = timestamps.length ? timestamps[timestamps.length - 1] - (timestamps[0] || 0) : 0;
        splitTimes.push(dur);
      }
      const avgSplit = splitTimes.reduce((s,v)=>s+v,0) / Math.max(1, splitTimes.length);
      const splitScore = Math.round(Math.max(0, Math.min(50, 50 - avgSplit * 6)));
      const trunkAngleMin = Math.min(...(trunkAngles.length ? trunkAngles : [0]));
      const trunkAngleMax = Math.max(...(trunkAngles.length ? trunkAngles : [0]));
      const stabilityPenalty = Math.max(0, Math.min(20, Math.round((trunkAngleMax - trunkAngleMin) / 2)));
      const finalScore = Math.round(Math.max(0, Math.min(100, 40 + splitScore - stabilityPenalty)));
      const feedback:string[] = [];
      const corrections:string[] = [];
      if (turns >= 4) feedback.push(`Turns detected: ${turns}`);
      else corrections.push("Not many turns detected");
      if (avgSplit > 2.5) corrections.push("Slow turns");
      else feedback.push("Quick turns");
      return {
        exercise: "shuttle_run",
        score: finalScore,
        feedback,
        corrections,
        turns,
        splitTimes: splitTimes.map((s) => Math.round(s * 100) / 100),
        trunkAngleAvg: Math.round(trunkAvg * 10) / 10,
        trunkAngleMin: Math.round(trunkMin * 10) / 10,
        trunkAngleMax: Math.round(trunkMax * 10) / 10,
      } as AnalysisResult;
    }

    return {
      exercise: selectedExercise,
      score: 60,
      feedback: ["No analysis available"],
      corrections: ["Could not process this exercise type."],
    };
  };

  // advance step
  const advanceStep = () => {
    clearVideoSource();
    if (currentStepIndex < TEST_ORDER.length - 1) setCurrentStepIndex((i) => i + 1);
    else alert("All tests completed! Visit Progress to see history.");
  };

  // UI render (kept similar to your original)
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 py-8 px-6 sm:px-10 lg:px-20">
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 max-w-2xl w-full p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-3">Annexure A — Test Instructions</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p>The tests follow this order (you cannot choose):</p>
              <ol className="list-decimal list-inside">
                <li>Sit-ups (video, ≤ {MAX_VIDEO_SECONDS}s)</li>
                <li>Vertical Jump (video, ≤ {MAX_VIDEO_SECONDS}s)</li>
                <li>Shuttle Run (video, ≤ {MAX_VIDEO_SECONDS}s)</li>
                <li>Endurance Run (GPS tracker)</li>
              </ol>
              <p className="mt-2 font-medium">Important:</p>
              <ul className="list-disc list-inside">
                <li>Video-based tests are scored using only first {MAX_VIDEO_SECONDS} seconds.</li>
                <li>Use stable camera, good lighting, and full torso/legs visible.</li>
                <li>For endurance, use the Start Run GPS tracker.</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => setShowInstructions(false)}>I Understand — Start</Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Annexure A — Guided Test Flow
        </motion.h2>

        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          {TEST_ORDER.map((ex, idx) => (
            <div key={ex} className={`px-3 py-2 rounded capitalize ${idx === currentStepIndex ? "bg-blue-600 text-white" : idx < currentStepIndex ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"}`}>
              {ex.replace("_", " ")}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {selectedExercise === "endurance_run" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Endurance Run (GPS)</CardTitle>
                  <CardDescription>Start the tracker, carry your phone, stop when finished.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded mb-3">
                    <p>Time: {Math.floor(durationSec / 60)}m {durationSec % 60}s</p>
                    <p>Distance: {distanceKm.toFixed(3)} km</p>
                    <p>Pace: {distanceKm > 0 ? (durationSec / 60 / distanceKm).toFixed(2) : "--"} min/km</p>
                  </div>

                  <div className="flex gap-3">
                    {!isTracking ? (
                      <Button onClick={startRun} className="bg-green-600 hover:bg-green-700">Start Run</Button>
                    ) : (
                      <Button onClick={stopRun} className="bg-red-600 hover:bg-red-700">Stop Run</Button>
                    )}
                    <Button variant="outline" onClick={() => { coordsRef.current = []; setDistanceKm(0); setDurationSec(0); }}>Reset</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">Record or Upload — {selectedExercise.replace("_", " ")}</CardTitle>
                  <CardDescription>Max {MAX_VIDEO_SECONDS}s. Record or upload and press Analyze & Submit.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded mb-4 aspect-video">
                    <video ref={videoRef} className="w-full h-full" controls playsInline />
                    <canvas ref={overlayRef} className="absolute inset-0 w-full h-full pointer-events-none" />
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3 items-center">
                    {!recording ? (
                      <Button onClick={startRecording} className="bg-blue-600 hover:bg-blue-700"><Video className="h-4 w-4 mr-2" /> Record</Button>
                    ) : (
                      <Button onClick={stopRecording} className="bg-orange-600 hover:bg-orange-700">Stop</Button>
                    )}

                    <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-2" /> Upload</Button>

                    <Button variant="ghost" onClick={clearVideoSource}>Clear</Button>

                    <div className="ml-auto flex items-center gap-2">
                      {uploadProgress > 0 && uploadProgress < 100 && <div className="text-sm">Uploading: {uploadProgress}%</div>}
                      <Button onClick={runAnalyzeAndSubmit} disabled={isAnalyzing || (!recordedBlob && !uploadedFile)} className="bg-green-600 hover:bg-green-700 disabled:opacity-50">
                        {isAnalyzing ? "Analyzing..." : "Analyze & Submit"}
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Tip: Keep camera on a stable stand and ensure your full torso/legs are visible.</p>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="capitalize">Results — {analysisResult.exercise.replace("_", " ")}</CardTitle>
                      <CardDescription>Feedback and suggestions</CardDescription>
                    </div>
                    <Badge variant={analysisResult.score >= 80 ? "default" : analysisResult.score >= 60 ? "secondary" : "destructive"}>
                      {analysisResult.score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {analysisResult.reps !== undefined && <div className="mb-2">Reps: <strong>{analysisResult.reps}</strong></div>}
                  {analysisResult.jumpHeightCm !== undefined && <div className="mb-2">Jump (est): <strong>{analysisResult.jumpHeightCm} cm</strong></div>}
                  {analysisResult.distanceKm !== undefined && <div className="mb-2">Distance: <strong>{analysisResult.distanceKm.toFixed(2)} km</strong></div>}

                  {analysisResult.feedback.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-green-700 dark:text-green-500 font-medium mb-1 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> What went well</h4>
                      <ul className="list-disc list-inside pl-4">{analysisResult.feedback.map((f, i) => <li key={i} className="text-sm">{f}</li>)}</ul>
                    </div>
                  )}

                  {analysisResult.corrections.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-orange-700 dark:text-orange-500 font-medium mb-1 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Needs improvement</h4>
                      <ul className="list-disc list-inside pl-4">{analysisResult.corrections.map((c, i) => <li key={i} className="text-sm">{c}</li>)}</ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Info</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm capitalize">Current test: <strong>{selectedExercise.replace("_", " ")}</strong></p>
                <p className="text-sm mt-2">Follow the order; you will be advanced automatically.</p>
                <div className="mt-3">
                  <Button onClick={() => setShowInstructions(true)} variant="outline">Show Instructions</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmarks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-sm"><strong>Sit-ups (60s):</strong> 30+ excellent</p>
                <p className="text-sm"><strong>Jump:</strong> Higher is better</p>
                <p className="text-sm"><strong>Shuttle:</strong> Quicker turns are better</p>
                <p className="text-sm"><strong>Endurance:</strong> Pace & distance matter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Results are saved. View your history on the progress page.</p>
                <div className="mt-2">
                  <Link href="/progress">
                    <Button>View Progress</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

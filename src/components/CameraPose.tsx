"use client";
import { useEffect, useRef, useState } from "react";
import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";
import { calculateAngle, Point } from "../../server/angles";

const EXERCISES = [
  { value: "pushup", label: "Pushup" },
  { value: "squat", label: "Squat" },
  { value: "jump", label: "Jump" },
];

export default function CameraPose() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | null>(null);

  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [count, setCount] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [countingActive, setCountingActive] = useState(false);
  const [exerciseTimer, setExerciseTimer] = useState<number | null>(null);

  // Refs for stateful detection
  const pushupDownRef = useRef(false);
  const squatDownRef = useRef(false);
  const jumpActiveRef = useRef(false);
  const jumpStartYRef = useRef<number | null>(null);

  // Initialize Mediapipe Pose
  useEffect(() => {
    if (!cameraActive) return;
    const initPose = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      const landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
        },
        runningMode: "VIDEO",
      });
      setPoseLandmarker(landmarker);
    };
    initPose();
  }, [cameraActive]);

  // Timer logic
  useEffect(() => {
    if (!cameraActive || !selectedExercise) return;
    if (timer === null) return;

    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCountingActive(true);
      setTimer(null);
    }
  }, [timer, cameraActive, selectedExercise]);

  // Start 1 minute timer when countingActive ho jaye
  useEffect(() => {
    if (!countingActive) return;
    setExerciseTimer(60);
  }, [countingActive]);

  // Exercise timer logic
  useEffect(() => {
    if (exerciseTimer === null) return;
    if (exerciseTimer > 0) {
      const t = setTimeout(() => setExerciseTimer(exerciseTimer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      // Stop camera and analysis
      setCameraActive(false);
      setCountingActive(false);

      // Stop video stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [exerciseTimer]);

  // Start Camera + Detection
  useEffect(() => {
    if (!poseLandmarker || !cameraActive || !countingActive) return;

    const startCamera = async () => {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();

          videoRef.current!.width = videoRef.current!.videoWidth;
          videoRef.current!.height = videoRef.current!.videoHeight;

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current!.videoWidth;
            canvasRef.current.height = videoRef.current!.videoHeight;
          }

          // Detection loop
          const detect = () => {
            if (
              poseLandmarker &&
              videoRef.current &&
              videoRef.current.videoWidth > 0 &&
              videoRef.current.videoHeight > 0
            ) {
              const result = poseLandmarker.detectForVideo(
                videoRef.current,
                performance.now()
              );
              if (result.landmarks && result.landmarks[0]) {
                if (selectedExercise === "pushup") {
                  checkPushup(result.landmarks[0]);
                } else if (selectedExercise === "squat") {
                  checkSquat(result.landmarks[0]);
                } else if (selectedExercise === "jump") {
                  checkJump(result.landmarks[0]);
                }
                drawSkeleton(result.landmarks[0]);
              }
            }
            requestAnimationFrame(detect);
          };

          detect();
        };
      }
    };

    startCamera();
    setCount(0);
    pushupDownRef.current = false;
    squatDownRef.current = false;
    jumpActiveRef.current = false;
    jumpStartYRef.current = null;
  }, [poseLandmarker, selectedExercise, cameraActive, countingActive]);

  // Pushup detection logic (based on elbow angles)
  function checkPushup(landmarks: Point[]) {
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    const leftAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

    const avgAngle = (leftAngle + rightAngle) / 2;

    if (avgAngle < 100 && !pushupDownRef.current) {
      pushupDownRef.current = true;
    }
    if (pushupDownRef.current && avgAngle > 140) {
      setCount(prev => prev + 1);
      pushupDownRef.current = false;
    }
  }

  // Squat detection logic (based on knee angles)
  function checkSquat(landmarks: Point[]) {
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    const leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    const avgAngle = (leftAngle + rightAngle) / 2;

    if (avgAngle < 100 && !squatDownRef.current) {
      squatDownRef.current = true;
    }
    if (squatDownRef.current && avgAngle > 160) {
      setCount(prev => prev + 1);
      squatDownRef.current = false;
    }
  }

  // Jump detection logic (based on hip Y position)
  function checkJump(landmarks: Point[]) {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const midHipY = (leftHip.y + rightHip.y) / 2;

    if (!jumpActiveRef.current && midHipY > 0.55) {
      jumpActiveRef.current = true;
      jumpStartYRef.current = midHipY;
    }
    if (jumpActiveRef.current && midHipY < 0.45) {
      setCount(prev => prev + 1);
      jumpActiveRef.current = false;
      jumpStartYRef.current = null;
    }
  }

  // Draw skeleton on canvas
  function drawSkeleton(landmarks: Point[]) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 0],
      [11, 13], [13, 15], [12, 14], [14, 16], [11, 12],
      [23, 24], [11, 23], [12, 24], [23, 25], [25, 27], [24, 26], [26, 28],
    ];
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 3;
    connections.forEach(([a, b]) => {
      if (landmarks[a] && landmarks[b]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[a].x * canvas.width, landmarks[a].y * canvas.height);
        ctx.lineTo(landmarks[b].x * canvas.width, landmarks[b].y * canvas.height);
        ctx.stroke();
      }
    });
  }

  let level = "Beginner";
  let progress = (count / 20) * 100;
  if (count >= 20) {
    level = "Intermediate";
    progress = (count / 50) * 100;
  }
  if (count >= 50) {
    level = "Advanced";
    progress = (count / 100) * 100;
  }

  return (
    <div className="flex flex-col items-center p-6">
      {!cameraActive && exerciseTimer === 0 ? (
        // Show result after timer ends
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-600 mb-4">
            Time&apos;s up!
          </div>
          <div className="mt-4 text-4xl font-extrabold text-blue-600">
            {selectedExercise === "pushup" && <>Pushups: {count}</>}
            {selectedExercise === "squat" && <>Squats: {count}</>}
            {selectedExercise === "jump" && <>Jumps: {count}</>}
          </div>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-200 rounded-full h-6 mt-4">
            <div
              className="bg-green-500 h-6 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-semibold text-gray-800 text-center">
            Level: {level}
          </div>
          <button
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-xl shadow"
            onClick={() => {
              setSelectedExercise("");
              setCount(0);
              setExerciseTimer(null);
            }}
          >
            Try Again
          </button>
        </div>
      ) : !cameraActive ? (
        <>
          <div className="mb-4">
            <label htmlFor="exercise" className="mr-2 font-semibold">
              Choose Exercise:
            </label>
            <select
              id="exercise"
              value={selectedExercise}
              onChange={e => setSelectedExercise(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select...</option>
              {EXERCISES.map(ex => (
                <option key={ex.value} value={ex.value}>
                  {ex.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (selectedExercise) {
                setCameraActive(true);
                setTimer(3); // 3 second timer
              }
            }}
            disabled={!selectedExercise}
            className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-xl shadow ${!selectedExercise ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Start
          </button>
        </>
      ) : timer !== null ? (
        <div className="text-3xl font-bold text-blue-600 mt-10">
          Get Ready... {timer}
        </div>
      ) : (
        <>
          {/* Show exercise timer */}
          <div className="text-xl font-semibold text-gray-700 mb-2">
            Time Left: {exerciseTimer}s
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 400,
              aspectRatio: "4/3",
            }}
          >
            <video
              ref={videoRef}
              className="rounded-lg shadow-lg w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            />
          </div>
          <div className="mt-4 text-4xl font-extrabold text-blue-600">
            {selectedExercise === "pushup" && <>Pushups: {count}</>}
            {selectedExercise === "squat" && <>Squats: {count}</>}
            {selectedExercise === "jump" && <>Jumps: {count}</>}
          </div>
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-gray-200 rounded-full h-6 mt-4">
            <div
              className="bg-green-500 h-6 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-semibold text-gray-800 text-center">
            Level: {level}
          </div>
        </>
      )}
    </div>
  );
}







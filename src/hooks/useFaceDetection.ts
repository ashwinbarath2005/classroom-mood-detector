import { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface DetectedFace {
  box: { x: number; y: number; width: number; height: number };
  expression: string;
  confidence: number;
}

export interface MoodData {
  interested: number;
  confused: number;
  bored: number;
  happy: number;
  neutral: number;
  sad: number;
  angry: number;
  surprised: number;
  facesDetected: number;
  framesAnalyzed: number;
  avgConfidence: number;
  faces: DetectedFace[];
}

const EXPRESSION_MAP: Record<string, string> = {
  happy: 'happy',
  sad: 'sad',
  angry: 'angry',
  fearful: 'confused',
  disgusted: 'bored',
  surprised: 'surprised',
  neutral: 'neutral',
};

function classifyMood(expressions: Record<string, number>) {
  const interested = (expressions.happy || 0) + (expressions.surprised || 0) * 0.5 + (expressions.neutral || 0) * 0.3;
  const confused = (expressions.fearful || 0) + (expressions.sad || 0) * 0.4 + (expressions.surprised || 0) * 0.3;
  const bored = (expressions.neutral || 0) * 0.5 + (expressions.disgusted || 0) + (expressions.angry || 0) * 0.3;
  const total = interested + confused + bored || 1;
  return {
    interested: (interested / total) * 100,
    confused: (confused / total) * 100,
    bored: (bored / total) * 100,
  };
}

export function useFaceDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [moodData, setMoodData] = useState<MoodData>({
    interested: 55, confused: 25, bored: 20,
    happy: 15, neutral: 40, sad: 10, angry: 5, surprised: 10,
    facesDetected: 0, framesAnalyzed: 0, avgConfidence: 0, faces: [],
  });
  const frameCountRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
      } catch (e) {
        console.error('Failed to load face-api models', e);
      }
    };
    loadModels();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (e) {
      console.error('Camera error', e);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (!modelsLoaded || !cameraActive || !videoRef.current) return;
    const video = videoRef.current;

    const detect = async () => {
      if (video.paused || video.ended) return;
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 }))
        .withFaceExpressions();

      frameCountRef.current++;

      if (canvasRef.current && video.videoWidth) {
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          detections.forEach(d => {
            const { x, y, width, height } = d.detection.box;
            ctx.strokeStyle = 'hsl(142, 71%, 45%)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            const sorted = Object.entries(d.expressions).sort((a, b) => b[1] - a[1]);
            const top = sorted[0];
            ctx.fillStyle = 'hsl(142, 71%, 45%)';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText(`${EXPRESSION_MAP[top[0]] || top[0]} ${(top[1]*100).toFixed(0)}%`, x, y - 6);
          });
        }
      }

      if (detections.length > 0) {
        const avgExpressions: Record<string, number> = {};
        let totalConf = 0;
        const faces: DetectedFace[] = [];

        detections.forEach(d => {
          const sorted = Object.entries(d.expressions).sort((a, b) => b[1] - a[1]);
          totalConf += d.detection.score;
          faces.push({
            box: d.detection.box,
            expression: EXPRESSION_MAP[sorted[0][0]] || sorted[0][0],
            confidence: d.detection.score,
          });
          Object.entries(d.expressions).forEach(([k, v]) => {
            avgExpressions[k] = (avgExpressions[k] || 0) + v;
          });
        });

        Object.keys(avgExpressions).forEach(k => {
          avgExpressions[k] /= detections.length;
        });

        const mood = classifyMood(avgExpressions);

        setMoodData(prev => ({
          ...mood,
          happy: (avgExpressions.happy || 0) * 100,
          neutral: (avgExpressions.neutral || 0) * 100,
          sad: (avgExpressions.sad || 0) * 100,
          angry: (avgExpressions.angry || 0) * 100,
          surprised: (avgExpressions.surprised || 0) * 100,
          facesDetected: detections.length,
          framesAnalyzed: frameCountRef.current,
          avgConfidence: (totalConf / detections.length) * 100,
          faces,
        }));
      } else {
        setMoodData(prev => ({
          ...prev,
          facesDetected: 0,
          framesAnalyzed: frameCountRef.current,
          faces: [],
        }));
      }
    };

    intervalRef.current = setInterval(detect, 500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [modelsLoaded, cameraActive]);

  return { videoRef, canvasRef, moodData, modelsLoaded, cameraActive, startCamera, stopCamera };
}

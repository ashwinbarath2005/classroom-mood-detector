import React from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Loader2 } from 'lucide-react';

interface Props {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  cameraActive: boolean;
  modelsLoaded: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function WebcamFeed({ videoRef, canvasRef, cameraActive, modelsLoaded, onStart, onStop }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="card-shadow rounded-xl bg-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-foreground">Live Camera Feed</h2>
        {cameraActive ? (
          <button onClick={onStop} className="flex items-center gap-1.5 text-sm text-accent-red hover:opacity-80 transition-opacity">
            <VideoOff className="size-4" /> Stop
          </button>
        ) : (
          <button
            onClick={onStart}
            disabled={!modelsLoaded}
            className="flex items-center gap-1.5 text-sm text-accent-green hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {modelsLoaded ? <Video className="size-4" /> : <Loader2 className="size-4 animate-spin" />}
            {modelsLoaded ? 'Start Camera' : 'Loading Models…'}
          </button>
        )}
      </div>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Video className="size-12 opacity-30" />
            <p className="text-sm">Click "Start Camera" to begin detection</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

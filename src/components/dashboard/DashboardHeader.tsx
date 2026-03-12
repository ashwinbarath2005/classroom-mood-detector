import { motion } from 'framer-motion';
import { Camera, Wifi } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
          <Camera className="size-6 text-muted-foreground" />
          AI Classroom Mood Detector
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time classroom engagement analytics</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-accent-green" />
        </span>
        <span className="text-sm font-medium text-accent-green flex items-center gap-1">
          <Wifi className="size-3.5" /> Live Detection
        </span>
      </div>
    </motion.header>
  );
}

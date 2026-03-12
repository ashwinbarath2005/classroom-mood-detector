import { motion } from 'framer-motion';
import { Users, Activity, Brain } from 'lucide-react';

interface Props {
  facesDetected: number;
  framesAnalyzed: number;
  avgConfidence: number;
}

const stats = [
  { key: 'faces', label: 'Faces Detected', icon: Users, gradient: 'from-blue-50 to-indigo-50', iconColor: 'text-blue-500' },
  { key: 'frames', label: 'Frames Analyzed', icon: Activity, gradient: 'from-emerald-50 to-teal-50', iconColor: 'text-emerald-500' },
  { key: 'confidence', label: 'AI Confidence', icon: Brain, gradient: 'from-violet-50 to-purple-50', iconColor: 'text-violet-500' },
] as const;

export default function StatCards({ facesDetected, framesAnalyzed, avgConfidence }: Props) {
  const values: Record<string, string> = {
    faces: String(facesDetected),
    frames: String(framesAnalyzed),
    confidence: `${avgConfidence.toFixed(0)}%`,
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.03, y: -2 }}
          className={`card-shadow rounded-xl bg-gradient-to-br ${s.gradient} p-4 flex items-center gap-3 cursor-default transition-shadow duration-200 hover:card-shadow-hover`}
        >
          <s.icon className={`size-8 ${s.iconColor} shrink-0`} />
          <div className="min-w-0">
            <p className="text-2xl sm:text-3xl font-bold tabular-nums text-foreground leading-none">{values[s.key]}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

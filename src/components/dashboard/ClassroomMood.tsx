import { motion } from 'framer-motion';

interface Props {
  interested: number;
  confused: number;
  bored: number;
  happy: number;
  neutral: number;
  sad: number;
  angry: number;
  surprised: number;
}

const bars = [
  { key: 'interested' as const, label: 'Interested', from: 'from-green-400', to: 'to-green-500' },
  { key: 'confused' as const, label: 'Confused', from: 'from-yellow-400', to: 'to-yellow-500' },
  { key: 'bored' as const, label: 'Bored', from: 'from-red-400', to: 'to-red-500' },
];

const emotions = [
  { key: 'happy' as const, label: 'Happy' },
  { key: 'neutral' as const, label: 'Neutral' },
  { key: 'sad' as const, label: 'Sad' },
  { key: 'angry' as const, label: 'Angry' },
  { key: 'surprised' as const, label: 'Surprised' },
];

export default function ClassroomMood(props: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="card-shadow rounded-xl bg-card p-6"
    >
      <h2 className="text-base font-medium text-foreground mb-5">Classroom Mood</h2>
      <div className="space-y-4">
        {bars.map(b => (
          <div key={b.key}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{b.label}</span>
              <span className="font-medium tabular-nums text-foreground">{props[b.key].toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${b.from} ${b.to}`}
                initial={{ width: 0 }}
                animate={{ width: `${props[b.key]}%` }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">Emotion Distribution</p>
        <div className="flex flex-wrap gap-2">
          {emotions.map(e => (
            <span key={e.key} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {e.label}
              <span className="tabular-nums font-semibold text-foreground">{props[e.key].toFixed(0)}%</span>
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

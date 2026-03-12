import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Clock, Users, TrendingUp, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface Props {
  sessionData: {
    interested: number;
    confused: number;
    bored: number;
    facesDetected: number;
  };
  onEnd: () => void;
}

export default function SessionControls({ sessionData, onEnd }: Props) {
  const [open, setOpen] = useState(false);
  const startTime = useRef(Date.now());

  const handleEnd = () => {
    onEnd();
    setOpen(true);
  };

  const duration = Math.floor((Date.now() - startTime.current) / 1000);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  const reportItems = [
    { label: 'Avg. Interested', value: `${sessionData.interested.toFixed(0)}%`, icon: TrendingUp, color: 'text-accent-green' },
    { label: 'Avg. Confused', value: `${sessionData.confused.toFixed(0)}%`, icon: BarChart3, color: 'text-accent-yellow' },
    { label: 'Avg. Bored', value: `${sessionData.bored.toFixed(0)}%`, icon: BarChart3, color: 'text-accent-red' },
    { label: 'Total Faces', value: String(sessionData.facesDetected), icon: Users, color: 'text-blue-500' },
    { label: 'Session Duration', value: `${mins}m ${secs}s`, icon: Clock, color: 'text-violet-500' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.3 }}
        className="flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnd}
          className="gradient-button text-primary-foreground px-8 py-3.5 text-base font-semibold rounded-xl shadow-lg transition-shadow hover:shadow-xl"
        >
          End Session
        </motion.button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-0 card-shadow-hover">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-6"
          >
            <DialogTitle className="text-lg font-semibold text-foreground mb-5">Classroom Session Report</DialogTitle>
            <div className="grid grid-cols-2 gap-3">
              {reportItems.map(item => (
                <div key={item.label} className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
                  <item.icon className={`size-5 ${item.color} shrink-0`} />
                  <div>
                    <p className="text-xl font-bold tabular-nums text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mt-5 w-full gradient-button text-primary-foreground py-2.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
            >
              Close Report
            </button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}

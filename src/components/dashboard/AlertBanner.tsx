import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  bored: number;
  confused: number;
}

export default function AlertBanner({ bored, confused }: Props) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (bored > 50) {
      setMessage('⚠ Student engagement dropping — consider a break or interactive activity');
      setVisible(true);
    } else if (confused > 40) {
      setMessage('⚠ Students appear confused — try re-explaining the concept');
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [bored, confused]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, [visible, message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]"
        >
          <div className="flex items-center gap-3 rounded-xl bg-accent-red/10 border border-accent-red/20 px-4 py-3 card-shadow">
            <AlertTriangle className="size-5 text-accent-red shrink-0" />
            <p className="text-sm font-medium text-foreground flex-1">{message}</p>
            <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface Props {
  interested: number;
  confused: number;
  bored: number;
}

function getInsight(p: Props) {
  if (p.bored > 40) return { message: 'Students appear bored. Try asking an interactive question or switching activities.', color: 'bg-accent-red', icon: AlertTriangle, key: 'bored' };
  if (p.confused > 40) return { message: 'Significant confusion detected. Consider re-explaining the last concept with an example.', color: 'bg-accent-yellow', icon: Lightbulb, key: 'confused' };
  return { message: 'Students are engaged! This material is resonating well. Keep going.', color: 'bg-accent-green', icon: TrendingUp, key: 'engaged' };
}

export default function AIInsights(props: Props) {
  const insight = getInsight(props);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="card-shadow rounded-xl bg-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="size-5 text-muted-foreground" />
        <h2 className="text-base font-medium text-foreground">AI Teaching Insights</h2>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={insight.key}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className="flex items-start gap-3"
        >
          <div className={`w-1 self-stretch rounded-full ${insight.color} shrink-0`} />
          <div className="flex items-start gap-3">
            <insight.icon className="size-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">{insight.message}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

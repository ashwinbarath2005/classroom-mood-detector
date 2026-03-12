import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  interested: number;
  confused: number;
  bored: number;
}

const PIE_COLORS = ['hsl(142,71%,45%)', 'hsl(48,95%,57%)', 'hsl(0,84%,60%)'];

export default function Charts({ interested, confused, bored }: Props) {
  const [timeline, setTimeline] = useState<{ time: string; interested: number; confused: number; bored: number }[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    const now = new Date();
    const label = `${now.getMinutes()}:${String(now.getSeconds()).padStart(2, '0')}`;
    tickRef.current++;
    setTimeline(prev => {
      const next = [...prev, { time: label, interested: +interested.toFixed(0), confused: +confused.toFixed(0), bored: +bored.toFixed(0) }];
      return next.slice(-20);
    });
  }, [interested, confused, bored]);

  const pieData = [
    { name: 'Interested', value: +interested.toFixed(0) },
    { name: 'Confused', value: +confused.toFixed(0) },
    { name: 'Bored', value: +bored.toFixed(0) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.3 }}
        className="card-shadow rounded-xl bg-card p-6"
      >
        <h2 className="text-base font-medium text-foreground mb-4">Mood Timeline</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,6%,90%)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'hsl(240,4%,46%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(240,4%,46%)' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
              <Line type="monotone" dataKey="interested" stroke="hsl(142,71%,45%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="confused" stroke="hsl(48,95%,57%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="bored" stroke="hsl(0,84%,60%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="card-shadow rounded-xl bg-card p-6"
      >
        <h2 className="text-base font-medium text-foreground mb-4">Current Distribution</h2>
        <div className="h-52 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} strokeWidth={0}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
          {pieData.map((d, i) => (
            <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
              {d.name} {d.value}%
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

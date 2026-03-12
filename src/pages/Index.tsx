import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import WebcamFeed from '@/components/dashboard/WebcamFeed';
import ClassroomMood from '@/components/dashboard/ClassroomMood';
import AIInsights from '@/components/dashboard/AIInsights';
import Charts from '@/components/dashboard/Charts';
import AlertBanner from '@/components/dashboard/AlertBanner';
import SessionControls from '@/components/dashboard/SessionControls';
import { useFaceDetection } from '@/hooks/useFaceDetection';

const Index = () => {
  const { videoRef, canvasRef, moodData, modelsLoaded, cameraActive, startCamera, stopCamera } = useFaceDetection();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background text-foreground"
    >
      <AlertBanner bored={moodData.bored} confused={moodData.confused} />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <StatCards
              facesDetected={moodData.facesDetected}
              framesAnalyzed={moodData.framesAnalyzed}
              avgConfidence={moodData.avgConfidence}
            />
            <WebcamFeed
              videoRef={videoRef as React.RefObject<HTMLVideoElement>}
              canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
              cameraActive={cameraActive}
              modelsLoaded={modelsLoaded}
              onStart={startCamera}
              onStop={stopCamera}
            />
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <ClassroomMood
              interested={moodData.interested}
              confused={moodData.confused}
              bored={moodData.bored}
              happy={moodData.happy}
              neutral={moodData.neutral}
              sad={moodData.sad}
              angry={moodData.angry}
              surprised={moodData.surprised}
            />
            <AIInsights
              interested={moodData.interested}
              confused={moodData.confused}
              bored={moodData.bored}
            />
          </div>
        </div>

        <Charts
          interested={moodData.interested}
          confused={moodData.confused}
          bored={moodData.bored}
        />

        <SessionControls
          sessionData={moodData}
          onEnd={stopCamera}
        />
      </div>
    </motion.div>
  );
};

export default Index;

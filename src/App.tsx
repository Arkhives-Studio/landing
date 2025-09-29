import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { OriginalsForge } from "./components/OriginalsForge";
import { CompetitivePlay } from "./components/CompetitivePlay";
import { AICommitments } from "./components/AICommitments";
import { Footer } from "./components/Footer";
import { HoneycombBackground } from "./components/HoneycombBackground";
import { FlyingBees } from "./components/FlyingBees";

export default function App() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Global honeycomb background */}
      <HoneycombBackground />
      
      {/* Global flying bees */}
      <FlyingBees />
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <OriginalsForge />
        <CompetitivePlay />
        <AICommitments />
        <Footer />
      </div>
    </div>
  );
}
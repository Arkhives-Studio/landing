import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { DesignPartner } from "./components/DesignPartner";
import { OriginalsForge } from "./components/OriginalsForge";
import { CompetitivePlay } from "./components/CompetitivePlay";
import { AICommitments } from "./components/AICommitments";
import { Footer } from "./components/Footer";
import { HoneycombBackground } from "./components/HoneycombBackground";
import { FlyingBees } from "./components/FlyingBees";

export default function App() {
  return (
    <div className="min-h-screen bg-background relative">
      <HoneycombBackground />
      <FlyingBees />
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <DesignPartner />
        <OriginalsForge />
        <CompetitivePlay />
        <AICommitments />
        <Footer />
      </div>
    </div>
  );
}
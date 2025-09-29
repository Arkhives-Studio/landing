import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

export function Hero() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl mb-6 text-foreground">
            Built for Players.
            <br />
            <span className="text-primary">Powered by Creators.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-8">
            Arkhives Originals delivers premium gaming experiences while Forge empowers creators to build the future of interactive entertainment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <Tabs defaultValue="gamers" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="gamers" className="text-sm md:text-base">Gamers</TabsTrigger>
              <TabsTrigger value="investors" className="text-sm md:text-base">Investors</TabsTrigger>
              <TabsTrigger value="studios" className="text-sm md:text-base">Studios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gamers" className="space-y-4">
              <p className="text-muted mb-4" style={{ fontSize: '21px' }}>Join the next generation of gaming experiences</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your gaming email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-input-background/80 backdrop-blur-sm text-center sm:text-left"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Get Early Access
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="investors" className="space-y-4">
              <p className="text-muted mb-4" style={{ fontSize: '21px' }}>Invest in the future of creator-driven gaming</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-input-background/80 backdrop-blur-sm text-center sm:text-left"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Learn More
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="studios" className="space-y-4">
              <p className="text-muted mb-4" style={{ fontSize: '21px' }}>Build and monetize with our creator platform</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your studio email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-input-background/80 backdrop-blur-sm text-center sm:text-left"
                />
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
                  Join Forge
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}
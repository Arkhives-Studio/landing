import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";

export function CompetitivePlay() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-card/50 to-card/20 border-border/30 backdrop-blur-sm">
            {/* Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }}
              style={{
                width: "200%",
                height: "100%",
                transform: "skewX(-25deg)"
              }}
            />
            
            <CardContent className="p-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="filter blur-[0.5px] space-y-6"
              >
                <div className="w-20 h-20 bg-muted/30 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-muted">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                
                <h3 className="text-4xl md:text-5xl text-muted">
                  Competitive Play
                </h3>
                
                <p className="text-lg text-muted/80 max-w-2xl mx-auto">
                  Professional esports tournaments, ranked matchmaking, and creator-driven competitive formats. 
                  The future of gaming competition is being forged.
                </p>
                
                <div className="flex items-center justify-center gap-2 mt-8">
                  <span className="text-sm text-muted/60 uppercase tracking-wider">
                    Coming Soon
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-primary/40 rounded-full"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
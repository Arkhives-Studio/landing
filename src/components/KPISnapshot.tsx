import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  description: string;
  delay: number;
}

function KPICard({ title, value, suffix = "", description, delay }: KPICardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
        <CardContent className="p-8 text-center">
          <h3 className="text-sm uppercase tracking-wider text-muted mb-2">
            {title}
          </h3>
          <div className="text-4xl md:text-5xl mb-2 text-primary">
            {count.toLocaleString()}{suffix}
          </div>
          <p className="text-muted-foreground text-sm">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function KPISnapshot() {
  const kpis = [
    {
      title: "Active Players",
      value: 250000,
      suffix: "+",
      description: "Engaged community members"
    },
    {
      title: "Creator Revenue",
      value: 2500000,
      suffix: "",
      description: "Total earnings distributed"
    },
    {
      title: "Games Published",
      value: 150,
      suffix: "+",
      description: "Original titles launched"
    },
    {
      title: "Studio Partners",
      value: 45,
      suffix: "",
      description: "Development collaborations"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-foreground">
            Built on Success
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Our platform continues to grow, empowering creators and delighting players worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {kpis.map((kpi, index) => (
            <KPICard
              key={kpi.title}
              title={kpi.title}
              value={kpi.value}
              suffix={kpi.suffix}
              description={kpi.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";

type AudienceKey = "gamers" | "investors" | "studios";

const audienceConfig: Record<AudienceKey, {
  headline: string;
  placeholder: string;
  cta: string;
  source: string;
  buttonClassName?: string;
}> = {
  gamers: {
    headline: "Join the next generation of gaming experiences",
    placeholder: "Enter your gaming email",
    cta: "Get Early Access",
    source: "gamers",
  },
  investors: {
    headline: "Invest in the future of creator-driven gaming",
    placeholder: "Enter your business email",
    cta: "Learn More",
    source: "investors",
  },
  studios: {
    headline: "Build and monetize with our creator platform",
    placeholder: "Enter your studio email",
    cta: "Join Forge",
    source: "studios",
    buttonClassName: "bg-accent hover:bg-accent/90 text-accent-foreground",
  },
};

export function Hero() {
  const [email, setEmail] = useState("");
  const [audience, setAudience] = useState<AudienceKey>("gamers");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const apiBaseUrl = useMemo(() => {
    const fallback = "http://localhost:4000";
    const configured = import.meta.env.VITE_EMAIL_SERVICE_URL ?? fallback;
    return configured.replace(/\/$/, "");
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setStatusMessage("Adding you to the list...");

    try {
      const response = await fetch(`${apiBaseUrl}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, source: audienceConfig[audience].source }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setEmail("");
      setStatus("success");
      setStatusMessage("Thanks! We'll be in touch soon.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage("Something went wrong. Please try again later.");
    }
  };

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
          <Tabs
            value={audience}
            onValueChange={(value) => setAudience(value as AudienceKey)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="gamers" className="text-sm md:text-base">Gamers</TabsTrigger>
              <TabsTrigger value="investors" className="text-sm md:text-base">Investors</TabsTrigger>
              <TabsTrigger value="studios" className="text-sm md:text-base">Studios</TabsTrigger>
            </TabsList>

            {(Object.entries(audienceConfig) as [AudienceKey, typeof audienceConfig[AudienceKey]][]).map(
              ([key, config]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <p className="text-muted mb-4" style={{ fontSize: "21px" }}>
                    {config.headline}
                  </p>
                  <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                    <Input
                      type="email"
                      placeholder={config.placeholder}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="flex-1 bg-input-background/80 backdrop-blur-sm text-center sm:text-left"
                      required
                      disabled={status === "loading"}
                    />
                    <Button
                      type="submit"
                      className={
                        config.buttonClassName ?? "bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                      }
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? "Submitting..." : config.cta}
                    </Button>
                  </form>
                </TabsContent>
              ),
            )}
          </Tabs>
          {status !== "idle" && (
            <p
              className={`mt-4 text-sm ${
                status === "success" ? "text-emerald-400" : status === "error" ? "text-destructive" : "text-muted"
              }`}
            >
              {statusMessage}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
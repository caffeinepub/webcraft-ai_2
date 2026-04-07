import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Cpu,
  Globe,
  LayoutTemplate,
  Loader2,
  Send,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetProject } from "../hooks/useQueries";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I'm WebCraft AI. Describe the website you want to build and I'll generate it for you. You can ask for any type of site — landing pages, portfolios, e-commerce, blogs, and more.",
    timestamp: new Date(),
  },
];

const BOT_REPLIES = [
  "I'm analyzing your requirements and generating the layout...",
  "Building your website structure now. Adding responsive components...",
  "Great idea! Creating the design system with your color palette...",
  "Generating clean, production-ready code for your site...",
  "Almost there! Setting up the navigation and hero section...",
  "I've built the core structure. Adding animations and micro-interactions...",
  "Your website is taking shape! Optimizing for mobile and performance...",
];

export default function Builder() {
  const params = useParams({ from: "/builder/$projectId" });
  const router = useRouter();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const projectId = (() => {
    try {
      return BigInt(params.projectId);
    } catch {
      return null;
    }
  })();

  const { data: project, isLoading: projectLoading } = useGetProject(projectId);

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [previewPhase, setPreviewPhase] = useState<
    "empty" | "building" | "ready"
  >("empty");
  const [nextId, setNextId] = useState(2);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesEndRef is stable
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || isBuilding) return;

    const userMessage: Message = {
      id: nextId,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNextId((n) => n + 1);
    setInputValue("");
    setIsBuilding(true);
    setPreviewPhase("building");

    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      const botMessage: Message = {
        id: nextId + 1,
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setNextId((n) => n + 2);
      setIsBuilding(false);
      setPreviewPhase("ready");
    }, 1500);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsDeploying(false);
    toast.success("Website deployed to Internet Computer!", {
      description: "Your site is live and accessible globally.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
        <div
          className="card-glass rounded-3xl p-10 max-w-md w-full text-center border-glow"
          data-ocid="auth.dialog"
        >
          <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">
            Sign In Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect with Internet Identity to use the builder.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="auth.login.button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Connect with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col hero-gradient text-foreground overflow-hidden">
      {/* Top bar */}
      <header className="flex-shrink-0 border-b border-border/40 backdrop-blur-md bg-background/60 z-10">
        <div className="h-14 px-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="text-muted-foreground hover:text-foreground gap-2 flex-shrink-0"
            data-ocid="builder.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <div className="w-px h-5 bg-border/40" />

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <LayoutTemplate className="w-4 h-4 text-primary flex-shrink-0" />
            {projectLoading ? (
              <Skeleton className="h-5 w-40 bg-muted/40" />
            ) : (
              <span className="font-semibold text-foreground truncate">
                {project?.name ?? `Project ${params.projectId}`}
              </span>
            )}
            {project?.status && (
              <Badge className="text-xs capitalize ml-1 hidden sm:inline-flex bg-primary/10 text-primary border-primary/30 flex-shrink-0">
                {project.status}
              </Badge>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={isDeploying || previewPhase === "empty"}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan gap-2 flex-shrink-0"
            data-ocid="builder.deploy.button"
          >
            {isDeploying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span>{isDeploying ? "Deploying..." : "Deploy"}</span>
          </Button>
        </div>
      </header>

      {/* Main split pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat panel */}
        <div className="w-full sm:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-border/40 bg-background/40 backdrop-blur-sm">
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            data-ocid="builder.chat.list"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === "assistant"
                        ? "bg-primary/20 border border-primary/40"
                        : "bg-muted/50 border border-border/40"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Cpu className="w-4 h-4 text-primary" />
                    ) : (
                      <User className="w-4 h-4 text-foreground/70" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-muted/30 text-foreground/90 border border-border/30"
                        : "bg-primary/20 text-foreground border border-primary/30"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isBuilding && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
                data-ocid="builder.chat.loading_state"
              >
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/20 border border-primary/40">
                  <Cpu className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted/30 text-foreground/90 border border-border/30 rounded-2xl px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Building</span>
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: `${d}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="flex-shrink-0 p-4 border-t border-border/40 bg-background/40">
            <div className="flex gap-2 items-end">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe the website you want to build..."
                className="flex-1 min-h-[60px] max-h-[120px] bg-input border-border/40 text-foreground resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                data-ocid="builder.chat.input"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim() || isBuilding}
                className="h-10 w-10 flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
                data-ocid="builder.chat.send.button"
              >
                {isBuilding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to build · Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Preview panel */}
        <div className="hidden sm:flex flex-1 flex-col">
          {/* Preview header */}
          <div className="flex-shrink-0 h-10 border-b border-border/40 px-4 flex items-center justify-between bg-background/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                Preview
              </span>
            </div>
            {previewPhase === "ready" && (
              <Badge className="text-xs bg-green-500/15 text-green-400 border-green-500/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Generated
              </Badge>
            )}
          </div>

          {/* Preview content */}
          <div
            className="flex-1 relative overflow-hidden preview-gradient"
            data-ocid="builder.preview.canvas_target"
          >
            <AnimatePresence mode="wait">
              {previewPhase === "empty" && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                  data-ocid="builder.preview.empty_state"
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center animate-pulse-glow">
                    <LayoutTemplate className="w-10 h-10 text-primary/50" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground/70 mb-3">
                    Your Website Will Appear Here
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                    Start chatting with WebCraft AI. Describe your vision and
                    watch your website come to life in this preview.
                  </p>
                </motion.div>
              )}

              {previewPhase === "building" && (
                <motion.div
                  key="building"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  data-ocid="builder.preview.loading_state"
                >
                  <div className="space-y-4 w-full max-w-lg px-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                      <span className="text-foreground font-medium">
                        Generating your website...
                      </span>
                    </div>
                    {["100%", "80%", "60%", "90%", "70%", "50%"].map((w, i) => (
                      <motion.div
                        key={w}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 0.4, scaleX: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        style={{ width: w }}
                        className={`h-${i === 0 ? 4 : i < 2 ? 3 : 2} bg-primary/40 rounded-full origin-left`}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {previewPhase === "ready" && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 overflow-auto"
                  data-ocid="builder.preview.success_state"
                >
                  {/* Simulated generated website preview */}
                  <div className="min-h-full">
                    {/* Simulated navbar */}
                    <div className="h-12 bg-background/80 backdrop-blur border-b border-border/30 flex items-center px-6 gap-4">
                      <div className="w-20 h-4 bg-primary/40 rounded" />
                      <div className="flex-1" />
                      <div className="flex gap-3">
                        <div className="w-12 h-3 bg-muted/40 rounded" />
                        <div className="w-12 h-3 bg-muted/40 rounded" />
                        <div className="w-12 h-3 bg-muted/40 rounded" />
                      </div>
                      <div className="w-20 h-7 bg-primary/50 rounded-full" />
                    </div>
                    {/* Simulated hero */}
                    <div className="px-8 py-12 text-center space-y-4">
                      <div className="h-8 bg-foreground/20 rounded-lg w-3/4 mx-auto" />
                      <div className="h-4 bg-foreground/10 rounded w-full mx-auto" />
                      <div className="h-4 bg-foreground/10 rounded w-4/5 mx-auto" />
                      <div className="flex justify-center gap-3 mt-4">
                        <div className="w-32 h-10 bg-primary/50 rounded-lg" />
                        <div className="w-32 h-10 bg-muted/30 rounded-lg border border-border/40" />
                      </div>
                    </div>
                    {/* Simulated cards */}
                    <div className="px-8 pb-8 grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-card/50 rounded-lg p-4 space-y-2 border border-border/20"
                        >
                          <div className="w-8 h-8 bg-primary/20 rounded-lg" />
                          <div className="h-3 bg-foreground/20 rounded w-3/4" />
                          <div className="h-2.5 bg-foreground/10 rounded w-full" />
                          <div className="h-2.5 bg-foreground/10 rounded w-5/6" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

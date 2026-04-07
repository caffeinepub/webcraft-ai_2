import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Code2,
  Cpu,
  Globe,
  Infinity as InfinityIcon,
  Menu,
  Rocket,
  Star,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const FEATURES = [
  {
    icon: Cpu,
    title: "AI-Powered Builder",
    description:
      "Describe your vision in plain English. Our AI understands context, design principles, and builds complete websites instantly.",
    badge: "Powered by AI",
  },
  {
    icon: InfinityIcon,
    title: "No Limits",
    description:
      "Create unlimited projects, pages, and components. No artificial caps. Build as much as your imagination allows.",
    badge: "Unlimited",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description:
      "Go from idea to live website in seconds. One-click deployment to the Internet Computer with global CDN included.",
    badge: "< 1 second",
  },
  {
    icon: Code2,
    title: "Full Stack",
    description:
      "Generate complete frontends, backends, databases, and APIs. Not just static sites — real, production-ready applications.",
    badge: "Frontend + Backend",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Describe Your Vision",
    description:
      "Type what you want to build in natural language. Our AI understands design, functionality, and business context.",
  },
  {
    number: "02",
    title: "AI Builds Instantly",
    description:
      "Watch your website come to life in real-time. Preview, iterate, and refine with simple chat commands.",
  },
  {
    number: "03",
    title: "Deploy Anywhere",
    description:
      "Push live to the Internet Computer, export clean code, or continue customizing. You own everything.",
  },
];

const TEMPLATES = [
  {
    name: "SaaS Landing Page",
    category: "Business",
    preview: "bg-gradient-to-br from-slate-900 to-cyan-950",
  },
  {
    name: "E-Commerce Store",
    category: "Shop",
    preview: "bg-gradient-to-br from-purple-950 to-slate-900",
  },
  {
    name: "Portfolio Site",
    category: "Creative",
    preview: "bg-gradient-to-br from-slate-900 to-indigo-950",
  },
  {
    name: "Blog Platform",
    category: "Content",
    preview: "bg-gradient-to-br from-teal-950 to-slate-900",
  },
  {
    name: "Restaurant Website",
    category: "Local",
    preview: "bg-gradient-to-br from-slate-900 to-orange-950",
  },
  {
    name: "Agency Website",
    category: "Business",
    preview: "bg-gradient-to-br from-violet-950 to-slate-900",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "Perfect for personal projects and exploring what's possible.",
    features: [
      "5 projects",
      "AI chat builder",
      "Basic templates",
      "Community support",
      "ICP deployment",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For builders and creators who need power without limits.",
    features: [
      "Unlimited projects",
      "Priority AI generation",
      "All premium templates",
      "Custom domains",
      "Full-stack generation",
      "Priority support",
      "Export clean code",
    ],
    cta: "Start Pro",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for teams building at scale.",
    features: [
      "Everything in Pro",
      "Dedicated AI capacity",
      "White-label option",
      "Team collaboration",
      "SLA guarantee",
      "Custom integrations",
      "24/7 dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const FAQ = [
  {
    question: "How does the AI website builder actually work?",
    answer:
      "WebCraft AI uses large language models trained specifically on web development patterns. You describe what you want in natural language, and the AI generates complete, production-ready code including HTML, CSS, JavaScript, and backend logic — all deployed on the Internet Computer.",
  },
  {
    question: "Are there really no limits on what I can build?",
    answer:
      "With our Pro and Enterprise plans, you can create unlimited projects with unlimited pages, components, and complexity. The AI handles everything from simple landing pages to complex web applications with databases and authentication.",
  },
  {
    question: "Do I need coding experience to use WebCraft AI?",
    answer:
      "Not at all. WebCraft AI is designed for everyone — from non-technical founders to experienced developers. Simply describe your vision and the AI handles all the code. Developers can also export clean code to customize further.",
  },
  {
    question: "How does deployment work?",
    answer:
      "Your websites are deployed to the Internet Computer blockchain for true decentralization, or you can export your code to host anywhere. Deployment takes under a second after you click the deploy button.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Yes, Pro and Enterprise plans support custom domains. Point your domain's DNS to WebCraft AI and your website will be live on your custom URL immediately.",
  },
  {
    question: "What happens to my projects if I cancel my plan?",
    answer:
      "You always own your projects and code. If you downgrade, your existing projects remain accessible and you can export the code at any time. Nothing is ever deleted.",
  },
];

export default function Landing() {
  const router = useRouter();
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.navigate({ to: "/dashboard" });
    } else {
      login();
    }
  };

  const handleLogin = () => {
    if (isAuthenticated) {
      router.navigate({ to: "/dashboard" });
    } else {
      login();
    }
  };

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen hero-gradient text-foreground overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/70">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              WebCraft <span className="text-gradient-cyan">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="nav.login.button"
            >
              {isAuthenticated ? "Dashboard" : "Log In"}
            </Button>
            <Button
              size="sm"
              onClick={handleGetStarted}
              disabled={isLoggingIn}
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all glow-sm font-medium"
              data-ocid="nav.get_started.button"
            >
              {isLoggingIn ? "Connecting..." : "Get Started"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-ocid="nav.mobile_menu.toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-muted-foreground hover:text-foreground text-left py-2"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                className="flex-1"
              >
                {isAuthenticated ? "Dashboard" : "Log In"}
              </Button>
              <Button
                size="sm"
                onClick={handleGetStarted}
                className="flex-1 bg-primary text-primary-foreground"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Glow orb */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, oklch(0.72 0.12 207) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-8"
            >
              <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 text-sm font-medium">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Now with GPT-4 Vision
              </Badge>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Build Websites <br />
                <span className="text-gradient-cyan">with AI.</span>
                <br />
                <span className="text-foreground">No Limits.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Describe what you want. WebCraft AI builds it — complete,
                production-ready websites with frontend, backend, and
                deployment. All in seconds. No coding required.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={isLoggingIn}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base font-semibold glow-cyan transition-all hover:scale-105"
                  data-ocid="hero.start_building.button"
                >
                  {isLoggingIn ? "Connecting..." : "Start Building Free"}
                  <Rocket className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo("#features")}
                  className="border-border/60 text-foreground hover:bg-muted/50 px-8 text-base"
                  data-ocid="hero.watch_demo.button"
                >
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Deploy in seconds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Truly unlimited</span>
                </div>
              </div>
            </motion.div>

            {/* Right column — CSS UI mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              {/* Main window */}
              <div className="relative card-glass rounded-2xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] border-glow">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  <div className="flex-1 mx-3">
                    <div className="bg-background/50 rounded text-xs text-muted-foreground px-3 py-1 text-center">
                      webcraft.ai/builder
                    </div>
                  </div>
                </div>

                <div className="flex h-64">
                  {/* Chat panel */}
                  <div className="w-1/2 border-r border-border/40 p-3 flex flex-col gap-2">
                    <div className="text-xs text-muted-foreground font-medium mb-1">
                      AI Chat
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <Cpu className="w-3 h-3 text-primary" />
                      </div>
                      <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-foreground/80 leading-relaxed">
                        Hi! I'm WebCraft AI. What would you like to build today?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-primary/20 rounded-lg px-3 py-2 text-xs text-primary leading-relaxed max-w-[80%]">
                        Build me a SaaS landing page with pricing
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <Cpu className="w-3 h-3 text-primary" />
                      </div>
                      <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs text-foreground/80 leading-relaxed">
                        Building your SaaS landing page now...
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-muted/30 rounded text-xs px-2 py-1.5 text-muted-foreground">
                          Message...
                        </div>
                        <div className="bg-primary rounded px-2 py-1.5 text-xs text-primary-foreground font-medium">
                          Build
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview panel */}
                  <div className="w-1/2 p-3">
                    <div className="text-xs text-muted-foreground font-medium mb-2">
                      Preview
                    </div>
                    <div className="h-full rounded-lg overflow-hidden preview-gradient opacity-80">
                      <div className="p-3 space-y-2">
                        <div className="h-2.5 bg-foreground/20 rounded-full w-3/4" />
                        <div className="h-2 bg-foreground/10 rounded-full w-full" />
                        <div className="h-2 bg-foreground/10 rounded-full w-5/6" />
                        <div className="flex gap-2 mt-3">
                          <div className="h-7 bg-primary/40 rounded flex-1" />
                          <div className="h-7 bg-foreground/10 rounded flex-1" />
                        </div>
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          <div className="h-10 bg-foreground/10 rounded" />
                          <div className="h-10 bg-foreground/10 rounded" />
                          <div className="h-10 bg-foreground/10 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge 1 */}
              <div className="animate-float absolute -top-6 -right-6 card-glass rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Built in 3s
                    </div>
                    <div className="text-xs text-muted-foreground">
                      SaaS Landing Page
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="animate-float-delayed absolute -bottom-6 -left-6 card-glass rounded-xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Live Deployed
                    </div>
                    <div className="text-xs text-muted-foreground">
                      on Internet Computer
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof Strip */}
        <section className="border-y border-border/30 py-10 px-4 sm:px-6 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-8">
              Trusted by innovative builders worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                { label: "10,000+", sub: "Websites Built" },
                { label: "500+", sub: "Active Teams" },
                { label: "< 3s", sub: "Avg Build Time" },
                { label: "99.9%", sub: "Uptime SLA" },
                { label: "∞", sub: "No Limits" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="card-glass rounded-xl px-6 py-4 text-center min-w-[120px]"
                >
                  <div className="text-xl font-bold text-gradient-cyan">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">
                Everything You Need
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Built for the Future of Web
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                WebCraft AI combines cutting-edge AI with the Internet Computer
                to give you capabilities no other builder offers.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card-glass rounded-2xl p-6 hover:border-primary/40 transition-all group cursor-default"
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs mb-3">
                    {feature.badge}
                  </Badge>
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/5">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="bg-secondary/10 text-secondary border-secondary/30 mb-4">
                How It Works
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
                From Idea to Live in{" "}
                <span className="text-gradient-cyan">Seconds</span>
              </h2>
            </motion.div>

            <div className="relative">
              {/* Connector line */}
              <div className="absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

              <div className="grid sm:grid-cols-3 gap-8">
                {STEPS.map((step, i) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="relative text-center"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl card-glass border-glow flex items-center justify-center">
                      <span className="font-display text-3xl font-black text-gradient-cyan">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-xl mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Templates */}
        <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">
                Templates
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Start with a Template,{" "}
                <span className="text-gradient-cyan">Make It Yours</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Choose a starting point and let AI customize it to your exact
                needs.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TEMPLATES.map((tmpl, i) => (
                <motion.div
                  key={tmpl.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="card-glass rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/40 transition-all hover:scale-[1.02]"
                  data-ocid={`templates.item.${i + 1}`}
                >
                  <div
                    className={`h-40 ${tmpl.preview} relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/40 backdrop-blur-sm">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                      >
                        Use Template
                      </Button>
                    </div>
                    {/* Mini wireframe */}
                    <div className="p-4 space-y-2 opacity-30">
                      <div className="h-2 bg-white rounded w-2/3" />
                      <div className="h-1.5 bg-white rounded w-full" />
                      <div className="h-1.5 bg-white rounded w-4/5" />
                      <div className="flex gap-2 mt-3">
                        <div className="h-6 bg-white/50 rounded flex-1" />
                        <div className="h-6 bg-white/20 rounded flex-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <Badge className="text-xs bg-muted/60 text-muted-foreground border-border/40 mb-2">
                      {tmpl.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground">
                      {tmpl.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">
                Pricing
              </Badge>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Simple, Honest Pricing
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                No hidden fees. No per-page charges. No artificial limits on
                what you can build.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6">
              {PRICING.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    plan.highlighted
                      ? "border-glow glow-cyan bg-card shadow-glow-md"
                      : "card-glass"
                  }`}
                  data-ocid={`pricing.item.${i + 1}`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground border-0 text-xs font-semibold px-3">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1">
                      {plan.name}
                    </h3>
                    <div className="flex items-end gap-1 my-3">
                      <span className="font-display text-4xl font-black text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm pb-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleGetStarted}
                    className={`w-full font-semibold ${
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border/60 bg-muted/20 text-foreground hover:bg-muted/40"
                    }`}
                    data-ocid={`pricing.cta.${i + 1}.button`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="bg-primary/10 text-primary border-primary/30 mb-4">
                FAQ
              </Badge>
              <h2 className="font-display text-4xl font-bold text-foreground">
                Questions? Answered.
              </h2>
            </motion.div>

            <Accordion
              type="single"
              collapsible
              className="space-y-3"
              data-ocid="faq.list"
            >
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={item.question}
                  value={`item-${i}`}
                  className="card-glass rounded-xl border-border/40 px-6 overflow-hidden"
                  data-ocid={`faq.item.${i + 1}`}
                >
                  <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-5 hover:text-primary transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-glass rounded-3xl p-12 text-center border-glow glow-cyan"
            >
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Ready to Build Without{" "}
                <span className="text-gradient-cyan">Limits?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of builders creating the web of tomorrow with
                WebCraft AI.
              </p>
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 text-base font-semibold glow-cyan transition-all hover:scale-105"
                data-ocid="cta_banner.start_building.button"
              >
                {isLoggingIn ? "Connecting..." : "Start Building Free"}
                <Rocket className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-16 px-4 sm:px-6 lg:px-8 bg-muted/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="font-display font-bold text-lg text-foreground">
                  WebCraft <span className="text-gradient-cyan">AI</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build unlimited websites with the power of AI. No limits, no
                compromise.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                Product
              </h4>
              <ul className="space-y-2">
                {[
                  "Features",
                  "Templates",
                  "Pricing",
                  "Changelog",
                  "Roadmap",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                Company
              </h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Press", "Partners"].map(
                  (item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                      >
                        {item}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">
                Legal
              </h4>
              <ul className="space-y-2">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Security",
                ].map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} WebCraft AI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

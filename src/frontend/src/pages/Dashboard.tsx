import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
  Edit3,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Project } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ProjectStatus,
  useCreateProject,
  useDeleteProject,
  useGetCallerUserProfile,
  useGetUserProjects,
  useSaveUserProfile,
} from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusColor(status: ProjectStatus) {
  switch (status) {
    case ProjectStatus.published:
      return "bg-green-500/15 text-green-400 border-green-500/30";
    case ProjectStatus.active:
      return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    case ProjectStatus.draft:
      return "bg-muted/40 text-muted-foreground border-border/40";
    default:
      return "bg-muted/40 text-muted-foreground border-border/40";
  }
}

function LoginPrompt({
  onLogin,
  isLoggingIn,
}: { onLogin: () => void; isLoggingIn: boolean }) {
  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card-glass rounded-3xl p-10 max-w-md w-full text-center border-glow"
        data-ocid="auth.dialog"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-3">
          Welcome to WebCraft AI
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Connect with Internet Identity to access your dashboard and start
          building unlimited websites with AI.
        </p>
        <Button
          size="lg"
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan font-semibold text-base"
          data-ocid="auth.login.button"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Connect with Internet Identity
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Secure, decentralized authentication. No passwords.
        </p>
      </motion.div>
    </div>
  );
}

function ProfileSetupModal({
  open,
  onSave,
  isPending,
}: {
  open: boolean;
  onSave: (name: string) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-card border-border/40 sm:max-w-md"
        data-ocid="profile_setup.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground font-display text-xl">
            Set Up Your Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Welcome! What should we call you?
          </p>
          <div className="space-y-2">
            <Label htmlFor="profile-name" className="text-foreground">
              Your Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="bg-input border-border/40 text-foreground"
              onKeyDown={(e) =>
                e.key === "Enter" && name.trim() && onSave(name.trim())
              }
              data-ocid="profile_setup.name.input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim() || isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-ocid="profile_setup.save.button"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal() ?? null;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const { data: projects, isLoading: projectsLoading } =
    useGetUserProjects(principal);
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const saveProfile = useSaveUserProfile();

  const [showNewProject, setShowNewProject] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectStatus, setNewProjectStatus] = useState<ProjectStatus>(
    ProjectStatus.draft,
  );

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;
  const displayName =
    userProfile?.name ??
    (principal ? `${principal.toString().slice(0, 12)}...` : "User");

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    router.navigate({ to: "/" });
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const id = await createProject.mutateAsync({
        name: newProjectName.trim(),
        description: newProjectDesc.trim(),
        status: newProjectStatus,
        config: "{}",
      });
      toast.success("Project created!");
      setShowNewProject(false);
      setNewProjectName("");
      setNewProjectDesc("");
      setNewProjectStatus(ProjectStatus.draft);
      router.navigate({ to: `/builder/${id}` });
    } catch {
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject.mutateAsync(deleteTarget.id);
      toast.success("Project deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  const handleSaveProfile = async (name: string) => {
    try {
      await saveProfile.mutateAsync({ name });
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onLogin={login} isLoggingIn={isLoggingIn} />;
  }

  return (
    <div className="min-h-screen hero-gradient text-foreground">
      <ProfileSetupModal
        open={showProfileSetup}
        onSave={handleSaveProfile}
        isPending={saveProfile.isPending}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-md bg-background/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg text-foreground hidden sm:block">
              WebCraft <span className="text-gradient-cyan">AI</span>
            </span>
            <div className="w-px h-5 bg-border/40 mx-1 hidden sm:block" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground hidden sm:block">
              {displayName}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-2"
              data-ocid="dashboard.logout.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Projects
            </h1>
            <p className="text-muted-foreground mt-1">
              {projectsLoading
                ? "Loading..."
                : `${projects?.length ?? 0} project${(projects?.length ?? 0) !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            onClick={() => setShowNewProject(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan gap-2 font-semibold"
            data-ocid="dashboard.new_project.button"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>

        {/* Projects grid */}
        {projectsLoading ? (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="dashboard.loading_state"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-glass rounded-2xl p-6 space-y-4">
                <Skeleton className="h-5 w-2/3 bg-muted/40" />
                <Skeleton className="h-4 w-full bg-muted/30" />
                <Skeleton className="h-4 w-1/2 bg-muted/30" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 bg-muted/40" />
                  <Skeleton className="h-8 w-20 bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glass rounded-3xl p-16 text-center border-dashed border-2 border-border/30"
            data-ocid="dashboard.empty_state"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-primary/60" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              No Projects Yet
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Create your first AI-powered website. Describe what you want and
              watch it come to life.
            </p>
            <Button
              onClick={() => setShowNewProject(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan gap-2"
              data-ocid="dashboard.empty_state.create.button"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {projects.map((project, i) => (
                <motion.div
                  key={project.id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                  className="card-glass rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 transition-all group"
                  data-ocid={`dashboard.project.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate text-lg">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      className={`flex-shrink-0 text-xs capitalize ${statusColor(project.status)}`}
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Created {formatDate(project.createdAt)}
                  </div>

                  <div className="flex gap-2 mt-auto pt-2 border-t border-border/30">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-foreground hover:bg-primary/10 hover:text-primary gap-1.5"
                      onClick={() =>
                        router.navigate({ to: `/builder/${project.id}` })
                      }
                      data-ocid={`dashboard.project.edit.${i + 1}.button`}
                    >
                      <Edit3 className="w-4 h-4" />
                      Open Builder
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleteTarget(project)}
                      data-ocid={`dashboard.project.delete.${i + 1}.button`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* New Project Dialog */}
      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
        <DialogContent
          className="bg-card border-border/40 sm:max-w-lg"
          data-ocid="new_project.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground">
              Create New Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="text-foreground">
                Project Name *
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Awesome Website"
                className="bg-input border-border/40 text-foreground"
                data-ocid="new_project.name.input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-desc" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="project-desc"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="A brief description of what you want to build..."
                className="bg-input border-border/40 text-foreground resize-none"
                rows={3}
                data-ocid="new_project.description.textarea"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Initial Status</Label>
              <Select
                value={newProjectStatus}
                onValueChange={(v) => setNewProjectStatus(v as ProjectStatus)}
              >
                <SelectTrigger
                  className="bg-input border-border/40 text-foreground"
                  data-ocid="new_project.status.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/40">
                  <SelectItem value={ProjectStatus.draft}>Draft</SelectItem>
                  <SelectItem value={ProjectStatus.active}>Active</SelectItem>
                  <SelectItem value={ProjectStatus.published}>
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowNewProject(false)}
              className="text-muted-foreground"
              data-ocid="new_project.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || createProject.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="new_project.submit.button"
            >
              {createProject.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Create & Open Builder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent
          className="bg-card border-border/40"
          data-ocid="delete_project.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="text-foreground font-medium">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border/40 text-foreground hover:bg-muted/30"
              data-ocid="delete_project.cancel.button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="delete_project.confirm.button"
            >
              {deleteProject.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 px-4 mt-10 text-center">
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
      </footer>
    </div>
  );
}

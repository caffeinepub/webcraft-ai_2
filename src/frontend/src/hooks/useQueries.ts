import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Project, ProjectInput, UserProfile } from "../backend";
import { ProjectStatus } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetUserProjects(principal?: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["userProjects", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const projects = await actor.getUserProjects(principal);
      return projects.filter((p) => !p.isDeleted);
    },
    enabled: !!actor && !actorFetching && !!principal,
  });
}

export function useGetProject(projectId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<Project | null>({
    queryKey: ["project", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === null) return null;
      try {
        return await actor.getProject(projectId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && projectId !== null,
  });
}

export function useGetTotalProjects() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalProjects"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalProjectsCreated();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectInput) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createProject(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({ queryKey: ["totalProjects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      input,
    }: { projectId: bigint; input: ProjectInput }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProject(projectId, input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["userProjects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId.toString()],
      });
    },
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export { ProjectStatus };

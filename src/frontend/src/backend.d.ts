import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProjectInput {
    status: ProjectStatus;
    name: string;
    description: string;
    config: string;
}
export interface Project {
    id: bigint;
    status: ProjectStatus;
    isDeleted: boolean;
    owner: Principal;
    name: string;
    createdAt: bigint;
    description: string;
    config: string;
}
export interface UserProfile {
    name: string;
}
export enum ProjectStatus {
    active = "active",
    published = "published",
    draft = "draft"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(input: ProjectInput): Promise<bigint>;
    deleteProject(projectId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(projectId: bigint): Promise<Project>;
    getTotalProjectsCreated(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjectCount(user: Principal): Promise<bigint>;
    getUserProjects(user: Principal): Promise<Array<Project>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProject(projectId: bigint, input: ProjectInput): Promise<void>;
}

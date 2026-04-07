import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type ProjectStatus = { #active; #draft; #published };

  public type Project = {
    id : Nat;
    owner : Principal;
    name : Text;
    description : Text;
    createdAt : Int;
    status : ProjectStatus;
    config : Text;
    isDeleted : Bool;
  };

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  public type ProjectInput = {
    name : Text;
    description : Text;
    status : ProjectStatus;
    config : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let projects = Map.empty<Nat, Project>();
  var nextProjectId = 1;
  let projectCountByUser = Map.empty<Principal, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project management functions
  public shared ({ caller }) func createProject(input : ProjectInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };

    let projectId = nextProjectId;
    let newProject : Project = {
      id = projectId;
      owner = caller;
      name = input.name;
      description = input.description;
      createdAt = Time.now();
      status = input.status;
      config = input.config;
      isDeleted = false;
    };

    projects.add(projectId, newProject);
    nextProjectId += 1;
    let currentCount = switch (projectCountByUser.get(caller)) {
      case (null) { 0 };
      case (?count) { count };
    };
    projectCountByUser.add(caller, currentCount + 1);
    projectId;
  };

  public query ({ caller }) func getProject(projectId : Nat) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        if (project.isDeleted == true) {
          Runtime.trap("Project has been deleted!");
        };
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only owner or admin can view this project");
        };
        project;
      };
    };
  };

  public shared ({ caller }) func updateProject(projectId : Nat, input : ProjectInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update projects");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?existingProject) {
        if (existingProject.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only owner or admin can update this project");
        };
        if (existingProject.isDeleted == true) {
          Runtime.trap("Project has already been deleted!");
        };
        let updatedProject = {
          existingProject with
          name = input.name;
          description = input.description;
          status = input.status;
          config = input.config;
        };
        projects.add(projectId, updatedProject);
      };
    };
  };

  public shared ({ caller }) func deleteProject(projectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete projects");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found!") };
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only owner or admin can delete this project");
        };
        if (project.isDeleted == true) {
          Runtime.trap("Project has already been deleted!");
        };
        let updatedProject = { project with isDeleted = true };
        projects.add(projectId, updatedProject);
        switch (projectCountByUser.get(project.owner)) {
          case (null) {};
          case (?count) {
            projectCountByUser.add(project.owner, if (count > 0) { count - 1 } else { 0 });
          };
        };
      };
    };
  };

  public query ({ caller }) func getUserProjects(user : Principal) : async [Project] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };

    let filteredProjects = projects.values().toArray().filter(
      func(p) {
        (not p.isDeleted) and p.owner == user;
      }
    );
    filteredProjects.sort();
  };

  public query ({ caller }) func getTotalProjectsCreated() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statistics");
    };
    projects.size();
  };

  public query ({ caller }) func getUserProjectCount(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own project count");
    };

    switch (projectCountByUser.get(user)) {
      case (null) { 0 };
      case (?count) { count };
    };
  };
};

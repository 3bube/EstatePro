"use client";

import { useState } from "react";
import { RoleList } from "@/components/RoleList";
import { RoleEditModal } from "@/components/RoleEditModal";
import { PermissionMatrix } from "@/components/PermissionMatrix";
import { UserRoleAssignments } from "@/components/UserRoleAssignments";
import { RoleHierarchyVisualization } from "@/components/RoleHierarchyVisualization";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  parentRole?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function RoleAccessManagementPage() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "1",
      name: "Admin",
      description: "Full access to all features",
      permissions: ["all"],
      parentRole: "",
    },
    {
      id: "2",
      name: "Manager",
      description: "Manage properties and users",
      permissions: ["manage_properties", "manage_users"],
      parentRole: "1",
    },
    {
      id: "3",
      name: "Agent",
      description: "List and manage own properties",
      permissions: ["list_properties", "edit_own_properties"],
      parentRole: "2",
    },
    {
      id: "4",
      name: "User",
      description: "Basic user access",
      permissions: ["view_properties"],
      parentRole: "3",
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com", role: "1" },
    { id: "2", name: "Jane Smith", email: "jane@example.com", role: "2" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "3" },
    { id: "4", name: "Alice Brown", email: "alice@example.com", role: "4" },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsEditModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleSaveRole = (role: Role) => {
    if (role.id) {
      setRoles(roles.map((r) => (r.id === role.id ? role : r)));
    } else {
      const newRole = { ...role, id: (roles.length + 1).toString() };
      setRoles([...roles, newRole]);
    }
    setIsEditModalOpen(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
    setUsers(users.map((u) => (u.role === roleId ? { ...u, role: "4" } : u))); // Assign deleted role users to 'User' role
  };

  const handleCloneRole = (role: Role) => {
    const clonedRole = {
      ...role,
      id: (roles.length + 1).toString(),
      name: `${role.name} (Clone)`,
    };
    setRoles([...roles, clonedRole]);
  };

  const handleUpdatePermissions = (roleId: string, permissions: string[]) => {
    setRoles(roles.map((r) => (r.id === roleId ? { ...r, permissions } : r)));
  };

  const handleUpdateUserRole = (userId: string, roleId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: roleId } : u)));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Role & Access Management</h1>

      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          <TabsTrigger value="hierarchy">Role Hierarchy</TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <div className="mb-4">
            <Button onClick={handleCreateRole}>Create New Role</Button>
          </div>
          <RoleList
            roles={roles}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            onCloneRole={handleCloneRole}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionMatrix
            roles={roles}
            onUpdatePermissions={handleUpdatePermissions}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <UserRoleAssignments
            users={users}
            roles={roles}
            onUpdateUserRole={handleUpdateUserRole}
          />
        </TabsContent>

        <TabsContent value="hierarchy">
          <RoleHierarchyVisualization roles={roles} />
        </TabsContent>
      </Tabs>

      {isEditModalOpen && (
        <RoleEditModal
          role={selectedRole}
          roles={roles}
          onSave={handleSaveRole}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

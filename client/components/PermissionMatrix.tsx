import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Role = {
  id: string;
  name: string;
  permissions: string[];
};

type PermissionMatrixProps = {
  roles: Role[];
  onUpdatePermissions: (roleId: string, permissions: string[]) => void;
};

const allPermissions = [
  "view_properties",
  "edit_properties",
  "delete_properties",
  "manage_users",
  "manage_roles",
  "view_reports",
  "edit_settings",
];

export function PermissionMatrix({
  roles,
  onUpdatePermissions,
}: PermissionMatrixProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >(roles.reduce((acc, role) => ({ ...acc, [role.id]: role.permissions }), {}));

  const handlePermissionChange = (roleId: string, permission: string) => {
    const updatedPermissions = selectedPermissions[roleId].includes(permission)
      ? selectedPermissions[roleId].filter((p) => p !== permission)
      : [...selectedPermissions[roleId], permission];

    setSelectedPermissions({
      ...selectedPermissions,
      [roleId]: updatedPermissions,
    });
  };

  const handleSavePermissions = (roleId: string) => {
    onUpdatePermissions(roleId, selectedPermissions[roleId]);
  };

  const handleBulkUpdate = (
    roleId: string,
    action: "selectAll" | "deselectAll"
  ) => {
    const updatedPermissions =
      action === "selectAll" ? [...allPermissions] : [];
    setSelectedPermissions({
      ...selectedPermissions,
      [roleId]: updatedPermissions,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Permission</TableHead>
          {roles.map((role) => (
            <TableHead key={role.id}>{role.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {allPermissions.map((permission) => (
          <TableRow key={permission}>
            <TableCell>{permission}</TableCell>
            {roles.map((role) => (
              <TableCell key={`${role.id}-${permission}`}>
                <Checkbox
                  checked={selectedPermissions[role.id].includes(permission)}
                  onCheckedChange={() =>
                    handlePermissionChange(role.id, permission)
                  }
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
        <TableRow>
          <TableCell>Actions</TableCell>
          {roles.map((role) => (
            <TableCell key={`${role.id}-actions`}>
              <div className="space-y-2">
                <Button
                  onClick={() => handleSavePermissions(role.id)}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  onClick={() => handleBulkUpdate(role.id, "selectAll")}
                  size="sm"
                  variant="outline"
                >
                  Select All
                </Button>
                <Button
                  onClick={() => handleBulkUpdate(role.id, "deselectAll")}
                  size="sm"
                  variant="outline"
                >
                  Deselect All
                </Button>
              </div>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}

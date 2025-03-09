"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  parentRole?: string;
};

type RoleEditModalProps = {
  role: Role | null;
  roles: Role[];
  onSave: (role: Role) => void;
  onClose: () => void;
};

export function RoleEditModal({
  role,
  roles,
  onSave,
  onClose,
}: RoleEditModalProps) {
  const [editedRole, setEditedRole] = useState<Role>({
    id: "",
    name: "",
    description: "",
    permissions: [],
    parentRole: "",
  });

  useEffect(() => {
    if (role) {
      setEditedRole(role);
    } else {
      setEditedRole({
        id: "",
        name: "",
        description: "",
        permissions: [],
        parentRole: "",
      });
    }
  }, [role]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedRole({ ...editedRole, [e.target.name]: e.target.value });
  };

  const handleParentRoleChange = (value: string) => {
    setEditedRole({ ...editedRole, parentRole: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRole);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create New Role"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editedRole.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedRole.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parentRole" className="text-right">
                Parent Role
              </Label>
              <Select
                value={editedRole.parentRole}
                onValueChange={handleParentRoleChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select parent role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {roles
                    .filter((r) => r.id !== editedRole.id)
                    .map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

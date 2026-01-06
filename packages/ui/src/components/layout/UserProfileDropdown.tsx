/**
 * User Profile Dropdown Component
 */

import { Avatar } from "../ui/avatar";
import { Dropdown, DropdownItem } from "../ui/dropdown";
import { HiChevronDown } from "react-icons/hi";
import { useAuth } from "../../hooks/auth/useAuth";

export function UserProfileDropdown() {
  const { user, logout } = useAuth();

  const userName = user?.name || user?.email || "Usuario";
  const userEmail = user?.email || "";

  return (
    <Dropdown
      trigger={
        <button className="btn btn-ghost gap-2">
          <Avatar name={userName} size="lg" />
          <span className="hidden md:inline text-sm font-medium">{userName}</span>
          <HiChevronDown className="w-4 h-4" />
        </button>
      }
    >
      <DropdownItem>
        <div className="flex flex-col">
          <span className="font-semibold">{userName}</span>
          {userEmail && <span className="text-xs text-base-content/60">{userEmail}</span>}
        </div>
      </DropdownItem>
      <DropdownItem onClick={logout}>
        <span>Cerrar Sesión</span>
      </DropdownItem>
    </Dropdown>
  );
}

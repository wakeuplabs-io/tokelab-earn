/**
 * Header Component
 */

import { Badge } from "../ui/badge";
import { HiBell, HiMenu } from "react-icons/hi";
import { LanguageSelector } from "./LanguageSelector";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-base-100 shadow-[0_15px_30px_-30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between h-24 px-4 md:px-6">
        {/* Left: Logo (mobile) and Menu Button */}
        <div className="flex items-center gap-4">
          {/* Hamburger menu button (mobile only) */}
          <button
            className="menu-button md:hidden btn btn-ghost btn-sm"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <HiMenu className="w-6 h-6" />
          </button>

          {/* Logo (mobile only) */}
          <span className="md:hidden text-lg font-bold text-primary">tokelab EARN</span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <button className="btn btn-ghost btn-circle relative">
            <HiBell className="w-5 h-5" />
            <Badge
              variant="error"
              size="xs"
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
            >
              3
            </Badge>
          </button>

          {/* Language Selector */}
          <LanguageSelector />

          {/* User Profile */}
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
}

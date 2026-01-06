/**
 * Sidebar Component
 */

import { Link, useLocation } from "@tanstack/react-router";
import {
  HiOutlineHome,
  HiOutlineCurrencyDollar,
  HiOutlineCreditCard,
  HiOutlineArrowDown,
  HiOutlineCheck,
  HiOutlineChartBar,
  HiOutlineQuestionMarkCircle,
  HiLogout,
} from "react-icons/hi";
import { useAuth } from "../../hooks/auth/useAuth";
import clsx from "clsx";
import logo from "../../assets/logo.svg";

export interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  { label: "Inicio", path: "/", icon: <HiOutlineHome className="w-6 h-6" /> },
  { label: "Invertir", path: "/invest", icon: <HiOutlineCurrencyDollar className="w-6 h-6" /> },
  { label: "Ingresar capital", path: "/deposit", icon: <HiOutlineCreditCard className="w-6 h-6" /> },
  { label: "Retirar Capital", path: "/withdraw", icon: <HiOutlineArrowDown className="w-6 h-6" /> },
  { label: "Inversiones activas", path: "/active-investments", icon: <HiOutlineCheck className="w-6 h-6" /> },
  { label: "Reportes", path: "/reports", icon: <HiOutlineChartBar className="w-6 h-6" /> },
  { label: "Ayuda", path: "/help", icon: <HiOutlineQuestionMarkCircle className="w-6 h-6" /> },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "sidebar fixed left-0 top-0 h-full z-50",
          "bg-base-100 ",
          "transition-transform duration-300 ease-in-out",
          "md:translate-x-0 md:relative md:z-auto",
          "w-[300px] shrink-0",
          "shadow-[0px_8px_8px_-4px_#10182808,0px_20px_24px_-4px_#00000040]",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-base-300 h-24 flex items-center">
            <Link to="/" className="">
              <img src={logo} alt="tokelab EARN" className="" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="menu menu-vertical w-full">
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={clsx(
                      "flex items-center gap-4 p-4 rounded-lg",
                      "transition-colors",
                      "text-base",
                      {
                        "text-primary-focus font-bold": isActive(item.path),
                        "hover:bg-base-200 font-semibold   text-neutral-l-grey": !isActive(item.path),
                      }
                    )}
                    onClick={onClose}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={() => {
                logout();
                onClose?.();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-base-200 transition-colors text-error"
            >
              <span className="flex-shrink-0">
                <HiLogout className="w-5 h-5" />
              </span>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}


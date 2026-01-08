import { Dropdown, DropdownItem } from "../ui/dropdown";
import { HiChevronDown } from "react-icons/hi";

export function LanguageSelector() {
  return (
    <Dropdown
      trigger={
        <button className="btn btn-ghost btn-sm gap-2">
          <span className="text-sm">ES</span>
          <span className="text-xs">🇪🇸</span>
          <HiChevronDown className="w-4 h-4" />
        </button>
      }
      align="right"
    >
      <DropdownItem>
        <div className="flex items-center gap-2">
          <span>🇪🇸</span>
          <span>Español</span>
        </div>
      </DropdownItem>
      <DropdownItem>
        <div className="flex items-center gap-2">
          <span>🇺🇸</span>
          <span>English</span>
        </div>
      </DropdownItem>
    </Dropdown>
  );
}

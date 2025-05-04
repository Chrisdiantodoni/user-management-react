import { Input } from "@/components/ui/input";
import { ChangeEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string | any;
  onChange: (value: string) => void;
  placeholder: string;
}

export const SearchBar = ({ value, onChange, placeholder }: SearchBarProps) => {
  // handling change on search bar
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative max-w-xl">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className="pr-10 bg-white dark:bg-gray-900"
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};

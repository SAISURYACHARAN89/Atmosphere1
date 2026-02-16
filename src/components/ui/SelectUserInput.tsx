import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/hooks/users/useGetUsers";
import useDebounce from "@/hooks/useDebounce";


type User = {
  _id: string;
  username: string;
};

type Props = {
  label?: string;
  placeholder?: string;
  onSelect: (user: { id: string; name: string }) => void;
};
const SelectUserInput=({
  label,
  placeholder = "Search user...",
  onSelect,
}: Props) =>{
  const [query, setQuery] = useState("");

  const debouncedQuery = useDebounce(query, 400);

  const searchQuery =
    debouncedQuery.length >= 3 ? debouncedQuery : "";

  const { data: users = [], isFetching } =
    useSearchUsers(searchQuery);

  const handleSelect = (user: User) => {
    onSelect({ id: user._id, name: user.username });
    setQuery(user.username);
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs text-muted-foreground mb-2">
          {label}
        </label>
      )}

      <Input
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-input border-border"
      />

      {searchQuery && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-black shadow-xl max-h-56 overflow-y-auto">
          {isFetching && (
            <div className="p-3 text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isFetching && users.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No users found
            </div>
          )}

          {users.map((user: User) => (
            <button
              key={user._id}
              onClick={() => handleSelect(user)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 transition"
            >
              {user.username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectUserInput
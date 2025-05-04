import { Label } from "@/components/ui/label";
import { SearchBar } from "@/components/ui/Searchbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import users from "@/services/api/users";
import queryString from "@/utils/queryString";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queryStrings from "query-string";
import { PaginationComponent } from "@/components/ui/pagination-component";
import { DataTable } from "@/components/ui/table-component";
import { UsersProps } from "./type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import createStore from "@/store";
import { UserDialog } from "./components/UserDialog";
import { Badge } from "@/components/ui/badge";

function User() {
  const { page, limit, q } = queryStrings.parse(location.search);
  const { handleModal } = createStore();

  const [paging, setPaging] = useState({
    currentPage: Number(page) || 1,
    totalPage: Number(limit) || 10,
  });
  const [search, setSearch] = useState(q);
  const debouncedSearchValue = useDebounce(search, 500);

  const resultQueryString = queryString.stringified({
    q: debouncedSearchValue,
    limit: paging.totalPage,
    page: paging.currentPage,
  });
  const navigate = useNavigate();
  const urlLocation = useLocation();

  const { data, isFetching, refetch } = useQuery<UsersProps>({
    queryKey: ["getUserList", resultQueryString],
    queryFn: async () => {
      const response = await users.getListUser(resultQueryString);
      return response;
    },
  });

  useEffect(() => {
    const resultQueryString = queryString.stringified({
      limit: paging.totalPage,
      q: debouncedSearchValue,
      page: paging.currentPage,
    });

    navigate(`${urlLocation.pathname}?${resultQueryString}`, { replace: true });
  }, [debouncedSearchValue, paging.currentPage, paging.totalPage]);

  const handleSearch = (e: string) => {
    setSearch(e);

    setPaging((prev: any) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageSize = async (total: number) => {
    await setPaging((prev: any) => ({
      ...prev,
      totalPage: total,
      currentPage: 1,
    }));
    await refetch();
  };

  const handlePageChange = async (newPage: number) => {
    await setPaging((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
    await refetch();
  };

  return (
    <div>
      <UserDialog />
      <DeleteUserDialog />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="whitespace-nowrap">Show</Label>
          <Select
            onValueChange={(value) => handlePageSize(Number(value))}
            value={String(paging.totalPage)}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label className="whitespace-nowrap">Entries</Label>
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="w-full sm:max-w-xs">
            <SearchBar
              placeholder="Search name, username..."
              value={search}
              onChange={(e) => handleSearch(e)}
            />
          </div>
          <Button
            variant="default"
            onClick={() => handleModal("modalUser", true)}
            className="whitespace-nowrap"
          >
            + Add User
          </Button>
        </div>
      </div>

      <div>
        <DataTable
          isLoading={isFetching}
          columns={columns}
          data={data?.data?.data?.map((item, index) => ({
            ...item,
            no: (paging.currentPage - 1) * paging.currentPage + index + 1,
            user_status: (
              <Badge
                variant={
                  item?.user_status == "Active"
                    ? "default"
                    : item?.user_status == "Inactive"
                    ? "outline"
                    : "destructive"
                }
              >
                {item?.user_status
                  ? item?.user_status.charAt(0).toUpperCase() +
                    item?.user_status.slice(1)
                  : "-"}
              </Badge>
            ),
            action: (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/user-list/${item?.id}`)}
                  >
                    View User
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-700 "
                    onClick={() => {
                      handleModal("modalDeleteUser", true, item?.id);
                    }}
                  >
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          }))}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Label className="whitespace-nowrap">
            Show {paging.totalPage} entries from total {data?.data?.total}{" "}
            entries
          </Label>
        </div>
        <div className="mt-2">
          <PaginationComponent
            currentPage={paging.currentPage}
            totalPages={Number(data?.data?.last_page)} // Calculate total pages from filtered data
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}

export default User;

const columns = [
  { header: "No.", accessor: "no" },
  { header: "Name", accessor: "name" },
  { header: "Username", accessor: "username" },
  { header: "Password Reset At", accessor: "password_reset_at" },
  { header: "Status", accessor: "user_status" },
  { header: "Action", accessor: "action" },
];

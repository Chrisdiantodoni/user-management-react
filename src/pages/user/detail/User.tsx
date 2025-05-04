import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserDetailprops } from "../type";
import users from "@/services/api/users";
import Loader from "@/components/ui/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import useStore from "@/store";
import { ResetPasswordDialog } from "../components/ResetPasswordDialog";
import { toast } from "sonner";
import { UserDialog } from "../components/UserDialog";

function User() {
  const { id } = useParams();
  const { handleModal } = useStore();
  const { data, isFetching, refetch } = useQuery<UserDetailprops>({
    queryKey: ["getDetailUser", id],
    queryFn: async () => {
      const response = await users.getDetailUser(id);
      return response;
    },
    enabled: !!id,
  });
  const user = data?.data;

  const [status, setStatus] = useState<"Active" | "Inactive" | undefined>(
    undefined
  );

  // Sinkronisasi status ketika user data tersedia
  useEffect(() => {
    if (user?.user_status === "Active" || user?.user_status === "Inactive") {
      setStatus(user.user_status);
    }
  }, [user]);

  const { mutate } = useMutation({
    mutationFn: async (newStatus: "Active" | "Inactive") => {
      const body = { status: newStatus };
      const response = await users.updateUserStatus(body, id!);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("User status updated successfully.");
        refetch();
      } else {
        if (
          user?.user_status === "Active" ||
          user?.user_status === "Inactive"
        ) {
          setStatus(user.user_status);
        }
        toast.error(
          `Failed to update user status.\n${res?.response?.data?.data}`
        );
      }
    },
    onError: (res: any) => {
      console.error(res);
      toast.error(
        `Failed to update user status.\n${res?.response?.data?.data || ""}`
      );
      if (user?.user_status === "Active" || user?.user_status === "Inactive") {
        setStatus(user.user_status);
      }
    },
  });

  const handleStatusChange = () => {
    const newStatus = status === "Active" ? "Inactive" : "Active";
    setStatus(newStatus);
    mutate(newStatus);
  };

  return isFetching ? (
    <Loader />
  ) : (
    <Card className="w-full max-w-md">
      <ResetPasswordDialog />
      <UserDialog />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          User Details
        </CardTitle>
        <CardDescription>View and manage user information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-base font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Username
            </p>
            <p className="text-base font-medium">{user?.username}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                user?.user_status == "Active"
                  ? "default"
                  : user?.user_status == "Inactive"
                  ? "outline"
                  : "destructive"
              }
            >
              {user?.user_status
                ? user.user_status.charAt(0).toUpperCase() +
                  user.user_status.slice(1)
                : "-"}
            </Badge>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground">
            Password Status
          </p>
          <div className="flex items-center gap-2">
            {user?.password_reset_at ? (
              <div className="flex items-center gap-1.5 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>Password has been reset</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>Password has not been reset</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="flex items-center justify-between w-full">
          <Label htmlFor="user-status" className="cursor-pointer">
            Toggle user status
          </Label>
          <Switch
            id="user-status"
            checked={status === "Active"}
            onCheckedChange={handleStatusChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-5 w-full">
          <Button
            variant="default"
            className="w-full"
            onClick={() => handleModal("modalUser", true, user)}
          >
            Edit User
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleModal("modalResetPassword", true, user?.id)}
          >
            Reset Password
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default User;

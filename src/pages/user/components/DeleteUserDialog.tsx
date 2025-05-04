import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/ui/LoadingButton";
import users from "@/services/api/users";
import createStore from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function DeleteUserDialog() {
  const { handleModal, modal, modalItem } = createStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await users.deleteUser(modalItem);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code == 200) {
        toast.success("User Deleted");
        queryClient.invalidateQueries({
          queryKey: ["getUserList"],
        });
        handleModal("modalDeleteUser", false);
      } else {
        toast.error(`User Delete Failed\n${res?.response?.data?.data}`);
        handleModal("modalDeleteUser", true);
      }
    },
    onError: (res: any) => {
      console.log(res);
      toast.error(`User Delete Failed\n${res?.response?.data?.data || ""}`);
      handleModal("modalDeleteUser", true);
    },
  });
  const handleDeleteUser = () => {
    mutate();
  };
  return (
    <AlertDialog
      open={modal.modalDeleteUser}
      onOpenChange={() => handleModal("modalDeleteUser", false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the user. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => handleModal("modalDeleteUser", false)}
          >
            Cancel
          </AlertDialogCancel>
          <LoadingButton
            onClick={() => handleDeleteUser()}
            loading={isPending}
            size={"sm"}
          >
            Continue
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

export function ResetPasswordDialog() {
  const { handleModal, modal, modalItem } = createStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await users.resetPassword(modalItem);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("Password reset successfully.");
        queryClient.invalidateQueries({ queryKey: ["getUserDetail"] });
        handleModal("modalResetPassword", false);
      } else {
        toast.error(`Failed to reset password.\n${res?.response?.data?.data}`);
      }
    },
    onError: (res: any) => {
      console.error(res);
      toast.error(
        `Failed to reset password.\n${res?.response?.data?.data || ""}`
      );
    },
  });

  const handleResetPassword = () => mutate();

  return (
    <AlertDialog
      open={modal.modalResetPassword}
      onOpenChange={() => handleModal("modalResetPassword", false)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset User Password</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset the user's password to the default value. You can
            inform the user to change it afterward. Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => handleModal("modalResetPassword", false)}
          >
            Cancel
          </AlertDialogCancel>
          <LoadingButton
            onClick={handleResetPassword}
            loading={isPending}
            size="sm"
          >
            Confirm Reset
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

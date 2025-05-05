import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/LoadingButton";
import users from "@/services/api/users";
import useStore from "@/store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object({
  current_password: yup.string().required("Password wajib diisi"),
  new_password: yup
    .string()
    .required("Password Baru wajib diisi")
    .min(8, "Minimal 8 karakter"),
  new_password_confirmation: yup
    .string()
    .oneOf([yup.ref("new_password")], "Konfirmasi password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

interface PasswordProps {
  new_password_confirmation: string;
  new_password: string;
  current_password: string;
}

export function ChangePasswordDialog() {
  const { handleModal, modal, modalItem, userData } = useStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordProps>({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: PasswordProps) => {
      return await users.changePassword(data, userData?.id);
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        toast.success("Password berhasil diubah");
        handleModal("modalChangePassword", false);
        queryClient.invalidateQueries({ queryKey: ["getDetailUser"] });
        reset();
      } else {
        toast.error(`Gagal mengubah password\n${res?.response?.data?.data}`);
      }
    },
    onError: (err: any) => {
      toast.error(
        `Gagal mengubah password\n${err?.response?.data?.data || ""}`
      );
    },
  });

  const onSubmit = (data: PasswordProps) => {
    mutate(data);
  };

  const handleIsOpenModal = () => {
    if (userData.password_reset_at == null) {
      handleModal("modalChangePassword", false);
    } else {
      toast.warning("Password Harus diganti terlebih dahulu");
    }
  };

  return (
    <Dialog open={modal.modalChangePassword} onOpenChange={handleIsOpenModal}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              {modalItem?.id
                ? "Update the user password below."
                : "Fill in the form to set a new password."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current_password" className="text-right">
                Old Password
              </Label>
              <div className="col-span-3">
                <Input
                  type="password"
                  id="current_password"
                  {...register("current_password")}
                  error={errors.current_password?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="NewPassword" className="text-right">
                New Password
              </Label>
              <div className="col-span-3">
                <Input
                  type="password"
                  id="NewPassword"
                  {...register("new_password")}
                  error={errors.new_password?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new_password_confirmation" className="text-right">
                Confirm Password
              </Label>
              <div className="col-span-3">
                <Input
                  type="password"
                  id="new_password_confirmation"
                  {...register("new_password_confirmation")}
                  error={errors.new_password_confirmation?.message}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <LoadingButton loading={isPending} type="submit">
              Save changes
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

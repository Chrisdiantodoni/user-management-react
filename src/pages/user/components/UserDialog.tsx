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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  name: yup.string().required("Nama wajib diisi"),
});

interface UserProps {
  username: string;
  name: string;
}

export function UserDialog() {
  const { handleModal, modal, modalItem } = useStore();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (modalItem?.id) {
      setValue("username", modalItem?.username);
      setValue("name", modalItem?.name);
    }
  }, [modalItem]);

  const onSubmit = (data: UserProps) => {
    mutate(data);
  };
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserProps) => {
      if (modalItem?.id) {
        const response = await users.updateUser(data, modalItem?.id);
        return response;
      }
      const response = await users.createUser(data);
      return response;
    },
    onSuccess: (res) => {
      if (modalItem?.id) {
        if (res?.meta?.code == 200) {
          toast.success("Update User Success");
          handleModal("modalUser", false);
          queryClient.invalidateQueries({ queryKey: ["getDetailUser"] });
        } else {
          console.log(res);
          toast.error(`Update User Failed\n${res?.response?.data?.data}`);

          return res;
        }
      } else {
        if (res?.meta?.code == 200) {
          toast.success("Create User Success");
          handleModal("modalUser", false);
          queryClient.invalidateQueries({ queryKey: ["getUserList"] });
        } else {
          console.log(res);
          toast.error(`Create User Failed\n${res?.response?.data?.data}`);
          return res;
        }
      }
      reset();
    },
    onError: (res: any) => {
      console.log(res);
      if (modalItem?.id) {
        toast.error(`Update User Failed\n${res?.response?.data?.data || ""}`);
      } else {
        toast.error(`Create User Failed\n${res?.response?.data?.data || ""}`);
      }
    },
  });

  return (
    <Dialog
      open={modal.modalUser}
      onOpenChange={() => handleModal("modalUser", false)}
    >
      <DialogContent className="">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {modalItem?.id ? "Edit Profile" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {modalItem?.id
                ? "Make changes to your profile here. Click save when you're done."
                : "Fill in the form below to add a new user."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  {...register("name")}
                  id="name"
                  error={errors.name?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <div className="col-span-3">
                <Input
                  {...register("username")}
                  id="username"
                  error={errors.username?.message}
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

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import auth from "@/services/api/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import createStore from "@/store";
import { LoadingButton } from "./ui/LoadingButton";

const schema = yup.object({
  username: yup.string().required("Username wajib diisi"),
  password: yup.string().required("Password wajib diisi"),
});

interface UserProps {
  username: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { handle } = createStore();

  const onSubmit = (data: UserProps) => {
    mutate(data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: UserProps) => {
      const response = await auth.login(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code == 200) {
        localStorage.setItem("token", res?.data?.token);
        navigate("/", { replace: true });
        handle("userData", { ...res?.data?.user });
        handle("isAuthenticated", true);
        // toast(
        // 	<Toasts title='Login Success' icon='VerifiedUser' iconColor='success'>
        // 		User Login Successfully
        // 	</Toasts>,
        // 	{
        // 		autoClose: 1000,
        // 	},
        // );
        toast.success("Login Success");
      } else {
        console.log(res);
        toast.error(`Login Failed\n${res?.response?.data?.data}`);
        // toast(
        // 	<Toasts title='Login Failed' icon='VerifiedUser' iconColor='danger'>
        // 		Login Failed
        // 	</Toasts>,
        // 	{
        // 		autoClose: 1000,
        // 	},
        // );
        return res;
      }
    },
    onError: (res: any) => {
      console.log(res);
      toast.error(`Login Failed\n${res?.response?.data?.data || ""}`);
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  error={errors.username?.message}
                  {...register("username")}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>
              <div className="flex flex-col gap-3">
                <LoadingButton
                  type="submit"
                  className="w-full"
                  loading={isPending}
                >
                  Login
                </LoadingButton>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

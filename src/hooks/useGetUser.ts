import users from "@/services/api/users";
import { useEffect, useRef } from "react";
import createStore from "@/store";
import { NavigateFunction } from "react-router-dom";

interface getUserProps {
  token: string;
  navigate: NavigateFunction;
}
export const useGetUser = ({ navigate, token }: getUserProps) => {
  const hasFetched = useRef(false);
  const { handle } = createStore();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchUser = async () => {
      const response = await users.getUser();
      if (response?.meta?.code == 200) {
        handle("userData", { ...response?.data });
        handle("isAuthenticated", true);
      } else {
        return;
      }
    };
    fetchUser();
  }, [handle, navigate, token]);
};

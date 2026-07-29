import { useMutation } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";

export const useAccount = () => {
  const loginUser = useMutation({
    mutationFn: async (loginCreds: LoginSchema) => {
      await agent.post("/login/?useCookies=true", loginCreds);
    },
  });

  return {
    loginUser,
  };
};

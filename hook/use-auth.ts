// hooks/useSignup.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// export const useSignup = () => {
//   return useMutation({
//     mutationFn: async (values: { username: string; email: string; password: string }) => {
//       const response = await axios.post("/api/users/signup", values);
//       return response.data;
//     },
//   });
// };


export interface SignUpValues {
  username: string;
  email: string;
  password: string;
}

export const useSignup = () => {
  return useMutation({
    mutationFn: async (values: SignUpValues) => {
      const response = await axios.post("/api/users/signup", values);
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const response = await axios.post("/api/users/login", values);
      return response.data;
    },
  });
};

import { post } from "../api";

export const loginService = async (body) => {
  const data = await post('http://localhost:4000/api/v1/users/login', body);
  return data;
};

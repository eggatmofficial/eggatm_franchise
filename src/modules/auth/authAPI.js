import { apiPost } from "../../services/apiHelpers";

export const loginAPI = (data) =>
  apiPost("/auth/login", data);

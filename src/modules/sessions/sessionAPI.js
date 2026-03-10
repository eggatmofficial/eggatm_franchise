import { apiPost, apiGet, apiPatch } from "../../services/apiHelpers";

/* START SESSION */
export const startSessionAPI = (tableId) =>
  apiPost("/sessions/start", { tableId });

/* GET ACTIVE SESSION */
export const getActiveSessionAPI = (tableId) =>
  apiGet(`/sessions/table/${tableId}`);

/* CLOSE SESSION */
export const closeSessionAPI = (id) =>
  apiPatch(`/sessions/close/${id}`);

export const BASE_URL =
  process.env.NODE_ENV === "production" ? "production_url" : "local_url";

// import { i18n } from "@/i18n";

// import * as apiUser from "./Requests/user";

export const API_V1 = "/api/v1";

// export const lang = () => i18n.global.locale.value;
// export const urlV1 = (l) => `${BASE_URL}/${l}${API_V1}/`;

export const urlV1 = `${BASE_URL}${API_V1}`;

export const api = {
  // apiUser
};

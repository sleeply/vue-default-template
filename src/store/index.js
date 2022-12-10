import { createStore } from "vuex";

import user from "./modules/user";

export default function() {
  return createStore({
    modules: {
      user,
    },
  });
}

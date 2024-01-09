import Mux from "@mux/mux-node";

import { env } from "~/env.mjs";

export const mux = new Mux(env.MUX_TOKEN_ID, env.MUX_TOKEN_SECRET);

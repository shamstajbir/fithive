import { createClient } from "@base44/sdk";

// PUBLIC CLIENT — NO AUTHENTICATION REQUIRED
export const base44 = createClient({
  appId: "6948425aee52f782ae6a33e5",
  requiresAuth: false
});

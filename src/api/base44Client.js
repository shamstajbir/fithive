import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6948425aee52f782ae6a33e5", 
  requiresAuth: true // Ensure authentication is required for all operations
});

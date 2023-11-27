import { CoreAPIClient } from "./api-client.js";
import { setLogger } from "./responses.js";

export { 
  apiClient
}

const apiClient = new CoreAPIClient();

// for clients we use the browser console for logging
setLogger(console); 

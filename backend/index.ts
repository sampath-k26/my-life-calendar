import app from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { env } from "./src/config/env.js";

connectDatabase()
  .then(() => {
    app.listen(env.port, env.host, () => {
      console.log(`API server running on http://localhost:${env.port}`);
      console.log(`API server listening on network host ${env.host}:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });

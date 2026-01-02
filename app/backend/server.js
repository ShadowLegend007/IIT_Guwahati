// import dependencies
import env from "./src/config/env.js";
import connectDB from "./src/config/db.js";
import app from "./src/app.js"

const startServer = async () => {
  await connectDB();

  const PORT = env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();

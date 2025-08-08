import app from "@/app";
import config from "@/config";

// start the server
app.listen(config.PORT, () => {
  console.log(
    `Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`,
  );
});

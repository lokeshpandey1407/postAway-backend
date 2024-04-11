import express from "express";
import userRoutes from "./src/features/user/user.routes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import postRoutes from "./src/features/posts/posts.routes.js";
import likeRoutes from "./src/features/like/like.routes.js";
import commentRoutes from "./src/features/comment/comment.routes.js";
import Auth from "./src/middlewares/jwt.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";
import { connectToMongoose } from "./src/config/mongoose.config.js";
import userProfileRoutes from "./src/features/userProfile/userProfile.routes.js";
import friendRequestRoutes from "./src/features/Friends/friendRequest.routes.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

const app = express();

//swagger config
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static("public"));
//cors config
let corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));

//cookie config
app.use(cookieParser());

//configure body parser
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send("Postaway social media app is running");
});

app.use("/api/user", loggerMiddleware, userRoutes);
app.use("/api/posts", Auth, loggerMiddleware, postRoutes);
app.use("/api/like", Auth, loggerMiddleware, likeRoutes);
app.use("/api/comment", Auth, loggerMiddleware, commentRoutes);
app.use("/api/profile", Auth, loggerMiddleware, userProfileRoutes);
app.use("/api/friends", Auth, loggerMiddleware, friendRequestRoutes);

app.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation page or go to this link - localhost:3200/api-doc"
    );
});

app.use(errorHandler);

app.listen(3200, () => {
  console.log("Server is listening on port 3200");
  connectToMongoose();
});

import { AppDataSource } from "./datasource";
import express from "express";
import "reflect-metadata";
import * as bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";
import helmet from "helmet";

export const app = express();

AppDataSource.initialize()
  .then(() => {

    app.use(bodyParser.json());
    app.use(express.json())
    app.use(cors());
    app.use(helmet());

    app.use(routes);

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log(error));

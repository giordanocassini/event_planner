import { Router, Request, Response } from "express";
import router from "./event";
import event from "./event";
import quotation from "./quotation";
import user from "./user";
import auth from "./auth";
import guest from "./guest";
import list from "./list"

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  return res.send("Api running");
});

router.use(user);
routes.use(event);
routes.use(quotation);
routes.use(auth);
routes.use(guest);
routes.use(list);


export default routes;
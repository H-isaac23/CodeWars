/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  getAllAccountsController,
  createAccountController,
  loginController,
  updateStarsController,
  updateGoldController,
} from "./controllers/accounts";
import {
  getAllMatchesController,
  postNewMatchController,
} from "./controllers/match";

const route = () => {
  const router: Router = Router();

  router.get("/account", getAllAccountsController);
  router.get("/matches", getAllMatchesController);
  router.post("/create/account", createAccountController);
  router.post("/create/match", postNewMatchController);
  router.post("/login", loginController);
  router.put("/update/star", updateStarsController);
  router.put("/update/gold", updateGoldController);

  return router;
};

export default route;

import Auth from "../models/Auth.js";
import { validationResult } from "express-validator";

class AuthController {
  async reqistration(request, res) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
      return;
    } else {
      Auth.register(request.body, res);
    }
  }

  async login(request, res) {
    Auth.login(request.body, res);
  }

  async logout(request, res) {
    const { refreshToken } = request.cookies;
    Auth.logout(refreshToken);
    res.clearCookie("refreshToken");
    res.status(200).json("logout");
  }

  async refresh(request, res) {
    if (request.cookies.hasOwnProperty("refreshToken")) {
      const { refreshToken } = request.cookies;
      Auth.refresh(refreshToken, res);
    } else res.status(400).json("Not found refreshToken");
  }

  async sendResetPassword(request, res) {
    await Auth.sendResetPassword(request.body.email, res);
  }

  async resetPassword(request, res) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
      return;
    } else {
      await Auth.resetPassword(request.params.confirmtoken, request.body.password, res);
    }
  }
}

export default new AuthController();

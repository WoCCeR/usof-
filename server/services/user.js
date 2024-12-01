import TokenService from "./token.js";

class UserAuth {
  tryGetAuth(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return false;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return false;
    }

    const validatedUser = TokenService.validateAccessToken(token);
    if (!validatedUser) {
      return false;
    }

    req.user = validatedUser;

    return true;
  }
}

export default new UserAuth();

import DbUser from "../db/scheme/user.js";
import DbToken from "../db/scheme/token.js";
import TokenService from "../services/token.js";
import MailService from "../services/mail.js";
import bcrypt from "bcrypt";

const SaltRounds = 5;

class Auth {
  async register(user, res) {
    try {
      console.log(user);
      const createdUser = await DbUser.create({
        login: user.login,
        pass: bcrypt.hashSync(user.pass, bcrypt.genSaltSync(SaltRounds)),
        fullName: user.fullName,
        profilePicture: "user.png",
        rating: 0,
        email: user.email,
        isActivated: true,
      });

      // const tokens = TokenService.generateTokens(createdUser);
      const tokens = {accessToken:'12',refreshToken:"21"};

      TokenService.saveToken(user.login, tokens.refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json(this.userDataDAO(tokens, createdUser));
    } catch (err) {
      res.status(400).json(err.message);
    }
  }

  async login(user, res) {
    const login = user.login;
    const password = user.pass;

    try {
      const userByLogin = await DbUser.findOne({ where: { login: login } });

      if (!userByLogin) {
        res.status(400).json("User with this login is not found!");
        return;
      }
      const isPasswordValid = bcrypt.compare(password, userByLogin.pass);

      if (isPasswordValid) {
        const tokens = TokenService.generateTokens(userByLogin);

        TokenService.saveToken(userByLogin.login, tokens.refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.json(this.userDataDAO(tokens, userByLogin));
      } else {
        res.status(400).json("Incorrect password");
      }
    } catch (err) {
      res.status(400).json("Unknown login error");
    }
  }

  logout(refreshToken) {
    TokenService.removeToken(refreshToken);
  }

  async sendResetPassword(email, res) {
    if (!email) {
      res.status(401).json("Incorrect email");
      return;
    }

    const existingEmail = await DbUser.findOne({
      where: { email: email },
    });

    if (!existingEmail) {
      res.status(404).json("There is no user with this email");
      return;
    }

    const resetToken = TokenService.generateResetToken(email);
    const resetLink = `http://localhost:3000/api/auth/ppassword-reset/${resetToken}`;

    await MailService.sendActivationMail(email, resetLink);

    res.json("Success");
  }

  async resetPassword(token, newPassword, res) {
    const resetToken = TokenService.validateResetPasswordToken(token);

    if (!resetToken) {
      res.status(400).json("Incorrect token");
      return;
    }

    try {
      const user = await DbUser.findOne({ where: { email: resetToken.email } });

      if (!user) {
        res.status(400).json("User not found");
        return;
      }

      await user.update({
        password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(SaltRounds)),
      });

      res.json("Success");
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json("Internal Server Error");
    }
  }

  async refresh(refreshToken, res) {
    if (!refreshToken) {
      res.status(401).json("UnauthorizedError");
      return;
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      res.status(401).json("UnauthorizedError");
      return;
    }

    try {
      DbToken.findOne({ where: { refreshToken: refreshToken } }).then(() => {
        let tokens = TokenService.generateTokens(userData);

        TokenService.saveToken(userData.login, tokens.refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.json(this.userDataDAO(tokens, userData));
      });
    } catch (err) {
      res.status(401).json("UnauthorizedError");
    }
  }

  userDataDAO(tokens, userData) {
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      fullName: userData.fullName,
      login: userData.login,
      email: userData.email,
      id: userData.id,
      rating: userData.rating,
      roles: userData.roles,
      isActivated: userData.isActivated,
      profilePicture: userData.profilePicture,
    };
  }
}

export default new Auth();

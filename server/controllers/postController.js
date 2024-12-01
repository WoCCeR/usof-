import UserPost from "../models/posts/UserPost.js";
import AdminPost from "../models/posts/AdminPost.js";
import PostLike from "../models/likes/PostLike.js";
import userAuthService from "../services/user.js";

class PostController {
  async getPosts(req, res) {
    const isAuthUser = userAuthService.tryGetAuth(req);

    if (!isAuthUser) {
      await UserPost.getUserPost(req, res, req.query);
    } else {
      if (!req.user) {
        await UserPost.getUserPost(req, res, req.query);
      } else {
        await AdminPost.getAdminPost(req, res, req.query);
      }
    }
  }

  async getPostsByUserId(req, res) {
    UserPost.getPostsByUserId(req, res, req.query, req.params.userId);
  }

  async getPost(req, res) {
    await UserPost.getPostById(req, res, req.params.postId);
  }

  async getLikes(req, res) {
    await PostLike.getLikes(res, req.params.postId);
  }

  async getComments(req, res) {
    await UserPost.getComments(res, req.params.postId, req.query);
  }

  async getPostCategories(req, res) {
    await UserPost.getPostCategories(req, res, req.params.postId);
  }

  async createComment(req, res) {
    await UserPost.createNewComment(
      req.user,
      req.body.content,
      res,
      req.params.postId
    );
  }

  async createLike(req, res) {
    if (
      req.query.type &&
      (req.query.type === "like" || req.query.type === "dislike")
    ) {
      await PostLike.createLike(
        res,
        req.user,
        req.params.postId,
        req.query.type
      );
    } else {
      res.status(400).send("Invalid like parameter");
    }
  }

  async createPost(req, res) {
    await UserPost.creteUserPost(req.body, res, req.user.login, req.user.id);
  }

  async updatePost(req, res) {
    if (req.user.roles == "user") {
      await UserPost.updateUserPost(req.body, res, req.params.postId);
    } else {
      await AdminPost.updateUserPost(req.body, res, req.params.postId);
    }
  }

  async deletePost(req, res) {
    await UserPost.deletePost(req, res, req.params.postId);
  }

  async deleteLike(req, res) {
    await PostLike.destroyLike(res, req.user, req.params.postId);
  }
}

export default new PostController();

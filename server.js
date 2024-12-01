import express from "express";
import cors from "cors";
import cookies from "cookie-parser";
import admin from "./server/admin/admin.js";
import avatarsPath from "./server/services/avatar.js";

import authController from "./server/controllers/authController.js";
import authMiddleware from "./server/middleware/authMiddleware.js"
import roleMiddleware from "./server/middleware/roleMiddleware.js";

import CategoriesController from "./server/controllers/categoriesController.js";
import CommentController from "./server/controllers/commentController.js";
import PostController from "./server/controllers/postController.js";

import UserController from "./server/controllers/userController.js";
import { upload } from "./server/services/storage.js";


const PORT = 3001;
const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookies());
app.use(admin.path, admin.router);
app.use("/avatars", express.static(avatarsPath));

app.post('/api/auth/register', authController.reqistration);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.get('/api/auth/refresh', authMiddleware, roleMiddleware(['user', 'admin']), authController.refresh);
app.post('/api/auth/password-reset', authController.sendResetPassword);
app.post('/api/auth/password-reset/:confirmtoken', authController.resetPassword);

app.post('/api/users', authMiddleware, roleMiddleware(["admin"]), UserController.createUser);
app.get('/api/users', UserController.getUsers);
app.get('/api/users/:userId', UserController.getUserById);
app.patch('/api/users/:userId', authMiddleware, roleMiddleware(["admin"]), UserController.updateUser);
app.post('/api/users/uavatar', authMiddleware, upload.single('file'), UserController.addAvatar);
app.delete('/api/users/:userId', authMiddleware, roleMiddleware(["admin"]), UserController.deleteUser);

app.post('/api/categories', authMiddleware, roleMiddleware(["admin"]), CategoriesController.createCategory);
app.get('/api/categories', CategoriesController.getAllCategorise);
app.get('/api/categories/:categoryId', CategoriesController.getCategoryById);
app.get('/api/categories/:categoryId/posts', CategoriesController.getPostsByCategory);
app.patch('/api/categories/:categoryId', authMiddleware, roleMiddleware(["admin"]), CategoriesController.changeCategory);
app.delete('/api/categories/:categoryId', authMiddleware, roleMiddleware(["admin"]), CategoriesController.deleteCategory);

app.get('/api/posts', PostController.getPosts);
app.get('/api/posts/:postId', PostController.getPost);
app.get('/api/posts/:postId/categories', PostController.getPostCategories);
app.get('/api/posts/:postId/like', PostController.getLikes);

app.get('/api/posts/:userId/user', PostController.getPostsByUserId);

app.get('/api/posts/:postId/comments', PostController.getComments);
app.post('/api/posts', authMiddleware, PostController.createPost);
app.post('/api/posts/:postId/comments', authMiddleware, PostController.createComment);
app.post('/api/posts/:postId/like', authMiddleware, PostController.createLike);
app.patch('/api/posts/:postId', authMiddleware, PostController.updatePost);
app.delete('/api/posts/:postId', authMiddleware, PostController.deletePost);
app.delete('/api/posts/:postId/like', authMiddleware, PostController.deleteLike);



app.get('/api/comments/:commentId/like', CommentController.getAllLikes);
app.get('/api/comments/:commentId', CommentController.getCommentById);
app.patch('/api/comments/:commentId', authMiddleware, CommentController.changeComment);
app.post('/api/comments/:commentId/like', authMiddleware, CommentController.setLike);
app.delete('/api/comments/:commentId/like', authMiddleware, CommentController.deleteLike);
app.delete('/api/comments/:commentId', authMiddleware, CommentController.deleteComment);

app.listen(PORT, () => {
  console.log(`Server start on http://localhost:${PORT}`);
});

# Install dependencies:
    npm install
# Run the server:
    npm start
##
# API Endpoints
## Authentication Module
    POST /api/auth/register
Register a new user.
Required parameters: login, pass, fullName, email, avatar

    POST /api/auth/login
Log in a user.
Required parameters: login, pass
Note: Only users with a confirmed email can log in.

    POST /api/auth/logout
Log out the authorized user.

    POST /api/auth/password-reset
Send a reset link to the user's email.
Required parameter: email

    GET /api/auth/refresh
Refresh the user's authentication token.

## Post Module
    GET /api/posts
Retrieve all posts.
Note: Public endpoint. Implements pagination for large datasets.

    GET /api/posts/:userId/user
Retrieve all posts by a specific user (userId).
Note: Public endpoint. Returns only active posts. Implements pagination.

    GET /api/posts/:post_id
Retrieve details of a specific post.
Note: Public endpoint.

    GET /api/posts/:post_id/comments
Retrieve all comments for a specific post.
Note: Public endpoint.

    POST /api/posts/:post_id/comments
Create a new comment on a post.
Required parameter: content

    GET /api/posts/:post_id/categories
Retrieve all categories associated with a post.

    GET /api/posts/:post_id/like
Retrieve all likes for a specific post.

    POST /api/posts
Create a new post.
Required parameters: title, content, categories

    POST /api/posts/:post_id/like
Add a like to a post.

    PATCH /api/posts/:post_id
Update a specific post's title, body, or categories.
Note: Only accessible to the creator of the post.

    DELETE /api/posts/:post_id
Delete a post.

    DELETE /api/posts/:post_id/like
Remove a like from a post.

## User Module
    GET /api/users
Retrieve all users.

    GET /api/users/:user_id
Retrieve data for a specific user.

    POST /api/users
Create a new user.
Required parameters: login, pass, email, role
Note: Only accessible to administrators.

    PATCH /api/users/avatar
Upload a user's avatar.

    PATCH /api/users/:user_id
Update a specific user's data.

    DELETE /api/users/:user_id
Delete a user.

## Categories Module
    GET /api/categories
Retrieve all categories.

    GET /api/categories/:category_id
Retrieve data for a specific category.

    GET /api/categories/:category_id/posts
Retrieve all posts associated with a specific category.

    POST /api/categories
Create a new category.
Required parameter: title

    PATCH /api/categories/:category_id
Update a specific category's data.

    DELETE /api/categories/:category_id
Delete a category.

## Comments Module
    GET /api/comments/:comment_id
Retrieve data for a specific comment.

    GET /api/comments/:comment_id/like
Retrieve all likes for a specific comment.

    POST /api/comments/:comment_id/like
Add a like to a comment.

    PATCH /api/comments/:comment_id
Update a specific comment's data.

    DELETE /api/comments/:comment_id
Delete a comment.

    DELETE /api/comments/:comment_id/like
Remove a like from a comment.
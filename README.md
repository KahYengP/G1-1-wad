# Recipe & Meal Planner Application (G1-1-wad)

A full-stack web application for managing recipes, bookmarks, meal planning, reviews, and categories with user authentication and admin dashboard.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/KahYengP/G1-1-wad.git
cd G1-1-wad
```

2. Install dependencies:
```bash
npm install express
npm install dotenv
npm install mongoose
```

Alternatively, install all at once:
```bash
npm install
```

3. Configure environment variables:
- Create or update `config.env` with your database and server configuration

## Usage

1. Start the application:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:8000/
```

## Project Structure

```
G1-1-wad/
│
├── controllers/
│   ├── authController.js          (User authentication & authorization)
│   ├── adminController.js         (Admin operations)
│   ├── recipeController.js        (Recipe CRUD operations)
│   ├── bookmarkController.js      (Bookmark management)
│   ├── reviewController.js        (Review management)
│   ├── categoryController.js      (Category management)
│   └── mealPlannerController.js   (Meal planning operations)
│
├── models/
│   ├── User.js                    (User schema)
│   ├── Recipe.js                  (Recipe schema)
│   ├── Bookmark.js                (Bookmark schema)
│   ├── Review.js                  (Review schema)
│   ├── Category.js                (Category schema)
│   └── MealPlanner.js             (Meal planner schema)
│
├── routes/
│   ├── authRoutes.js              (Authentication endpoints)
│   ├── adminRoutes.js             (Admin endpoints)
│   ├── recipeRoutes.js            (Recipe endpoints)
│   ├── bookmarkRoutes.js          (Bookmark endpoints)
│   ├── reviewRoutes.js            (Review endpoints)
│   ├── categoryRoutes.js          (Category endpoints)
│   └── mealPlannerRoutes.js       (Meal planner endpoints)
│
├── middleware/
│   └── authMiddleware.js          (Authentication & authorization middleware)
│
├── views/
│   ├── login.ejs                  (User login)
│   ├── register.ejs               (User registration)
│   ├── forgot.ejs                 (Forgot password)
│   ├── reset-password.ejs         (Password reset)
│   ├── profile.ejs                (User profile)
│   │
│   ├── recipe.ejs                 (Recipe listing)
│   ├── recipe-details.ejs         (Recipe details view)
│   ├── add-recipe.ejs             (Add new recipe)
│   ├── edit-recipe.ejs            (Edit recipe)
│   │
│   ├── bookmarks.ejs              (Bookmarks listing)
│   ├── edit-bookmark.ejs          (Edit bookmark)
│   │
│   ├── add-review.ejs             (Add review)
│   ├── edit-review.ejs            (Edit review)
│   │
│   ├── category.ejs               (Category view)
│   ├── add-category.ejs           (Add category)
│   ├── update-category.ejs        (Update category)
│   │
│   ├── collections.ejs            (Collections listing)
│   ├── add-collection.ejs         (Add collection)
│   ├── edit-collection.ejs        (Edit collection)
│   │
│   ├── meal-planner.ejs           (Meal planner view)
│   │
│   ├── admin-dashboard.ejs        (Admin dashboard)
│   ├── admin-profile.ejs          (Admin profile)
│   └── admin-user-form.ejs        (Admin user management)
│
├── public/
│   ├── index.html                 (Static HTML)
│   └── images/                    (Image uploads directory)
│
├── data/
│   ├── recipes.json               (Recipe data)
│   └── user.json                  (User data)
│
├── config.env                     (Environment configuration)
├── server.js                      (Main server file)
├── package.json                   (Dependencies & scripts)
└── README.md                      (This file)
```

## Features

- **User Authentication**: Secure login and registration with password reset
- **Recipe Management**: Create, read, update, and delete recipes
- **Bookmarks**: Save favorite recipes
- **Reviews**: Add and manage recipe reviews
- **Categories**: Organize recipes by categories
- **Collections**: Create custom recipe collections
- **Meal Planner**: Plan meals and organize weekly menus
- **Admin Dashboard**: Manage users and system content
- **User Profiles**: Manage user account information

## Environment Variables

Configure the following in `config.env`:
- `PORT` - Server port (default: 8000)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- Other configuration as needed

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS (templating), HTML, CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv

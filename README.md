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
│   ├── authController.js          (User authentication & authorization) [cheyenne]
│   ├── adminController.js         (Admin operations) [cheyenne]
│   ├── recipeController.js        (Recipe CRUD operations) [kia heng]
│   ├── bookmarkController.js      (Bookmark management) [victoria]
│   ├── reviewController.js        (Review management)
│   ├── categoryController.js      (Category management) [xin hee]
│   └── mealPlannerController.js   (Meal planning operations) [kelsey]
│
├── models/
│   ├── User.js                    (User schema) [cheyenne]
│   ├── Recipe.js                  (Recipe schema) [kia heng]
│   ├── Bookmark.js                (Bookmark schema) [victoria]
│   ├── Review.js                  (Review schema)
│   ├── Category.js                (Category schema) [xin hee]
│   └── MealPlanner.js             (Meal planner schema) [kelsey]
│
├── routes/
│   ├── authRoutes.js              (Authentication endpoints) [cheyenne]
│   ├── adminRoutes.js             (Admin endpoints)
│   ├── recipeRoutes.js            (Recipe endpoints) [kia heng]
│   ├── bookmarkRoutes.js          (Bookmark endpoints) [victoria]
│   ├── reviewRoutes.js            (Review endpoints)
│   ├── categoryRoutes.js          (Category endpoints) [xin hee]
│   └── mealPlannerRoutes.js       (Meal planner endpoints) [kelsey]
│
├── middleware/
│   └── authMiddleware.js          (Authentication & authorization middleware)
│
├── views/
│   ├── login.ejs                  (User login) [cheyenne]
│   ├── register.ejs               (User registration) [cheyenne]
│   ├── forgot.ejs                 (Forgot password) [cheyenne]
│   ├── reset-password.ejs         (Password reset) [cheyenne]
│   ├── profile.ejs                (User profile) [cheyenne]
│   │
│   ├── recipe.ejs                 (Recipe listing) [kia heng]
│   ├── recipe-details.ejs         (Recipe details view) [kia heng]
│   ├── add-recipe.ejs             (Add new recipe) [kia heng]
│   ├── edit-recipe.ejs            (Edit recipe) [kia heng]
│   │
│   ├── bookmarks.ejs              (Bookmarks listing) [victoria]
│   ├── edit-bookmark.ejs          (Edit bookmark) [victoria]
│   │
│   ├── add-review.ejs             (Add review)
│   ├── edit-review.ejs            (Edit review)
│   │
│   ├── category.ejs               (Category view) [xin hee]
│   ├── add-category.ejs           (Add category) [xin hee]
│   ├── update-category.ejs        (Update category) [xin hee]
│   │
│   │
│   ├── meal-planner.ejs           (Meal planner view) [kelsey]
│   │
│   ├── admin-dashboard.ejs        (Admin dashboard) [cheyenne]
│   ├── admin-profile.ejs          (Admin profile) [cheyenne]
│   └── admin-user-form.ejs        (Admin user management) [cheyenne]
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


##AI Declaration: 
- **CSS**: For navigation bar, Webpage design 
- **script for register**: debugging hints to remove the option when already chosen 
- **authcontroller js**: debugging hints to allow password or security questions to be changed 
- **bookmarks.ejs**: debugging hints to fix routing error with recipe-details.ejs

##admin account
email: a@gmail.com
password: 1
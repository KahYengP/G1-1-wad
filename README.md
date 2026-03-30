# G1-1-wad

# Installation
1. clone the repo:

2. Install dependencies:
- Npm install express
- Npm install dotenv
- Npm install mongoose
- npm install multer

## Usage
1. Run the app:
npm start

2. Then open your browser and go to: http://127.0.0.1:8000/

## Project structure
...
digital-recipe-box/
│
├── controllers/
│   ├── authController.js        ← Member 1 (Auth CRUD)
│   ├── recipeController.js      ← Member 2 (YOU - Recipe CRUD)
│   ├── bookmarkController.js    ← Member 3 (Bookmark CRUD)
│   ├── reviewController.js      ← Member 4 (Review CRUD)
│   ├── categoryController.js    ← Member 5 (Category CRUD)
│   └── dashboardController.js   ← Member 6 (Dashboard / Favorites / Comments)
│
├── models/
│   ├── User.js
│   ├── Recipe.js
│   ├── Bookmark.js
│   ├── Review.js
│   ├── Category.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── recipeRoutes.js
│   ├── bookmarkRoutes.js
│   ├── reviewRoutes.js
│   ├── categoryRoutes.js
│   └── dashboardRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│
│   ├── recipes.ejs
│   ├── recipe-details.ejs
│   ├── add-recipe.ejs
│   ├── edit-recipe.ejs
│
│   ├── bookmarks.ejs
│
│   ├── reviews.ejs
│   ├── add-review.ejs
│
│   ├── categories.ejs
│
│   ├── comments.ejs
│
│   └── error.ejs
│
├── public/
│   └── index.html
│
├── data/
│   └── recipes.json
├──config .env
├── server.js
├── package.json
└── README.md
...

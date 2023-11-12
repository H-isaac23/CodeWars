## CS CODEWARS

### Team Collaboration

[Trello Link](https://trello.com/invite/b/tnI3ug3L/ATTIf64c29a50c8cced0ecc33aa4697ef45660F6C5E4/code-wars)

[Figma Link](https://www.figma.com/file/KR3Tn7II7E7FsCbRkeHZ8E/Untitled?node-id=57%3A2&t=ClSuxoFhiG3wbPZy-1)

### Frontend

The frontend uses [reactjs with vite](https://vitejs.dev/)

Use the `public` folder for images and assets.

For styling there is css, so do not ever put any css inline unless absolutely required. Css files will be put in the same directory as the route it is styling.

### Backend

The backend uses [Express.js](https://expressjs.com/) as server for hosting a REST API, which is all set up inside the `src/index.js`.
Backend also uses several other library:

- [Mongoose](https://expressjs.com/) as ODM for Mongo DB
- [cors](https://www.npmjs.com/package/cors) as enabler for CORS requests

#### Backend Folder Structure

```
backend
├───models
    └───account.js
├───routers
    └───accounts.js
    └───login.js
├───utils
├───.env.example
├───.gitignore
├───app.js
├───index.js
├───io.js
├───package-lock.json
└───package.json
```

## Available Scripts

In the project directory of the backend, you can run:

### `npm start`

Runs the server in production mode.\
The server will be listening for calls in [http://localhost:3003](http://localhost:3003).

### `npm run dev`

Runs the server in development mode.\
The server will be listening for calls in [http://localhost:3000](http://localhost:3003).

### Test Accounts

- Username: server-1-test Password: server-1-test

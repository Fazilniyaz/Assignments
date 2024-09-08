const express = require("express");
const session = require("express-session");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 8080;

// Set up session middleware
app.use(
  session({
    secret: "your_secret_key", // Replace with your secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Middleware to prevent caching (important for preventing back button access)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store"); // Prevent caching
  res.setHeader("Pragma", "no-cache"); // For older HTTP/1.0 clients
  res.setHeader("Expires", "0"); // Forces caches to fetch updated content
  next();
});

// Home route (Protected)
app.get("/", (req, res) => {
  if (!req.session.isLogin) {
    return res.redirect("/login");
  }
  res.render("home.ejs");
});

// Login route
app.get("/login", (req, res) => {
  if (req.session.isLogin) {
    res.redirect("/");
  } else {
    res.render("login.ejs", {
      credentialsMissing: req.session.credentialsMissing,
      invalidCreditials: req.session.invalidCreditials,
    });
    req.session.credentialsMissing = false;
    req.session.invalidCreditials = false;
  }
});

// Handle login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.session.credentialsMissing = true;
    req.session.invalidCreditials = false;
    return res.redirect("/login");
  }

  if (email !== process.env.EMAIL || password !== process.env.PASSWORD) {
    req.session.invalidCreditials = true;
    req.session.credentialsMissing = false;
    return res.redirect("/login");
  }

  req.session.isLogin = true;
  res.redirect("/");
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/login");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// const express = require("express");
// const session = require("express-session");
// const app = express();
// const dotenv = require("dotenv");
// const { urlencoded } = require("body-parser");

// dotenv.config();

// const port = process.env.PORT || 8080;

// // app.use(express.json());
// app.use(
//   session({
//     secret: "your_secret_key", // Replace with your secret key
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(express.urlencoded({ extended: true }));
// app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

// app.get("/login", (req, res) => {
//   if (req.session.isLogin) {
//     res.redirect("/");
//   } else {
//     res.render("login.ejs", {
//       credentialsMissing: req.session.credentialsMissing,
//       invalidCreditials: req.session.invalidCreditials,
//     });
//     req.session.credentialsMissing = false;
//     req.session.invalidCreditials = false;
//     req.session.isLogin = false;
//     console.log("this is rthwe  qeuey :", req.query);
//     console.log("this is rthwe  paramas :", req.params);
//   }
// });

// app.post("/login", (req, res) => {
//   const userDetails = req.body;
//   const { email, password } = req.body;
//   if (!email || !password) {
//     req.session.credentialsMissing = true;
//     req.session.invalidCreditials = false;
//     res.redirect("/login");
//   }
//   if (
//     (email && email !== process.env.EMAIL) ||
//     (password && password !== process.env.PASSWORD)
//   ) {
//     req.session.invalidCreditials = true;
//     req.session.credentialsMissing = false;
//     res.redirect("/login");
//   }
//   if (email === process.env.EMAIL && password === process.env.PASSWORD) {
//     req.session.isLogin = true;
//     console.log("login sdession ;", req.session.isLogin);

//     res.redirect("/");
//   }

//   console.log(userDetails);
// });

// app.get("/logout", (req, res) => {
//   req.session.isLogin = false;
//   res.redirect("/login");
// });

// app.listen(port, () => {
//   console.log("server started");
// });

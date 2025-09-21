const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());

const user = [];

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  user.push({ username, password: hashedPassword });

  res.json({ message: "User Registered Successfully!" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) return res.status(404).json({ message: "user not found" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Welcome", username });
  } else {
    res.status(400).json({ message: "Unauthorized" });
  }
});

app.get("/profile", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.status(401).json({ message: "Token Missing!" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or Expired Token" });

    res.json({ message: "Profile data accessed!" });
  });
});

app.listen(3000, () => console.log("Server is running on port 3000"));

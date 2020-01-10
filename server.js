const express = require("express");

// Initializes express in a variable called app
const app = express();

app.get("/", (req, res) =>
  res.json({ msg: "Welcome to the ContactKepper API..." })
);

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));

// Port that app.listen() can liste on
// This line looks for an environment variable called PORT or 5000
const PORT = process.env.PORT || 5000;

// app has a listen() method
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

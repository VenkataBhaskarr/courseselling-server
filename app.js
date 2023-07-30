const express = require('express');
const mongoose = require("mongoose");
const app = express();
const CORS = require("cors")


app.use(CORS())
app.use(express.json());

const userRoutes = require("./routes/users")
const adminRoutes = require("./routes/admins")

app.use("/users",userRoutes)
app.use("/admins",adminRoutes)

mongoose.connect("url", { useNewUrlParser: true, useUnifiedTopology: true})
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});



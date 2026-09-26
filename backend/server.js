const express = require("express");
const cors = require("cors");
const createTables = require("./src/models/index.js");
const authRoutes = require("./src/routes/auth.js");
const productRoutes = require("./src/routes/products.js");
const categoryRoutes = require("./src/routes/categories.js");
const orderRoutes = require("./src/routes/orders.js");
const serviceRoutes = require("./src/routes/services.js");
const serviceRequestsRoutes = require("./src/routes/serviceRequests.js");
const cartRoutes = require("./src/routes/cart.js");
const uploadRoute = require("./src/routes/upload.js");
const featuredSlidesRoutes = require("./src/routes/featuredSlides.js");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(`/api/auth`, authRoutes);
app.use(`/api/products`, productRoutes);
app.use(`/api/categories`, categoryRoutes);
app.use(`/api/orders`, orderRoutes);
app.use(`/api/services`, serviceRoutes);
app.use(`/api/service_requests`, serviceRequestsRoutes);
app.use(`/api/cart`, cartRoutes);
app.use(`/api/upload`, uploadRoute);
app.use(`/api/featured-slides`, featuredSlidesRoutes);
createTables();

// 404 handler — catches any route that doesn't match one above
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler — must be last, must have 4 parameters
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://labhbother12:13801234@cluster0.8gdivgr.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use(express.static(path.join(__dirname, "../")));

app.use((req, res, next) => {
  res.locals.req = req;
  next();
});

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventType: String,
  date: String,
  message: String,
  package: String,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Booking = mongoose.model("Booking", bookingSchema);
const User = mongoose.model("User", userSchema);

(async function () {
  const existing = await User.findOne({ username: "admin" });
  if (!existing) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ username: "admin", password: hashed });
    console.log("🔐 Admin created: admin / admin123");
  }
})();

// ✅ Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) return next();
  res.redirect("/admin/login");
}

// ✅ Public booking form submit
app.post("/submit-booking", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.send("✅ Booking submitted! We’ll contact you soon.");
  } catch (err) {
    res.status(500).send("❌ Booking submission failed.");
  }
});

// ✅ Admin login
app.get("/admin/login", (req, res) => {
  res.render("login", { error: null });
});
// Edit booking - form
app.get("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  res.render("edit-booking", { booking });
});

// Edit booking - submit
app.post("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/admin/dashboard");
});

// Delete a booking
app.post("/admin/booking/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error deleting booking.");
  }
});

app.post("/admin/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const valid =
    user && (await bcrypt.compare(req.body.password, user.password));
  if (!valid) return res.render("login", { error: "Invalid credentials" });

  req.session.isAuthenticated = true;
  res.redirect("/admin/dashboard");
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// ✅ Admin dashboard
app.get("/admin/dashboard", isAuthenticated, async (req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.render("dashboard", { bookings });
});

// ✅ Admin approve/reject
app.post("/admin/booking/status/:id", isAuthenticated, async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.redirect("/admin/dashboard");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server running: http://localhost:${port}`);
});

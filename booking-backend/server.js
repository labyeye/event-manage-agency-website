require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3000;

// Twilio Setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) return next();
  res.redirect("/admin/login");
}

// Utility function to get booking statistics
async function getBookingStats() {
  const total = await Booking.countDocuments();
  const approved = await Booking.countDocuments({ status: "Approved" });
  const pending = await Booking.countDocuments({ status: "Pending" });
  const rejected = await Booking.countDocuments({ status: "Rejected" });
  
  return { total, approved, pending, rejected };
}

app.post("/submit-booking", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.send("✅ Booking submitted! We'll contact you soon.");
  } catch (err) {
    res.status(500).send("❌ Booking submission failed.");
  }
});

app.get("/admin/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/admin/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  const valid = user && (await bcrypt.compare(req.body.password, user.password));
  if (!valid) return res.render("login", { error: "Invalid credentials" });
  req.session.isAuthenticated = true;
  res.redirect("/admin/dashboard");
});

app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

app.get("/admin/dashboard", isAuthenticated, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const stats = await getBookingStats();
    
    res.render("dashboard", { 
      bookings,
      stats: {
        total: stats.total,
        approved: stats.approved,
        pending: stats.pending,
        rejected: stats.rejected
      }
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).send("Error loading dashboard");
  }
});

// API endpoint for stats (can be used for AJAX updates)
app.get("/api/dashboard-stats", isAuthenticated, async (req, res) => {
  try {
    const stats = await getBookingStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.post("/admin/booking/status/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).send("Booking not found");
    
    await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status });

    if (req.body.status === "Approved") {
      const message = `Hi ${booking.name}, your booking has been approved! We'll contact you soon. – AR Event & Wedding Planner`;
      try {
        await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${booking.phone}`,
        });
        console.log("✅ SMS sent");
      } catch (err) {
        console.error("❌ SMS failed:", err.message);
      }
    }

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error("Error updating booking status:", err);
    res.status(500).send("Error updating booking status");
  }
});

app.get("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    res.render("edit-booking", { booking });
  } catch (err) {
    res.status(500).send("Error loading booking");
  }
});

app.post("/admin/booking/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error updating booking");
  }
});

app.post("/admin/booking/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Error deleting booking.");
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
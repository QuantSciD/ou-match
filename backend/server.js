import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createObjectCsvWriter } from "csv-writer";

const app = express();

// --- paths (ES modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, "matches.csv");

// --- CORS (handles preflight too) ---
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
]);

const corsOptions = {
  origin: (origin, cb) => {
    // allow curl/postman (no origin)
    if (!origin) return cb(null, true);
    return allowedOrigins.has(origin)
      ? cb(null, true)
      : cb(new Error(`CORS blocked for origin: ${origin}`), false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

app.use((req, _res, next) => {
  console.log("➡️", req.method, req.url, "origin:", req.headers.origin);
  next();
});

app.use(cors(corsOptions));
app.options("/submit", cors(corsOptions)); // ✅ explicit preflight for Express 5
app.use(express.json({ limit: "2mb" }));

// --- CSV writer ---
const csvWriter = createObjectCsvWriter({
  path: csvPath,
  append: true,
  header: [
    { id: "firstName", title: "First Name" },
    { id: "lastName", title: "Last Name" },
    { id: "email", title: "Email" },
    { id: "phone", title: "Phone" },
    { id: "age", title: "Age" },
    { id: "gender", title: "Gender" },
    { id: "personality", title: "Personality" },
    { id: "hasCar", title: "Has Car" },
    { id: "canDriveDate", title: "Can Drive Date" },
    { id: "dateType", title: "Date Type" },
    { id: "dateGroup", title: "Date Group" },
    { id: "locations", title: "Locations" },
    { id: "desiredTraits", title: "Desired Traits" },
    { id: "notes", title: "Notes" },
    { id: "otherActivity", title: "Other Activity" },
    { id: "createdAt", title: "Created At" },
  ],
});

app.get("/health", (req, res) => {
  res.json({ ok: true, csvPath });
});

app.post("/submit", async (req, res) => {
  try {
    const { basic, prefs } = req.body || {};
    if (!basic || !prefs) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing basic or prefs" });
    }

    const row = {
      firstName: (basic.firstName ?? "").trim(),
      lastName: (basic.lastName ?? "").trim(),
      email: (basic.email ?? "").trim(),
      phone: (basic.phone ?? "").trim(),
      age: String(basic.age ?? "").trim(),
      gender: (basic.gender ?? "").trim(),
      personality: Array.isArray(basic.personality)
        ? basic.personality.join("|")
        : "",
      hasCar: basic.hasCar ?? "",
      canDriveDate: basic.canDriveDate ?? "",
      dateType: Array.isArray(prefs.dateType) ? prefs.dateType.join("|") : "",
      dateGroup: prefs.dateGroup ?? "",
      locations: Array.isArray(prefs.locations)
        ? prefs.locations.join("|")
        : "",
      desiredTraits: Array.isArray(prefs.desiredTraits)
        ? prefs.desiredTraits.join("|")
        : "",
      notes: (prefs.typeDesc ?? "").trim(),
      otherActivity: (prefs.otherActivity ?? "").trim(),
      createdAt: new Date().toISOString(),
    };

    await csvWriter.writeRecords([row]);
    console.log("✅ Saved to:", csvPath);

    return res.status(200).json({ ok: true, savedTo: csvPath });
  } catch (err) {
    console.error("❌ /submit error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// ✅ Use 5001 (avoid macOS/other process on 5000)
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ CSV will be saved to: ${csvPath}`);
});

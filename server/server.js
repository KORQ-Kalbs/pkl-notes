const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  }),
);
app.use(express.json());

const NOTE_COLUMNS = [
  "note_date",
  "title",
  "summary",
  "activities",
  "tools",
  "skills",
  "obstacles",
  "reflection",
  "next_plan",
  "duration_hours",
  "location",
  "department",
  "supervisor",
  "mood",
];

const toText = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const mapNote = (body) => ({
  note_date: toText(body.note_date),
  title: toText(body.title),
  summary: toText(body.summary),
  activities: toText(body.activities),
  tools: toText(body.tools),
  skills: toText(body.skills),
  obstacles: toText(body.obstacles),
  reflection: toText(body.reflection),
  next_plan: toText(body.next_plan),
  duration_hours: toNumber(body.duration_hours),
  location: toText(body.location),
  department: toText(body.department),
  supervisor: toText(body.supervisor),
  mood: toText(body.mood),
});

const selectFields = `id, ${NOTE_COLUMNS.join(", ")}, created_at, updated_at`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/notes", async (req, res) => {
  try {
    const { q, date } = req.query;
    const limit = Math.min(parseInt(req.query.limit, 10) || 200, 500);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const values = [];
    const where = [];

    if (date) {
      values.push(date);
      where.push(`note_date = $${values.length}`);
    }

    if (q) {
      values.push(`%${q}%`);
      where.push(
        `(title ILIKE $${values.length} OR activities ILIKE $${values.length} OR summary ILIKE $${values.length})`,
      );
    }

    let sql = `SELECT ${selectFields} FROM pkl_notes`;
    if (where.length) sql += ` WHERE ${where.join(" AND ")}`;

    values.push(limit);
    sql += ` ORDER BY note_date DESC, id DESC LIMIT $${values.length}`;
    values.push(offset);
    sql += ` OFFSET $${values.length}`;

    const { rows } = await pool.query(sql, values);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to load notes" });
  }
});

app.get("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { rows } = await pool.query(
      `SELECT ${selectFields} FROM pkl_notes WHERE id = $1`,
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to load note" });
  }
});

app.post("/api/notes", async (req, res) => {
  try {
    const data = mapNote(req.body);
    if (!data.note_date || !data.title || !data.activities) {
      return res
        .status(400)
        .json({ error: "note_date, title, and activities are required" });
    }

    const values = NOTE_COLUMNS.map((key) => data[key]);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const sql = `INSERT INTO pkl_notes (${NOTE_COLUMNS.join(", ")}) VALUES (${placeholders}) RETURNING ${selectFields}`;
    const { rows } = await pool.query(sql, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const data = mapNote(req.body);
    if (!data.note_date || !data.title || !data.activities) {
      return res
        .status(400)
        .json({ error: "note_date, title, and activities are required" });
    }

    const setClause = NOTE_COLUMNS.map(
      (key, index) => `${key} = $${index + 1}`,
    ).join(", ");
    const values = NOTE_COLUMNS.map((key) => data[key]);
    values.push(id);

    const sql = `UPDATE pkl_notes SET ${setClause}, updated_at = NOW() WHERE id = $${values.length} RETURNING ${selectFields}`;
    const { rows } = await pool.query(sql, values);

    if (!rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const { rows } = await pool.query(
      "DELETE FROM pkl_notes WHERE id = $1 RETURNING id",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ id: rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

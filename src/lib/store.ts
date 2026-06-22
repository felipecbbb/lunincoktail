import { promises as fs } from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import type {
  BookingRequest,
  Category,
  EventItem,
  MenuItem,
  WaitlistEntry,
  DataFile,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// --- Postgres (Neon) — durable storage for user submissions ---------------
// Reservations (waitlist) and event bookings must persist across serverless
// invocations, so they live in Postgres. Content (menu/categories/events)
// stays in JSON. If no DATABASE_URL is set (local/build), we fall back to JSON
// so nothing breaks.
const DB_URL =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";
const sql = DB_URL ? neon(DB_URL) : null;

let schemaReady: Promise<void> | null = null;
async function ensureSchema() {
  if (!sql) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS waitlist (
        id text PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        status text NOT NULL DEFAULT 'new',
        event_id text,
        event_title text,
        name text NOT NULL,
        phone text NOT NULL,
        email text,
        guests integer NOT NULL DEFAULT 1
      )`;
      await sql`CREATE TABLE IF NOT EXISTS bookings (
        id text PRIMARY KEY,
        created_at timestamptz NOT NULL DEFAULT now(),
        status text NOT NULL DEFAULT 'new',
        event_type text,
        date text,
        guests integer NOT NULL DEFAULT 1,
        name text NOT NULL,
        email text,
        phone text,
        message text
      )`;
    })();
  }
  return schemaReady;
}

async function readJson<T>(file: string): Promise<DataFile<T>> {
  const full = path.join(DATA_DIR, file);
  const raw = await fs.readFile(full, "utf8");
  return JSON.parse(raw) as DataFile<T>;
}

async function writeJson<T>(file: string, data: DataFile<T>): Promise<void> {
  const full = path.join(DATA_DIR, file);
  data.updatedAt = new Date().toISOString();
  await fs.writeFile(full, JSON.stringify(data, null, 2), "utf8");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToWaitlist(r: any): WaitlistEntry {
  return {
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    status: r.status,
    eventId: r.event_id ?? "unknown",
    eventTitle: r.event_title ?? "Evento Lunin",
    name: r.name,
    phone: r.phone,
    email: r.email ?? undefined,
    guests: Number(r.guests) || 1,
  };
}
function rowToBooking(r: any): BookingRequest {
  return {
    id: r.id,
    createdAt: new Date(r.created_at).toISOString(),
    status: r.status,
    eventType: r.event_type,
    date: r.date,
    guests: Number(r.guests) || 1,
    name: r.name,
    email: r.email ?? "",
    phone: r.phone ?? "",
    message: r.message ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const Store = {
  // --- Content (JSON) ------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    const d = await readJson<Category>("categories.json");
    return d.items.sort((a, b) => a.order - b.order);
  },
  async getMenu(): Promise<MenuItem[]> {
    const d = await readJson<MenuItem>("menu.json");
    return d.items;
  },
  async getEvents(): Promise<EventItem[]> {
    const d = await readJson<EventItem>("events.json");
    return d.items;
  },
  async saveCategories(items: Category[]) {
    await writeJson<Category>("categories.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveMenu(items: MenuItem[]) {
    await writeJson<MenuItem>("menu.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveEvents(items: EventItem[]) {
    await writeJson<EventItem>("events.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },

  // --- Bookings (Postgres, fallback JSON) ----------------------------------
  async getBookings(): Promise<BookingRequest[]> {
    if (sql) {
      await ensureSchema();
      const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return rows.map(rowToBooking);
    }
    const d = await readJson<BookingRequest>("bookings.json");
    return d.items;
  },
  async addBooking(req: BookingRequest) {
    if (sql) {
      await ensureSchema();
      await sql`INSERT INTO bookings
        (id, created_at, status, event_type, date, guests, name, email, phone, message)
        VALUES (${req.id}, ${req.createdAt}, ${req.status}, ${req.eventType},
          ${req.date}, ${req.guests}, ${req.name}, ${req.email ?? null},
          ${req.phone ?? null}, ${req.message ?? null})
        ON CONFLICT (id) DO NOTHING`;
      return;
    }
    const existing = await this.getBookings();
    existing.unshift(req);
    await writeJson<BookingRequest>("bookings.json", {
      items: existing,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveBookings(items: BookingRequest[]) {
    if (sql) {
      await ensureSchema();
      await sql`DELETE FROM bookings`;
      for (const b of items) {
        await sql`INSERT INTO bookings
          (id, created_at, status, event_type, date, guests, name, email, phone, message)
          VALUES (${b.id}, ${b.createdAt}, ${b.status}, ${b.eventType},
            ${b.date}, ${b.guests}, ${b.name}, ${b.email ?? null},
            ${b.phone ?? null}, ${b.message ?? null})`;
      }
      return;
    }
    await writeJson<BookingRequest>("bookings.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },

  // --- Waitlist (Postgres, fallback JSON) ----------------------------------
  async getWaitlist(): Promise<WaitlistEntry[]> {
    if (sql) {
      await ensureSchema();
      const rows = await sql`SELECT * FROM waitlist ORDER BY created_at DESC`;
      return rows.map(rowToWaitlist);
    }
    const d = await readJson<WaitlistEntry>("waitlist.json");
    return d.items;
  },
  async addWaitlist(entry: WaitlistEntry) {
    if (sql) {
      await ensureSchema();
      await sql`INSERT INTO waitlist
        (id, created_at, status, event_id, event_title, name, phone, email, guests)
        VALUES (${entry.id}, ${entry.createdAt}, ${entry.status}, ${entry.eventId},
          ${entry.eventTitle}, ${entry.name}, ${entry.phone},
          ${entry.email ?? null}, ${entry.guests})
        ON CONFLICT (id) DO NOTHING`;
      return;
    }
    const existing = await this.getWaitlist();
    existing.unshift(entry);
    await writeJson<WaitlistEntry>("waitlist.json", {
      items: existing,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveWaitlist(items: WaitlistEntry[]) {
    if (sql) {
      await ensureSchema();
      await sql`DELETE FROM waitlist`;
      for (const w of items) {
        await sql`INSERT INTO waitlist
          (id, created_at, status, event_id, event_title, name, phone, email, guests)
          VALUES (${w.id}, ${w.createdAt}, ${w.status}, ${w.eventId},
            ${w.eventTitle}, ${w.name}, ${w.phone}, ${w.email ?? null}, ${w.guests})`;
      }
      return;
    }
    await writeJson<WaitlistEntry>("waitlist.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
};

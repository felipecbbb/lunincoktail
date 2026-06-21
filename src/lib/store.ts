import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  BookingRequest,
  Category,
  EventItem,
  MenuItem,
  WaitlistEntry,
  DataFile,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

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

export const Store = {
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
  async getBookings(): Promise<BookingRequest[]> {
    const d = await readJson<BookingRequest>("bookings.json");
    return d.items;
  },
  async addBooking(req: BookingRequest) {
    const existing = await this.getBookings();
    existing.unshift(req);
    await writeJson<BookingRequest>("bookings.json", {
      items: existing,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveBookings(items: BookingRequest[]) {
    await writeJson<BookingRequest>("bookings.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
  async getWaitlist(): Promise<WaitlistEntry[]> {
    const d = await readJson<WaitlistEntry>("waitlist.json");
    return d.items;
  },
  async addWaitlist(entry: WaitlistEntry) {
    const existing = await this.getWaitlist();
    existing.unshift(entry);
    await writeJson<WaitlistEntry>("waitlist.json", {
      items: existing,
      updatedAt: new Date().toISOString(),
    });
  },
  async saveWaitlist(items: WaitlistEntry[]) {
    await writeJson<WaitlistEntry>("waitlist.json", {
      items,
      updatedAt: new Date().toISOString(),
    });
  },
};

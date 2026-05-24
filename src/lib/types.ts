export type Localized = { es: string; en?: string };

export type Category = {
  id: string;
  slug: string;
  name: Localized;
  order: number;
  enabled: boolean;
  icon?: string;
  hero?: string;
  description?: Localized;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: Localized;
  ingredients: Localized;
  price: number;
  image?: string;
  enabled: boolean;
  signature?: boolean;
  order?: number;
};

export type EventItem = {
  id: string;
  title: Localized;
  description: Localized;
  date: string;
  time?: string;
  image?: string;
  ctaLabel?: Localized;
  ctaUrl?: string;
  enabled: boolean;
};

export type BookingRequest = {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "confirmed" | "declined";
  eventType:
    | "cumpleanos"
    | "despedida"
    | "corporativo"
    | "privado"
    | "catering"
    | "otro";
  date: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
};

export type DataFile<T> = {
  items: T[];
  updatedAt: string;
};

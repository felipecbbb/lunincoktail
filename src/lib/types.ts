export type Localized = { es: string; en?: string; uk?: string };

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
  /** Destacado: se muestra como cartelera principal con todos los detalles. */
  featured?: boolean;
  /** Precio mostrado tal cual, p.ej. "50 € / persona". */
  priceLabel?: Localized;
  /** Etiqueta de urgencia, p.ej. "Plazas VIP limitadas". */
  badge?: Localized;
  /** Lista de "qué incluye". */
  includes?: Localized[];
  /** Condiciones de la promoción / evento. */
  conditions?: Localized[];
};

export type BookingRequest = {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "confirmed" | "declined";
  eventType:
    | "mesa"
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

export type WaitlistEntry = {
  id: string;
  createdAt: string;
  status: "new" | "contacted" | "confirmed" | "declined";
  eventId: string;
  eventTitle: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
};

export type DataFile<T> = {
  items: T[];
  updatedAt: string;
};

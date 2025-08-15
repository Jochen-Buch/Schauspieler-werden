\"use client\"

import React, { useMemo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles, Wand2, Moon, Sun, ShoppingBag, Info, Search, Filter, X, Shuffle, Star } from "lucide-react";

type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";
const HOUSES: House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
const SECTIONS = [
  { id: "new", label: "Neuheiten" },
  { id: "rare", label: "Raritäten" },
  { id: "school", label: "Schulbücher" },
  { id: "restricted", label: "Verbotene Abteilung" },
] as const;

type Book = {
  id: string;
  title: string;
  author: string;
  house: House;
  section: typeof SECTIONS[number]["id"];
  year: number;
  blurb: string;
  rarity: number; // 1..5
  price: number;
};

const ALL_BOOKS: Book[] = [
  {
    id: "bk9",
    title: "Schauspieler werden: Tipps, Tricks und ein grosses Geheimnis",
    author: "Jochen Horst",
    house: "Ravenclaw",
    section: "new",
    year: 2025,
    blurb:
      "Ein ehrlicher Blick hinter die Kulissen der Schauspielkunst – mit praxisnahen Tipps, provokanten Einsichten und drei Jahrzehnten Erfahrung von Bühne, Film und Fernsehen.",
    rarity: 2,
    price: 24,
  },
  {
    id: "bk2",
    title: "Phantastische Tierwesen & wo sie zu finden sind",
    author: "Newt Scamander",
    house: "Hufflepuff",
    section: "new",
    year: 2001,
    blurb: "Ein Feldführer zu Kreaturen, die lieber nicht gekitzelt werden sollten. Mit handschriftlichen Randnotizen!",
    rarity: 3,
    price: 16,
  },
  {
    id: "bk3",
    title: "Das Standard-Zauberwerk (Band 6)",
    author: "Miranda Falke",
    house: "Gryffindor",
    section: "school",
    year: 1996,
    blurb: "Pflichtlektüre – robust, zuverlässig, ideales Übungsbuch für N.E.W.T.s.",
    rarity: 1,
    price: 9,
  },
  {
    id: "bk5",
    title: "Geschichte der Zauberei",
    author: "Bathilda Bagshot",
    house: "Ravenclaw",
    section: "school",
    year: 1947,
    blurb: "Von Runenreformen bis Zaubereiministerien – trocken? Vielleicht. Unverzichtbar? Definitiv.",
    rarity: 2,
    price: 14,
  },
  {
    id: "bk6",
    title: "Rezepturen & Tränke für Fortgeschrittene",
    author: "Libatius Borage",
    house: "Slytherin",
    section: "rare",
    year: 1946,
    blurb: "Für Meister:innen des Kessels. Enthält Korrekturen einer gewissen mysteriösen Hand...",
    rarity: 4,
    price: 28,
  },
  {
    id: "bk8",
    title: "Die Märchen von Beedle dem Barden",
    author: "Beedle der Barde",
    house: "Hufflepuff",
    section: "rare",
    year: 1405,
    blurb: "Zeitlose Geschichten mit mehr Wahrheit zwischen den Zeilen, als Muggel je ahnten.",
    rarity: 4,
    price: 32,
  },
];

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return { dark, setDark } as const;
}

const FloatingCandle: React.FC<{ idx: number }> = ({ idx }) => {
  const delay = (idx * 1.37) % 5;
  const left = 5 + ((idx * 97) % 90);
  const height = 10 + ((idx * 53) % 70);
  return (
    <motion.div
      className="pointer-events-none fixed top-0 z-10"
      style={{ left: `${left}%` }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: height, opacity: 1 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
    >
      <div className="relative">
        <div className="h-8 w-2 rounded-sm bg-amber-200 shadow-[0_0_20px_rgba(252,211,77,.9)] dark:shadow-[0_0_24px_rgba(252,211,77,.7)]" />
        <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-300 animate-pulse shadow-[0_0_18px_rgba(255,255,200,1)]" />
      </div>
    </motion.div>
  );
};

const Starfield: React.FC = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-indigo-900 via-slate-900 to-zinc-900 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_75%)]"
    >
      {[...Array(120)].map((_, i) => (
        <span
          key={i}
          className="absolute h-0.5 w-0.5 rounded-full bg-white/70"
          style={{
            top: `${(i * 137) % 100}%`,
            left: `${(i * 89) % 100}%`,
            opacity: 0.6 + ((i * 17) % 40) / 100,
            animation: `twinkle ${(2 + ((i * 23) % 5))}s ease-in-out ${(i % 3) * 0.7}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes twinkle { 0%, 100% { transform: scale(1); opacity: .6 } 50% { transform: scale(1.6); opacity: 1 } }`}</style>
    </div>
  );
};

export default function Page() {
  const { dark, setDark } = useTheme();
  const [query, setQuery] = useState("");
  const [house, setHouse] = useState<House | "">("");
  const [section, setSection] = useState<string>("new");
  const [sort, setSort] = useState<"popular" | "price" | "year" | "rarity">("popular");
  const [cart, setCart] = useState<string[]>([]);
  const [active, setActive] = useState<Book | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);

  const books = useMemo(() => {
    let list = ALL_BOOKS.filter((b) => b.section === section);
    if (house) list = list.filter((b) => b.house === house);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.blurb.toLowerCase().includes(q)
      );
    }
    const by = {
      popular: (a: Book, b: Book) => b.rarity - a.rarity,
      price: (a: Book, b: Book) => a.price - b.price,
      year: (a: Book, b: Book) => b.year - a.year,
      rarity: (a: Book, b: Book) => b.rarity - a.rarity,
    }[sort];
    return [...list].sort(by);
  }, [query, house, section, sort, shuffleKey]);

  const toggleCart = (id: string) => setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <div className="min-h-screen text-zinc-100">
      <Starfield />
      {[...Array(18)].map((_, i) => (
        <FloatingCandle key={i} idx={i} />
      ))}

      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }}>
              <Wand2 className="h-7 w-7" />
            </motion.div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Der Verbotene Winkel – Buchladen von Hogwarts</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              aria-label="Theme umschalten"
              className="rounded-full p-2 hover:bg-white/10"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <ShoppingBag className="h-4 w-4" /> Warenkorb ({cart.length})
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/5">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Willkommen, Hexen & Zauberer
            </div>
            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">Stöbere wie in der Winkelgasse – direkt in Hogwarts</h2>
            <p className="mt-3 max-w-prose text-white/80">
              Fliegende Kerzen, knisternde Regale, und Bücher, die dich finden.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {HOUSES.map((h) => (
                <button
                  key={h}
                  onClick={() => setHouse((v) => (v === h ? "" : h))}
                  className={`cursor-pointer select-none rounded-full border border-white/10 px-3 py-1 text-sm ${house === h ? "bg-emerald-600" : "bg-white/10"}`}
                >
                  {h}
                </button>
              ))}
              {house && (
                <button className="text-sm underline underline-offset-4" onClick={() => setHouse("")}>
                  Alle Häuser
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 opacity-70" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Suche nach Titel, Autor, Thema…"
                  className="rounded-md border border-white/10 bg-black/30 px-8 py-2 outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 opacity-70" />
                <div className="inline-flex gap-1 rounded-md border border-white/10 bg-white/5 p-1 text-sm">
                  {SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSection(s.id)}
                      className={`rounded px-3 py-1 ${section === s.id ? "bg-white/20" : ""}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <label className="text-sm opacity-80">Sortierung:</label>
                <select
                  className="rounded-md border border-white/10 bg-black/30 px-2 py-2 text-sm outline-none"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                >
                  <option value="popular">Beliebtheit</option>
                  <option value="price">Preis</option>
                  <option value="year">Jahr</option>
                  <option value="rarity">Seltenheit</option>
                </select>
                <button
                  className="rounded-md border border-white/10 bg-white/5 p-2"
                  onClick={() => setShuffleKey((k) => k + 1)}
                  title="Regale durchwirbeln"
                >
                  <Shuffle className="h-4 w-4" />
                </button>
              </div>
          </div>

          </div>

          <div className="relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="relative mx-auto aspect-[4/3] w-full rounded-2xl border border-white/10 bg-gradient-to-br from-amber-100/10 via-violet-300/10 to-emerald-200/10 p-1 shadow-2xl">
                <div className="grid h-full grid-cols-3 gap-1 rounded-xl bg-black/30 p-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-lg bg-zinc-900/70 p-2 shadow-inner">
                      <div className="h-full w-full rounded-md border border-white/5 bg-gradient-to-b from-zinc-800 to-zinc-900" />
                    </div>
                  ))}
                </div>
                <motion.div
                  className="absolute -bottom-4 left-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs backdrop-blur"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Flüsternde Regale aktiv
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {books.length === 0 ? (
          <div className="grid place-items-center rounded-xl border border-white/10 bg-black/30 p-10 text-center">
            <Info className="mb-3 h-6 w-6" />
            <p className="text-white/80">Keine Bücher gefunden. Versuche eine andere Suche oder filtere weniger streng.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold leading-tight">{b.title}</h3>
                      <p className="text-sm text-white/70">{b.author} • {b.year}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{b.house}</span>
                  </div>
                  <p className="min-h-[3.5rem] text-sm text-white/80">{b.blurb}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < b.rarity ? "opacity-100" : "opacity-30"}`} />
                      ))}
                    </div>
                    <div className="text-lg font-semibold">{b.price} ƒ</div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm" onClick={() => setActive(b)}>
                      <span className="inline-flex items-center gap-2"><Info className="h-4 w-4" /> Details</span>
                    </button>
                    <button className="rounded-md border border-white/10 bg-white/20 px-3 py-2 text-sm" onClick={() => toggleCart(b.id)}>
                      <span className="inline-flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> {cart.includes(b.id) ? "Entfernen" : "In den Korb"}</span>
                    </button>
                  </div>
                  <div
                    className="pointer-events-none absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{ background: "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(180,160,255,0.25), transparent 40%)" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/70">
          <p>© {new Date().getFullYear()} Der Verbotene Winkel · Fan-Demo ohne kommerziellen Bezug.</p>
        </div>
      </footer>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setActive(null)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl rounded-xl border border-white/10 bg-zinc-900 p-6 text-zinc-100"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold">{active.title}</h3>
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">{active.house}</span>
              </div>
              <p className="text-white/80">{active.author} • {active.year}</p>
              <p className="mt-3 text-white/80">{active.blurb}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < active.rarity ? "opacity-100" : "opacity-30"}`} />
                  ))}
                  <span className="text-sm opacity-80">Seltenheit</span>
                </div>
                <div className="text-xl font-semibold">{active.price} ƒ</div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button className="rounded-md border border-white/10 bg-white/20 px-3 py-2 text-sm" onClick={() => toggleCart(active.id)}>
                  <span className="inline-flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> {cart.includes(active.id) ? "Aus dem Korb" : "In den Korb"}</span>
                </button>
                <button className="rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm" onClick={() => setActive(null)}>
                  <span className="inline-flex items-center gap-2"><X className="h-4 w-4" /> Schließen</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MouseGlow />
    </div>
  );
}

function MouseGlow() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>(".group")?.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--x", `${x}%`);
        el.style.setProperty("--y", `${y}%`);
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return <div ref={rootRef} />;
}

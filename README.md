
# Hogwarts-Buchladen – Next.js (deploy-ready)

Dies ist eine schlanke Next.js 14 + Tailwind App mit dem Hogwarts-inspirierten Buchladen.

## Schnellstart lokal
```bash
npm i
npm run dev
```
Öffne http://localhost:3000

## Deploy auf Vercel
1. Gehe zu https://vercel.com → New Project → Import → **Upload**.
2. Diese ZIP hochladen.
3. Framework wird automatisch als **Next.js** erkannt → **Deploy**.
4. Nach dem Deploy bekommst du eine öffentliche URL (z. B. https://hogwarts-bookshop.vercel.app).

## In Wix einbetten
- In Wix: *Element hinzufügen → Einbetten → iFrame/HTML*.
- Die Vercel-URL einfügen und Größe einstellen.

## Inhalte anpassen
- Bücher findest du in `app/page.tsx` im Array `ALL_BOOKS`.
- Farben/Styles in `app/globals.css`.

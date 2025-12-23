# Release Notes

## 2025-12-22 — cPanel deployment improvements

- Make `DEPLOYPATH` configurable via `environment.variables` (default: `/home/thatguyzi/public_html/`).
- Restrict deployment copy to **production artifacts only**: `.next/`, `public/`, `package.json`, `package-lock.json`, and `next.config.js` (uses `rsync` where available; falls back to targeted `cp`).
- Use `rsync` with `--delete` and sensible includes to avoid copying `.git`, `node_modules`, or `.env` files.

This change reduces deployment size and avoids accidentally copying sensitive or heavy directories to `public_html`.

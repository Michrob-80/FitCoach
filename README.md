# FitCoach – lokal starten, installieren, veröffentlichen, synchronisieren

## 1. Lokal starten (ohne Konto, ohne Sync)
Im Ordner ausführen: `python3 -m http.server 8080` (oder `npx serve`), dann http://localhost:8080 öffnen.
Datei per Doppelklick (file://) funktioniert, aber ohne Installation/Offline-Modus. Daten liegen im Browser (localStorage).

## 2. Supabase einrichten (für Login + Geräte-Sync)
1. Kostenloses Projekt auf supabase.com anlegen.
2. SQL Editor → neue Abfrage → Inhalt von `supabase.sql` einfügen → Run. (Tabelle + Zugriffsregeln: jeder sieht nur eigene Daten.)
3. Project Settings → API: **Project URL** und **anon public key** kopieren und in `config.js` eintragen. Niemals den `service_role`-Key verwenden.
4. Authentication → Providers → Email aktiv lassen. Für privaten Einzelgebrauch kann „Confirm email“ ausgeschaltet werden, sonst kommt eine Bestätigungs-Mail.
5. Authentication → URL Configuration: Site URL auf die spätere Adresse der App setzen.

In der App erscheint oben rechts ein ☁-Knopf: registrieren/anmelden, danach wird bei jeder Änderung automatisch gespeichert und beim Öffnen/Zurückkehren in die App abgeglichen.

Sync-Regel: Der neuere Gesamtstand gewinnt; Trainingseinheiten, die nur auf einem Gerät existieren, werden zusammengeführt. Parallele Änderungen an Plänen oder Profil auf zwei Geräten gleichzeitig können sich überschreiben – ein Gerät nach dem anderen benutzen.

## 3. Veröffentlichen (HTTPS ist Pflicht für Installation)
- **Netlify Drop** (netlify.com/drop): Ordner ins Browserfenster ziehen. Fertig.
- Alternativen: Vercel, Cloudflare Pages, GitHub Pages – einfach alle Dateien dieses Ordners als statische Seite ausliefern.
Der Anon-Key im Browser ist öffentlich vorgesehen; geschützt wird über die Zugriffsregeln aus `supabase.sql`.

## 4. Als App installieren
- **iPhone:** In Safari öffnen → Teilen → „Zum Home-Bildschirm“.
- **Android:** Chrome → Menü → „App installieren“.
- **Windows/Mac:** Chrome/Edge → Installieren-Symbol in der Adressleiste.

## 5. Grenzen / Hinweise
- Offline funktioniert die App nach dem ersten Laden; Sync läuft, sobald wieder Internet da ist.
- Erinnerungen: Die Benachrichtigung erscheint nur, solange die App geöffnet ist. Zuverlässige Push-Erinnerungen im Hintergrund benötigen einen Server (Web Push) und sind nicht enthalten.
- Backup: Profil → „Export“ regelmäßig nutzen (zusätzlich zum Cloud-Sync).
- Nach Änderungen an Dateien in `sw.js` die Version `fc-v1` erhöhen, damit Geräte den Cache erneuern.
- Trainingspläne sind allgemeine Orientierung und ersetzen keine medizinische oder trainerische Beratung.

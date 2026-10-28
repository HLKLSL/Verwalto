# Verwalto lokal starten

Die aktuelle Entwicklungsfassung besteht aus einem React-Frontend und einer FastAPI-API. Sie ist für lokalen Betrieb vorgesehen und benötigt Python 3.11+, Node.js 20.19+ (oder 22.12+) und PostgreSQL.

## 1. Datenbank vorbereiten

Lege lokal eine leere PostgreSQL-Datenbank namens `verwalto` an. Starte danach in PowerShell das Backend:

```powershell
cd C:\Users\henry\OneDrive\Verwalto\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DATABASE_URL = "postgresql+psycopg://<DB_BENUTZER>:<URL-KODIERTES_PASSWORT>@127.0.0.1:5432/verwalto"
alembic upgrade head
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Ersetze `<DB_BENUTZER>` und `<URL-KODIERTES_PASSWORT>` durch die Zugangsdaten deiner lokalen Datenbank.

## 2. Oberfläche starten

Öffne ein zweites PowerShell-Fenster:

```powershell
cd C:\Users\henry\OneDrive\Verwalto\frontend
npm install
npm run dev
```

Öffne die von Vite angezeigte lokale Adresse, üblicherweise `http://127.0.0.1:5173`. Beim ersten Start richtest du dort das lokale Administratorprofil ein.

## Hinweise

Dies ist die Entwicklungsfassung, kein Installationsprogramm. Die erste Einrichtung läuft lokal. Der aktuelle Funktionsumfang umfasst Anmeldung, Arbeitsbereiche und Rollen sowie Kategorien, Objekte, Einheiten und Parteien. Fristen, Dokumente, Finanzen und KI sind noch nicht implementiert. Sichere die Datenbank selbst und stelle Entwicklungsdienste nicht öffentlich ins Internet.

# Windows quick run

## 1. Install Node.js

Install Node.js 20+.

Check:

```powershell
node -v
npm -v
```

## 2. Open PowerShell in the project folder

```powershell
cd path\to\lld-practice-platform
```

## 3. Install everything

```powershell
npm install
npm run install:all
```

## 4. Start

```powershell
npm run dev
```

Keep this terminal open.

## 5. Open the app

Go to:

http://localhost:5173

## 6. Stop

Press:

```text
Ctrl + C
```

## If port 4000 is busy

Open `backend/.env` and set another port, for example:

```env
PORT=4001
```

Then update the Vite proxy in `frontend/vite.config.ts` from `4000` to `4001`.

## If the browser shows "Failed to fetch"

Make sure the backend terminal says:

```text
LLD Practice API running at http://localhost:4000
```

Then refresh the browser.

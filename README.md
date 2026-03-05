# Agent Code Plan

Single-page project planning board — designed to be dropped into any project. AI agents update `tasks.json` to track progress; you view and manage everything in the browser.

Two views, Notion-database style:

- **Table view** — full detail with inline status and priority editing
- **Kanban board** — drag-and-drop cards across status columns

Files:

- `plan.html` — UI, styles, and logic _(add to `.gitignore`)_
- `tasks.json` — task data, readable and writable by agents
- `tasks.schema.json` — JSON Schema contract for `tasks.json`
- `server.js` — optional Node.js server for write-back support _(add to `.gitignore`)_

## How the sync works

**With Live Server (Option A):** `plan.html` fetches `tasks.json` fresh on every page load. When an agent writes `tasks.json`, Live Server detects the change and reloads the browser automatically. UI edits (add, edit, delete) are held in memory only — they are not written back to disk.

**With Node server (Option B):** Every UI change (add, edit, delete) is automatically POSTed to the server and written directly to `tasks.json`. No manual export or reload needed.

Your `.gitignore` should include `plan.html` and `server.js` so only `tasks.json` is tracked by version control.

## Features

- Table and board view toggle
- Search by title, description, or assignee
- Filters: type, status, priority
- Sorting: created date, priority, title (ascending and descending)
- Add, edit, view, and delete items via modals
- View and Edit icon buttons on board cards
- Inline status and priority editing in table rows
- Board column sort controls and quick-add inputs
- Drag-and-drop status changes in board view
- `updatedAt` stamped automatically when an item is edited
- Progress chip: `Done: X/total (Y%)`
- Dark/light mode toggle persisted across sessions
- UI preferences (view, sort, board column sort) persisted in `localStorage`
- Auto-saves to `tasks.json` on every change when running via Node server

## Run Locally

### Option A — Live Server (read-only UI)

1. Install the **Live Server** extension in VS Code.
2. Open this project folder in VS Code.
3. Right-click `plan.html` → **Open with Live Server**.

UI edits (add, edit, delete) are held in memory for the current session only — they are not written back to `tasks.json`. Use this option when you only need to view agent-written data.

### Option B — Node server (edits write directly to `tasks.json`)

Requires Node.js. The included `server.js` serves the app on `http://127.0.0.1:47821` and handles `POST /tasks.json` to persist UI changes immediately without an export step.

**Start manually:**

```bash
node server.js
```

Then open `http://localhost:47821` in your browser.

**Auto-start on folder open (VS Code):**

Create `.vscode/tasks.json` in this project with the following content, then re-open the folder. VS Code will prompt _"Allow automatic tasks?"_ once — allow it, and the server starts silently every time you open the project.

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Tracker Server",
            "type": "shell",
            "command": "node server.js",
            "options": {
                "cwd": "${workspaceFolder}"
            },
            "isBackground": true,
            "problemMatcher": [],
            "runOptions": {
                "runOn": "folderOpen"
            },
            "presentation": {
                "reveal": "silent",
                "panel": "dedicated",
                "showReuseMessage": false
            }
        }
    ]
}
```

## Data Shape

```json
{
    "$schema": "./tasks.schema.json",
    "title": "My Project",
    "items": [
        {
            "id": 1,
            "title": "Task title",
            "description": "Details",
            "type": "task",
            "status": "Todo",
            "priority": "medium",
            "assignee": "Name",
            "createdAt": "2026-03-05",
            "updatedAt": "2026-03-05"
        }
    ]
}
```

Allowed values:

- `type`: `task`, `feature`, `bug`
- `status`: `Todo`, `In Progress`, `Done`
- `priority`: `low`, `medium`, `high`
- `updatedAt`: optional — set automatically by the UI when an item is edited; agents should set it when updating an item

## Agent contract

Agents should:

1. Read `tasks.json` for current project state.
2. Edit items by updating their fields and setting `"updatedAt"` to today's date.
3. Add new items by appending to the `items` array with a unique `id`, valid `type`/`status`/`priority` values, and today's date for `createdAt`.
4. Never modify `plan.html` or `tasks.schema.json`.

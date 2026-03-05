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

Your `.gitignore` should include `plan.html` and `server.js` so only `tasks.json` is tracked by version control.

## Features

Full CRUD via modals — add, edit, view, and delete items. Table rows support inline status and priority editing without opening a modal. The board supports drag-and-drop between columns, per-column sort controls, and a quick-add input on each column.

`updatedAt` is stamped automatically on every edit. A progress chip in the header shows `Done: X/total (Y%)`. UI preferences (view, sort, board column sort, dark/light mode) are persisted in `localStorage`. When running via the Node server, every change is written straight to `tasks.json`.

## Run Locally

Requires Node.js.

1. Create `.vscode/tasks.json` in this project with the content below, then re-open the folder. VS Code will prompt _"Allow automatic tasks?"_ once — allow it, and `server.js` starts silently on every folder open.
2. Open `http://localhost:47821` in your browser.

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Start Tracker Server",
            "type": "shell",
            "command": "node server.js", //replace this with the location of your server.js file
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

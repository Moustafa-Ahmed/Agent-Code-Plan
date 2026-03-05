# Agent Code Plan

Single-page project planning board — designed to be dropped into any project as two files (`plan.html` + `tasks.json`). AI agents update `tasks.json` to track progress; you view and manage everything through `plan.html` served by Live Server.

Two views, Notion-database style:

- **Table view** — full detail, inline priority editing
- **Kanban board** — drag-and-drop across status columns

Files:

- `plan.html` — UI, styles, and logic _(add to `.gitignore`)_
- `tasks.json` — task data, readable and writable by agents
- `tasks.schema.json` — JSON Schema contract for `tasks.json`

## How the sync works

`plan.html` **always fetches `tasks.json` fresh on every page load** — there is no item cache. Live Server detects any file change and auto-reloads the browser, so:

- **Agent writes `tasks.json`** → Live Server reloads → you see the updated data immediately.
- **You edit/add/delete via the UI** → changes live in memory → click **Export tasks.json** to download and replace the file on disk → Live Server reloads and agents see your changes.

Your `.gitignore` for the project should include `plan.html` so only `tasks.json` is tracked by version control.

## Features

- Table and board view toggle
- Search by title, description, or assignee
- Filters: type, status, priority
- Sorting: created date, priority, title
- Add, edit, view, and delete items
- View and Edit buttons on board cards
- Inline priority dropdown in table
- Board column sort controls and quick-add inputs
- Drag-and-drop status changes in board view
- `updatedAt` stamped automatically when an item is edited
- Progress chip: `Done: X/total (Y%)`
- **Export tasks.json** button — downloads current in-memory state as `tasks.json`
- UI preferences (view, sort, board column sort) persisted in `localStorage`

## Run Locally

1. Install the **Live Server** extension in VS Code.
2. Open this project folder in VS Code.
3. Right-click `plan.html` → **Open with Live Server**.

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

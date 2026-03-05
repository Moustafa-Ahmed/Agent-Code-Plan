# Agent Code Plan

Single-page project planning board with two views:
- Table view for detailed editing
- Kanban board view with drag-and-drop

The app is implemented as static files:
- `plan.html` (UI, styles, and logic)
- `tasks.json` (seed data)

## Features

- Table and board toggle
- Search by title/description/assignee
- Filters: type, status, priority
- Sorting: created date and priority
- Add, edit, view, and delete items
- Inline status/priority updates
- Board column quick-add
- Drag-and-drop status changes in board view
- Local persistence via browser `localStorage`

## Run Locally

This project is built with the expectation that you run it using the VS Code **Live Server** extension.

Steps:
1. Install the **Live Server** extension in VS Code.
2. Open this project folder in VS Code.
3. Right-click `plan.html` and choose **Open with Live Server**.
4. The page will open in your browser on a local Live Server URL.

## Data Shape

`tasks.json` uses this structure:

```json
{
  "title": "Project Build Database",
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
      "done": false
    }
  ]
}
```

Allowed values:
- `type`: `task`, `feature`, `bug`
- `status`: `Todo`, `In Progress`, `Done`
- `priority`: `low`, `medium`, `high`

## Notes

- Existing saved state in `localStorage` takes precedence over `tasks.json`.
- To reset to file data, clear browser storage for this page/domain.

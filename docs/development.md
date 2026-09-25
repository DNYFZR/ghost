# Development Notes

- The application consists of a Rust Tauri backend & a Typescript React front end.

## Active Features

- Code editor with syntax highlighting & font size controls 

- Terminal interface - users can run commands in a PowerShell terminal & clear the terminal output 

- File system navigation - users can navigate via the app menu

- Integration exists between the terminal & filesystem viewer - when a user navigates within one, the other automatically updates

- File I/O - users can open (text based) files in the editor, amend and save / save-as, or delete the active file from the system

- Markdown rendering toggle - when a markdown file is open, users can render this as a readable document in the editor window

- Restart app - users can start a new session by hitting the trash can button to close all files & clear the terminal

## Feature Enhancements

- How the backend handles larger files, currently if a large enough file is requested the backend can slow down the system.
  
- Implement handling of common non-text files such as PDFs or images.

- Implement a data viewer for common data files such as csv or parquet

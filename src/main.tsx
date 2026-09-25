// Frontend UI
import "./main.css";
import ReactDOM from "react-dom/client";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import trashIcon from "/icons/trash-128.png";
import refreshIcon from "/icons/refresh-128.png";
import codeIcon from "/icons/code-128.png";
import noteIcon from "/icons/notes-128.png";
import saveIcon from "/icons/save-128.png";
import settingsIcon from "/icons/settings-128.png";

import Editor from "./components/Editor";
import Terminal from "./components/Terminal";
import Inforbar from "./components/Infobar";
import Sidebar from "./components/Sidebar";
import Filesystem from "./components/Filesystem";
import Popup from "./components/Popup";
import Render from "./components/Markdown";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function App() {
  // Display controls
  const [fontSize, setFontSize] = useState<number>(14);
  const [showSettingsPopup, setShowSettingsPopup] = useState<boolean>(false);
  const [showSavePopup, setShowSavePopup] = useState<boolean>(false);
  const [showMarkdown, setShowMarkdown] = useState<boolean>(false);

  // Shell controls
  const [cwd, setCwdPath] = useState<string>("");
  const [cwdListing, setCwdListing] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [terminalText, setTerminalText] = useState<string[]>([]);

  // File controls
  const [activePath, setActivePath] = useState<string>("");
  const [activeContent, setActiveContent] = useState<string>("");

  const [contentType, setContentType] = useState<string>("");
  const [formAction, setFormAction] = useState<string>("");

  const [saveResult, setSaveResult] = useState<string[]>([]);
  const [savePath, setSavePath] = useState<string>("");
  const [deleteResult, setDeleteResult] = useState<string>("");

  async function scanFiles(path: string) {
    const file: string[] = await invoke("scan_fs", { path: path });
    const filename = path.split("/").reverse()[0];

    // Set file contents
    if (file.length > 0) {
      const file_as_string = `${file[0]}\n`.concat(
        ...file.slice(1).map((v) => `${v}\n`),
      );
      setActiveContent(file_as_string);
    } else {
      setActiveContent("");
    }

    // Set syntax highlighting
    if (filename.includes(".")) {
      // highlighting .rs files won't work on rs - must be rust
      const filetype = filename.split(".").reverse()[0];
      if (filetype === "rs") {
        setContentType("rust");
      } else {
        setContentType(filetype);
      }
    // if no filetype available in name
    } else {
      setContentType("unavailable");
    }
  }

  async function scanDirs(path: string) {
    const requestedContent: string[] = await invoke("scan_fs", { path: path });

    // Get filesystem listing
    if (requestedContent[0] !== "error") {
      setCwdListing(requestedContent);
    } else {
      setCwdListing([]);
    }
  }

  async function saveFile(method: string, path: string, data: string) {
    let func_call = "";

    if (method === "create") {
      func_call = "save_file_as";
    }

    if (method === "overwrite") {
      func_call = "save_file";
    }

    if (func_call.length > 0) {
      await invoke(func_call, { path: path, data: data });
      setSaveResult(["File saved to : ", path.split("/").reverse()[0]]);
    }

    // refresh file tree
    scanDirs(cwd);
  }

  async function deleteFile(path: string) {
    setDeleteResult(await invoke("delete_file", { path: path }));
  }

  async function updateSettings(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
   if (formAction === "OK") {
      setSaveResult([]);

      if (activePath) {
        scanFiles(activePath);
        scanDirs(activePath);
      } else {
        setActivePath("");
        setActiveContent("");
        setContentType("");
      }
    } else if (formAction === "SAVE") {
      if (savePath && activeContent.length > 0) {
        saveFile("create", savePath, activeContent);
        setSavePath("");
      } else {
        setSaveResult(["Save-as error : please enter a valid filepath"]);
      }
    } else if (formAction === "OVERWRITE") {
      if (activePath && activeContent.length > 0) {
        saveFile("overwrite", activePath, activeContent);
        setSavePath("");
      } else {
        setSaveResult(["Save error : could not overwrite existing file"]);
      }
    }
  }

  function selectDisplay() {
    if(showMarkdown && contentType === "md"){
      return <Render
        filename={activePath.split("/").reverse()[0]}
        activeContent={activeContent}
        fontSize={fontSize}
      />
    } else {
      return <Editor
        filename={activePath.split("/").reverse()[0]}
        fileContent={activeContent}
        onUserUpdate={(e) => setActiveContent(e.target.value)}
        fontSize={fontSize}
        contentType={contentType}
      />
    }
  }

  return (
    <main
      onLoad={async () => {
        // Set user documents directory as initial app working directory
        // Infobar component will show loading message while cwd.length == 0
        if (cwd.length == 0) {
          await invoke("set_cwd", { path: "%USERPROFILE%/documents" });
          setCwdPath(await invoke("get_cwd"));
        }
      }}
    >
      <div className="container">
        {/* Render Markdown */}
        <button
          title="Render Markdown"
          className="markdown-button"
          onClick={() => setShowMarkdown(!showMarkdown)}
        >
          <img
            src={noteIcon}
            alt="render markdown"
            className="sidebar-button-img"
          />
        </button>

        {/* Show Terminal */}
        <button
          title="Show Terminal"
          className="terminal-button"
          onClick={() => setShowTerminal(!showTerminal)}
        >
          <img
            src={codeIcon}
            alt="show / hide terminal"
            className="sidebar-button-img"
          />
        </button>

        {/* Clear Terminal */}
        <button
          title="Clear Terminal"
          className="clear-terminal-button"
          onClick={() => setTerminalText([`${cwd}>`])}
        >
          <img
            src={trashIcon}
            alt="clear terminal"
            className="sidebar-button-img"
          />
        </button>

        {/* Clear Editor */}
        <button
          title="Restart App"
          className="refresh-button"
          onClick={() => window.location.reload()}
        >
          <img
            src={refreshIcon}
            alt="restart app"
            className="sidebar-button-img"
          />
        </button>

        {/* App Settings */}
        <button
          className="settings-button"
          title="App Settings"
          onClick={() => setShowSettingsPopup(!showSettingsPopup)}>
          <img
            src={settingsIcon}
            alt="app settings"
            className="sidebar-button-img"
          />
        </button>

        <Popup
          title="Settings"
          showPopup={showSettingsPopup}
          setShowPopup={setShowSettingsPopup}
        >
          <div className="row">
            <label>Font size : </label>
            <input
              type="number"
              min={10}
              step={1}
              max={40}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            />
          </div>

          <div className="row">
            <label>Display Syntax : </label>
            <input
              className="input"
              placeholder="filetype e.g. toml..."
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            />
          </div>
        </Popup>


        {/* Save Editor File */}
        <button
          className="save-button"
          title="Save"
          onClick={() => {
            if (!showSavePopup) {
              setSaveResult([]);
              setDeleteResult("");
            }
            setShowSavePopup(!showSavePopup);
          }}>
          <img
            src={saveIcon}
            alt="Save Icon"
            className="sidebar-button-img"
          />
        </button>
        <Popup
          title="Save Options"
          showPopup={showSavePopup}
          setShowPopup={setShowSavePopup}
        >
          <div className="col">
            <div className="row">
              <label>Save Current File : </label>
              <form onSubmit={(e) => updateSettings(e)}>
                <button
                  type="submit"
                  onClick={() => setFormAction("OVERWRITE")}
                >
                  OK
                </button>
              </form>
            </div>

            <div className="row">
              <label>Save File As : </label>
              <form onSubmit={(e) => updateSettings(e)}>
                <button
                  type="submit"
                  onClick={() => {
                    if (savePath.length > 0) {
                      setFormAction("SAVE");
                    } else {
                      setFormAction("");
                    }
                  }}
                >
                  OK
                </button>
                <input
                  placeholder="filepath..."
                  value={savePath}
                  onChange={(e) => setSavePath(e.target.value)}
                />
              </form>
            </div>

            <div className="row">
              <label>Delete Active File : </label>
              <form>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    if (activePath.length > 0) {
                      setFormAction("DELETE");
                      deleteFile(activePath);
                      setActiveContent("");
                      setActivePath("");
                    }
                  }}
                >
                  OK
                </button>
              </form>
            </div>
          </div>

          <pre className="highlight-text">
            {saveResult.length > 0 ? saveResult : null}
            {deleteResult.length > 0 ? deleteResult : null}
          </pre>
        </Popup>


        {/* Component Features */}
        <Sidebar>
          <Filesystem
            cwd={cwd}
            cwdListing={cwdListing}
            setCwdPath={setCwdPath}
            setActivePath={setActivePath}
            scanFiles={scanFiles}
            scanDirs={scanDirs}
          />
        </Sidebar>

        {!showTerminal ? selectDisplay() : null }

        {showTerminal ? <Terminal
          showTerminal={showTerminal}
          setShowTerminal={setShowTerminal}
          cwd={cwd}
          setCwdPath={setCwdPath}
          terminalText={terminalText}
          setTerminalText={setTerminalText}
          fontSize={fontSize}
        /> : null }

        <Inforbar
          cwd={cwd}
          contentType={contentType? contentType : "Inactive"}
          fontSize={fontSize}
        />
      </div>
    </main>
  );
}

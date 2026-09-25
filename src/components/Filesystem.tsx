// Filesystem UI
import "./Filesystem.css";
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import arrowIcon from "/icons/arrow-128.png";

interface FilesystemProps {
  cwd: string;
  cwdListing: string[];
  setCwdPath: React.Dispatch<React.SetStateAction<string>>;
  setActivePath: React.Dispatch<React.SetStateAction<string>>;
  scanFiles: Function;
  scanDirs: Function;
}

const Filesystem: React.FC<FilesystemProps> = ({
  cwd,
  cwdListing,
  setCwdPath,
  setActivePath,
  scanFiles,
  scanDirs
}) => {
  const [cwdDisplay, setCwdDisplay] = useState<React.ReactElement[]>([]);

  // Update filesystem display when user navigates directories
  useEffect(() => {
    scanDirs(cwd);
  }, [cwd]);

  useEffect(() => {
    processPaths(cwdListing);
  }, [cwdListing]);

  async function setCWD(path: string) {
    await invoke("set_cwd", { path: path });
  }

  async function handleCwdUpdate(path: string) {
    setCWD(path);
    scanDirs(path);
    setCwdPath(await invoke("get_cwd"));
  }

  async function processPaths(paths: string[]) {
    // Process active directory content for UI
    let files: React.ReactElement[] = [];
    let dirs: React.ReactElement[] = [];

    // Map over the paths to check which are dirs or files
    const promises = paths.map(async (path) => {
      const isDirectory = await invoke("check_is_dir", {path: path});

      // Return an object that links the path to its boolean result
      return {
        path: path,
        isDir: isDirectory
      };
    });

    // Wait for all the promises to resolve together
    const resolvedPaths = await Promise.all(promises);

    // Format the results for UI
    resolvedPaths.forEach(item => {
      const newCWD = `${cwd}/${item.path}`;

      if (item.isDir) {
        dirs.push(
          <button className="fs-entry" onClick={() => handleCwdUpdate(newCWD)}>
            📁 {item.path}
          </button>
        );
      } else {
        files.push(
          <button
            className="fs-entry"
            onClick={() => {
              setActivePath(newCWD);
              scanFiles(newCWD);
            }}
          >
            📄 {item.path}
          </button>
        );
      }

    });

    // Sort arrays for display
    dirs.sort();
    files.sort();
    setCwdDisplay([...dirs, ...files]);
  }

  return (
    <div
      className="container"
      onLoad={() => scanDirs(cwd)}
    >

      <div className="row-header">
        <h4>File Explorer</h4>
        {/* Navigate back up filesystem tree */}
        <button onClick={() => handleCwdUpdate(`${cwd}/../`)}>
          <img
            src={arrowIcon}
            title="Back"
            alt="go back"
            className="fs-back-icon"
          />
        </button>
      </div>

      <div className="active-path">{cwd}</div>

      <div>{cwdDisplay}</div>
    </div>
  );
};

export default Filesystem;

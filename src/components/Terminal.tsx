// Terminal Interface Component
import "./Terminal.css";
import React, { useEffect } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import { invoke } from "@tauri-apps/api/core";

interface TerminalProps {
  showTerminal: React.SetStateAction<boolean>;
  setShowTerminal: React.Dispatch<React.SetStateAction<boolean>>;
  cwd: string;
  setCwdPath: React.Dispatch<React.SetStateAction<string>>;
  terminalText: string[];
  setTerminalText: React.Dispatch<React.SetStateAction<string[]>>;
  fontSize: number;
}

const Terminal: React.FC<TerminalProps> = ({
  showTerminal,
  setShowTerminal,
  cwd,
  setCwdPath,
  terminalText,
  setTerminalText,
  fontSize,
}) => {
  const cwdRef = React.useRef<string>(cwd);
  const terminalTextRef = React.useRef<string[]>(terminalText);
  async function callTerminal(command: string) {
    // Run terminal call to backend
    command = command.trim();
    let output: string = await invoke("process_command", { args: [command] });

    // handle directory moves
    if (command.startsWith("cd")) {
       setCwdPath(await invoke("get_cwd"));
    }

    output = output.trim();

    // Handle initial load
    if (terminalText.length === 0) {
      setTerminalText([`${cwd}>`]);
      // Handle commands with no output text
    } else if (output.length === 0) {
      setTerminalText([...terminalText, `${command}\n`, `${cwd}>`.trim()]);
      // Handle commands with output
    } else {
      setTerminalText([
        ...terminalText,
        `${command}\n${output}\n`,
        `${cwd}>`.trim(),
      ]);
    }
  }

  // Initialise PowerShell on Load
  useEffect(() => {
    if(terminalText.length === 0){
      callTerminal("");
    }
  }, []);

  // Update on CWD Change
  useEffect(() => {
    const newText = terminalText;
    newText.pop();
    if (cwd !== cwdRef.current) {
      setTerminalText([...newText, `${cwd}>`]);

    } else if (terminalText.length > 0) {
      if (newText !== terminalTextRef.current) {
        setTerminalText([...newText, "\n", `${cwd}>`]);
      } else {
        setTerminalText([...newText]);
      }
    }

    cwdRef.current = cwd;
    terminalTextRef.current = newText;
  }, [cwd]);

  const executeCommand = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Execute terminal commands when enter key is pressed
    if (event.key === "Enter") {
      // Get user command from active terminalText
      const args = event.currentTarget.value.split(">");
      const newLine = args.pop();

      // Run user command
      if (newLine) {
        callTerminal(newLine);
      }

      // Allow Shift+Enter for new lines
      if (!event.shiftKey) {
        event.preventDefault();
      }
    }
  };

  // Hide terminal on esc
  const handleKeyDown = (event:KeyboardEvent) => {
    if (showTerminal && event.key === 'Escape') {
      setShowTerminal(false);
    }
  };

  React.useEffect(() => {
    if (showTerminal) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showTerminal]);

  return (
    <div>
      {showTerminal ? (
        <div>
            <p className="app-active-filename">terminal</p>

          <div className="terminal-code-editor">
            <CodeEditor
              value={terminalText.join("")}
              language="powershell"
              onKeyDown={executeCommand}
              style={{ fontSize: fontSize }}
              className="terminal-file-render"
              rehypePlugins={[
                [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
              ]}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Terminal;

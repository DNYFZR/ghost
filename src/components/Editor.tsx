// Text Editor UI
import "./Editor.css";
import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";

interface EditorProps {
  filename: string;
  fileContent: string;
  fontSize: number;
  contentType: string;
  onUserUpdate: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const Editor: React.FC<EditorProps> = ({
  filename,
  fileContent,
  fontSize,
  contentType,
  onUserUpdate,
}) => {
  return (
    <div>
      <p className="app-active-filename">{filename}</p>

      <div className="app-code-editor">
        <CodeEditor
          value={fileContent}
          language={contentType}
          placeholder="👻 Start typing....."
          onChange={onUserUpdate}
          rehypePlugins={[
            [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
          ]}
          className="app-file-render"
          style={{ fontSize: fontSize }}
        />
      </div>
    </div>
  );
};

export default Editor;

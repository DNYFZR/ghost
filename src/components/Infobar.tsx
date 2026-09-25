import "./Infobar.css";
import React from "react";

interface InfobarProps {
  cwd: string;
  fontSize: number;
  contentType: string;
}

const Inforbar: React.FC<InfobarProps> = ({ cwd, fontSize, contentType }) => {
  return (
    <div className="app-bottom-bar">
      {cwd.length > 0 ? (
        <div className="row">
          <pre className="highlight-text">📁 {cwd.replace(/\\/g, "/")}</pre>
        </div>
      ) : (
        <pre className="highlight-text">⌛ LOADING USER DIRECTORY</pre>
      )}

      {contentType !== "" ? (
        <pre className="highlight-text">
          Display Format : {contentType}
        </pre>
      ) : null}
      <pre className="highlight-text">Font Size : {fontSize}</pre>
    </div>
  );
};

export default Inforbar;

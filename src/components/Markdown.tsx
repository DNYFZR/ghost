import "./Markdown.css"
import React from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from 'remark-gfm';
import rehypeHighlight from "rehype-highlight";

interface MarkdownFile {
  filename: string;
  activeContent: string;
  fontSize: number;
}

const Render:React.FC<MarkdownFile> = ({ filename, activeContent, fontSize }) => {
  return (
    <div>
      <p className="app-active-filename">{filename}</p>

      <div className="markdown-ui" style={{ fontSize: fontSize }}>
        <Markdown
          children={activeContent}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        />
      </div>
    </div>
  );
};

export default Render

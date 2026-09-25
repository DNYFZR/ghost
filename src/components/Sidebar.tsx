import "./Sidebar.css";
import React, { useState, useRef } from "react";
import menuIcon from "/icons/menu-128.png";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const sidebarWidthRef = useRef<number>(400);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Resize sidebar
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const startResizing = React.useCallback(() => {setIsResizing(true);}, []);
  const stopResizing = React.useCallback(() => {setIsResizing(false);}, []);
  const resize = React.useCallback((mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      setSidebarWidth(mouseMoveEvent.x);
      sidebarWidthRef.current = mouseMoveEvent.x;
    }
  },[isResizing]);

  React.useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // Close sidebar
  const hideSidebar = React.useCallback((mouseMoveEvent: MouseEvent) => {
    if(showSidebar && windowRef.current){
      if (
        mouseMoveEvent.x > sidebarWidthRef.current &&
        mouseMoveEvent.x < windowRef.current.getBoundingClientRect().right - 60 &&
        mouseMoveEvent.y > windowRef.current.getBoundingClientRect().top + 20
      ) {
          setShowSidebar(false);
      }
    }
  }, [showSidebar]);

  const handleKeyDown = (event:KeyboardEvent) => {
        if (showSidebar && event.key === 'Escape') {
          setShowSidebar(false);
        }
      };

  React.useEffect(() => {
    if (showSidebar) {
      window.addEventListener('mousedown', hideSidebar);
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('mousedown', hideSidebar);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showSidebar]);

  return (
    <div>
      {/* show / hide toggle */}
      <div ref={windowRef}>
        <button
          title="Show Filesystem"
          className="sidebar-button"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <img src={menuIcon} className="sidebar-button-img" />
        </button>
      </div>

      {/* sidebar */}
      <div className="sidebar">
        {showSidebar && (
          <div className="sidebar-container">
            <div
              className="sidebar-main"
              style={{ width: sidebarWidth }}
            >
              <div className="sidebar-content">
                {children}
              </div>

              <div className="sidebar-resizer" onMouseDown={startResizing} />
            </div>
            <div className="sidebar-frame" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

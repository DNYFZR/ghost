import "./Popup.css";
import React from "react";

interface PopupProps {
  title:string
  children: React.ReactNode;
  showPopup: boolean
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({ title, children, showPopup, setShowPopup}) => {
  const handleKeyDown = (event:KeyboardEvent) => {
        if (showPopup && event.key === 'Escape') {
          setShowPopup(false);
        }
      };

  React.useEffect(() => {
    if (showPopup) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showPopup]);

  return(
    <div>
      {showPopup && (
        <div className="popup-container">
          <div className="popup-top-bar">
            <span>{title}</span>
          </div>

          <div className="popup-content">
            {children}
          </div>

          <div className="popup-bottom-bar">
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;


import "../css/popup.css";

const Popup = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`popup-overlay ${type}`}>
      <div className="popup-card">
        <p>{message}</p>
        <button onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default Popup;

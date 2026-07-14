import "./ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="ufm-modal-overlay">
      <div className="ufm-modal">
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="ufm-modal-actions">
          <button className="ufm-modal-btn ufm-modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>

          <button
            className={`ufm-modal-btn ${
              danger ? "ufm-modal-danger" : "ufm-modal-primary"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

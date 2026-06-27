function UpgradeModal({ open, title, message, onClose, onUpgrade }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="upgrade-modal">
        <h2 style={{ marginBottom: 15 }}>🚀 {title}</h2>
        <p style={{ color: "#94a3b8", marginBottom: 25 }}>{message}</p>

        <div
          className="modal-plans"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 25 }}
        >
          <div className="modal-plan">
            <h3>PRO — $19/mo</h3>
            <ul>
              <li>500 Credits</li>
              <li>1080p + 2K</li>
              <li>No Watermark</li>
              <li>Priority Queue</li>
            </ul>
            <button onClick={onUpgrade}>Get Pro</button>
          </div>

          <div className="modal-plan" style={{ border: "1px solid #8b5cf6" }}>
            <h3>ULTRA — $49/mo</h3>
            <ul>
              <li>Unlimited Credits</li>
              <li>4K Support</li>
              <li>No Watermark</li>
              <li>Fastest Generation</li>
            </ul>
            <button onClick={onUpgrade}>Get Ultra</button>
          </div>
        </div>

        <button className="close-modal-btn" onClick={onClose}>
          Maybe Later
        </button>
      </div>
    </div>
  );
}

export default UpgradeModal;
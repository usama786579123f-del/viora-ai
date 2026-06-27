import { useState } from "react";

function AdvancedTopbar({ user, setCurrentPage, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  const planIcon =
    user.plan === "free" ? "🆓" : user.plan === "pro" ? "⚡" : "👑";

  const avatarLetter = user.name?.[0]?.toUpperCase() || "U";

  const closeMenuAndGo = (page) => {
    setShowMenu(false);
    setCurrentPage(page);
  };

  const handleLogoutClick = () => {
    setShowMenu(false);
    onLogout();
  };

  return (
    <div className="advanced-topbar">

      <div className="topbar-title">
        <h1>AI Video Studio</h1>
        <p>Create next-generation videos with AI</p>
      </div>

      <div className="topbar-actions">

        <button className="icon-btn">🔔</button>

        <div className="profile-wrapper">

          <div
            className="premium-user"
            onClick={() => setShowMenu(!showMenu)}
            style={{ cursor: "pointer" }}
          >
            <div className="plan-badge">
              {planIcon} {user.plan.toUpperCase()}
            </div>

            <div
              className="avatar"
              style={{
                background:
                  user.avatarColor ||
                  "linear-gradient(135deg,#8b5cf6,#ec4899)",
              }}
            >
              {avatarLetter}
            </div>
          </div>

          {showMenu && (
            <div className="profile-menu">
              <button onClick={() => closeMenuAndGo("settings")}>
                👤 My Profile
              </button>

              <button onClick={() => closeMenuAndGo("settings")}>
                💳 Billing
              </button>

              <button onClick={() => closeMenuAndGo("settings")}>
                ⚙ Settings
              </button>

              <button onClick={handleLogoutClick}>
                🚪 Logout
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default AdvancedTopbar;
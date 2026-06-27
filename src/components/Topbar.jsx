function Topbar() {
  return (
    <div className="topbar">

      <div className="topbar-left">

        <h1>Dashboard</h1>

        <p>
          Welcome back, create amazing AI videos today.
        </p>

      </div>

      <div className="topbar-right">

        <div className="search-box">

          <input
            type="text"
            placeholder="Search projects..."
          />

        </div>

        <button className="notification-btn">
          🔔
        </button>

        <div className="user-profile">

          <div className="user-avatar">
            U
          </div>

          <div>
            <h4>Usama Khan</h4>
            <span>Ultra Plan</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Topbar;
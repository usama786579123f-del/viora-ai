function StatsCards({ user, videos }) {
  const completedVideos = videos.filter(
    (v) => v.status === "completed"
  ).length;

  const thisWeek = videos.filter((v) => {
    const created = new Date(v.created);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created >= weekAgo;
  }).length;

  const stats = [
    {
      title: "Credits Left",
      value: user.plan === "ultra" ? "∞" : user.credits,
      icon: "⚡",
      change:
        user.plan === "free" ? "Resets daily" : "No daily limit",
    },
    {
      title: "Total Videos",
      value: completedVideos,
      icon: "🎬",
      change: `+${thisWeek} this week`,
    },
    {
      title: "Current Plan",
      value: user.plan.toUpperCase(),
      icon:
        user.plan === "free" ? "🆓" : user.plan === "pro" ? "⚡" : "👑",
      change: "ACTIVE",
    },
    {
      title: "This Week",
      value: thisWeek,
      icon: "📈",
      change: "videos generated",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-top">
            <div className="stat-icon">{item.icon}</div>
            <span className="stat-change">{item.change}</span>
          </div>

          <h3>{item.title}</h3>
          <h2>{item.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
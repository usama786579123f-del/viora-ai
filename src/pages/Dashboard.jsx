import Sidebar from "../components/Sidebar";
import AdvancedTopbar from "../components/AdvancedTopbar";
import StatsCards from "../components/StatsCards";
import CreditsPanel from "../components/CreditsPanel";
import UploadSection from "../components/UploadSection";
import RecentVideos from "../components/RecentVideos";

function Dashboard({
  user,
  setUser,
  videos,
  addVideo,
  deleteVideo,
  currentPage,
  setCurrentPage,
  openPricing,
  onLogout,
}) {
  return (
    <div className="dashboard">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        openPricing={openPricing}
      />

      <div className="dashboard-main">
        <AdvancedTopbar
          user={user}
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
        />

        <StatsCards videos={videos} user={user} />

        <CreditsPanel user={user} openPricing={openPricing} />

        <UploadSection
          user={user}
          setUser={setUser}
          openPricing={openPricing}
          addVideo={addVideo}
        />

        <RecentVideos videos={videos} deleteVideo={deleteVideo} />
      </div>
    </div>
  );
}

export default Dashboard;
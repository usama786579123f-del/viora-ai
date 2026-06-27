import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Gallery from "./pages/Gallery";
import Payment from "./pages/Payment";
import Referral from "./pages/Referral";
import ScriptWriter from "./pages/ScriptWriter";
import TitleGenerator from "./pages/TitleGenerator";
import HashtagGenerator from "./pages/HashtagGenerator";
import PromptEnhancer from "./pages/PromptEnhancer";
import { useUser } from "./context/UserContext";
import "./App.css";

function App() {
  const { user, setUser } = useUser();

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showPricing, setShowPricing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showScriptWriter, setShowScriptWriter] = useState(false);
  const [showTitleGen, setShowTitleGen] = useState(false);
  const [showHashtagGen, setShowHashtagGen] = useState(false);
  const [showPromptEnhancer, setShowPromptEnhancer] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState(null);
  const [paymentBilling, setPaymentBilling] = useState("monthly");

  const [videos, setVideos] = useState(
    () => JSON.parse(localStorage.getItem("vioraVideos")) || []
  );

  useEffect(() => {
    window.history.pushState({ page: "dashboard" }, "", "/");
  }, []);

  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state?.page) {
        setCurrentPage(e.state.page);
        setShowPricing(false);
        setShowPayment(false);
        setShowReferral(false);
        setShowScriptWriter(false);
        setShowTitleGen(false);
        setShowHashtagGen(false);
        setShowPromptEnhancer(false);
      } else {
        setCurrentPage("dashboard");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goToPage = (page) => {
    window.history.pushState({ page }, "", `/${page}`);
    setCurrentPage(page);
    setShowPricing(false);
    setShowPayment(false);
    setShowReferral(false);
    setShowScriptWriter(false);
    setShowTitleGen(false);
    setShowHashtagGen(false);
    setShowPromptEnhancer(false);
  };

  const openPricing = () => {
    window.history.pushState({ page: "pricing" }, "", "/pricing");
    setShowPricing(true);
    setShowPayment(false);
    setShowReferral(false);
    setShowScriptWriter(false);
    setShowTitleGen(false);
    setShowHashtagGen(false);
    setShowPromptEnhancer(false);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    window.history.pushState({ page: "dashboard" }, "", "/");
  };

  const handleLogout = () => {
    localStorage.removeItem("vioraVideos");
    localStorage.removeItem("vioraUser");
    setUser({
      name: "",
      email: "",
      plan: "free",
      credits: 5,
      watermarkEnabled: false,
      loggedIn: false,
    });
    setCurrentPage("dashboard");
    setShowPricing(false);
    setShowPayment(false);
    setShowReferral(false);
    setShowScriptWriter(false);
    setShowTitleGen(false);
    setShowHashtagGen(false);
    setShowPromptEnhancer(false);
    window.history.pushState({}, "", "/");
  };

  const handlePlanSelect = (plan, billing = "monthly") => {
    if (plan === "free") {
      setUser((prev) => ({
        ...prev,
        plan: "free",
        credits: 5,
        watermarkEnabled: false,
        lastResetDate: new Date().toISOString().split("T")[0],
      }));
      setShowPricing(false);
      setShowPayment(false);
      goToPage("dashboard");
      return;
    }
    setPaymentPlan(plan);
    setPaymentBilling(billing);
    setShowPricing(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (plan) => {
    setUser((prev) => ({
      ...prev,
      plan,
      credits: plan === "pro" ? 200 : 999999,
      watermarkEnabled: false,
    }));
    setShowPayment(false);
    setShowPricing(false);
    goToPage("dashboard");
  };

  const addVideo = (video) => {
    const updated = [video, ...videos];
    setVideos(updated);
    localStorage.setItem("vioraVideos", JSON.stringify(updated));
  };

  const deleteVideo = (id) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    localStorage.setItem("vioraVideos", JSON.stringify(updated));
  };

  // ===== NOT LOGGED IN =====
  if (!user.loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // ===== PRICING =====
  if (showPricing) {
    return (
      <Pricing
        onSelectPlan={handlePlanSelect}
        onBack={() => {
          setShowPricing(false);
          window.history.back();
        }}
      />
    );
  }

  // ===== PAYMENT =====
  if (showPayment) {
    return (
      <Payment
        plan={paymentPlan}
        billing={paymentBilling}
        user={user}
        onSuccess={handlePaymentSuccess}
        onBack={() => {
          setShowPayment(false);
          setShowPricing(true);
        }}
      />
    );
  }

  // ===== SCRIPT WRITER =====
  if (showScriptWriter) {
    return (
      <ScriptWriter
        onBack={() => setShowScriptWriter(false)}
      />
    );
  }

  // ===== TITLE GENERATOR =====
  if (showTitleGen) {
    return (
      <TitleGenerator
        onBack={() => setShowTitleGen(false)}
      />
    );
  }

  // ===== HASHTAG GENERATOR =====
  if (showHashtagGen) {
    return (
      <HashtagGenerator
        onBack={() => setShowHashtagGen(false)}
      />
    );
  }

  // ===== PROMPT ENHANCER =====
  if (showPromptEnhancer) {
    return (
      <PromptEnhancer
        onBack={() => setShowPromptEnhancer(false)}
      />
    );
  }

  // ===== REFERRAL =====
  if (showReferral) {
    return (
      <Referral
        user={user}
        setUser={setUser}
        onBack={() => setShowReferral(false)}
      />
    );
  }

  // ===== SETTINGS =====
  if (currentPage === "settings") {
    return (
      <Settings
        user={user}
        setUser={setUser}
        onLogout={handleLogout}
        onBack={() => goToPage("dashboard")}
        openPricing={openPricing}
      />
    );
  }

  // ===== GALLERY =====
  if (currentPage === "gallery") {
    return (
      <Gallery
        videos={videos}
        deleteVideo={deleteVideo}
        onBack={() => goToPage("dashboard")}
      />
    );
  }

  // ===== DASHBOARD =====
  return (
    <Dashboard
      user={user}
      setUser={setUser}
      videos={videos}
      addVideo={addVideo}
      deleteVideo={deleteVideo}
      currentPage={currentPage}
      setCurrentPage={goToPage}
      openPricing={openPricing}
      onLogout={handleLogout}
      onReferral={() => setShowReferral(true)}
      onScriptWriter={() => setShowScriptWriter(true)}
      onTitleGen={() => setShowTitleGen(true)}
      onHashtagGen={() => setShowHashtagGen(true)}
      onPromptEnhancer={() => setShowPromptEnhancer(true)}
    />
  );
}

export default App;
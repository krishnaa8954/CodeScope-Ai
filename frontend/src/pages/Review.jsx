import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";

function Review() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [review, setReview] = useState("");
  const [readme, setReadme] = useState("");
  const [activeTab, setActiveTab] = useState("review");
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewedAt, setReviewedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const [projectResponse, reviewResponse] = await Promise.all([
          api.get(`/project/${projectId}`),
          api.get(`/project/${projectId}/review`),
        ]);

        setProject(projectResponse.data);
        setReview(reviewResponse.data.review || "");
        const readmeContent = reviewResponse.data.readme || "";
        setReadme(readmeContent);
        setReviewStatus(reviewResponse.data.reviewStatus || "");
        setReviewedAt(reviewResponse.data.reviewedAt || null);
        if (readmeContent.trim().length > 0) {
          setActiveTab("readme");
        } else {
          setActiveTab("review");
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load project review"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [projectId]);

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/project/${projectId}/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${project?.title || "project-review"}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2D2D2D] border-t-primary rounded-full animate-spin mx-auto"></div>
          <h2 className="font-headline-sm text-headline-sm mt-lg">
            Loading AI Review...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md items-center justify-center gap-lg">
        <h2 className="text-error font-headline-sm text-headline-sm">
          {error}
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-primary hover:opacity-90 px-lg py-md rounded text-on-primary font-bold transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background font-body-md">
      {/* TopNavBar */}
      <nav className="w-full z-50 flex justify-between items-center px-lg py-md bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>biotech</span>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">CodeScope AI</span>
        </div>
        <div className="hidden md:flex items-center gap-xl">
          <div className="flex gap-lg">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Home</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/dashboard">Dashboard</Link>
          </div>
          <div className="flex items-center gap-md">
            {review && (
              <button 
                onClick={handleDownload}
                className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant border border-outline-variant hover:bg-surface-variant transition-all rounded"
              >
                Download PDF
              </button>
            )}
            <button 
              onClick={() => navigate("/dashboard")}
              className="px-md py-sm font-label-sm text-label-sm bg-primary text-on-primary hover:opacity-90 transition-all rounded"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-lg mt-md px-lg w-full pb-2xl max-w-7xl mx-auto">
        {/* Project Summary Panel */}
        <section className="w-full mb-xl">
          <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-lg hover:border-primary transition-colors duration-300 rounded-lg">
            <div className="space-y-sm">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">AI PROJECT REVIEW</span>
              <h1 className="font-headline-lg text-headline-lg text-on-background">{project?.title || "Project Review"}</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[672px]">
                {project?.description || "No project description available."}
              </p>
            </div>
            <div className="flex flex-col items-end gap-sm">
              <div className={`px-md py-xs border rounded-full flex items-center gap-sm ${reviewStatus === 'Completed' ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]' : 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                <span className={`w-2 h-2 rounded-full ${reviewStatus === 'Completed' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}></span>
                <span className="font-label-sm text-label-sm">{reviewStatus || "Pending"}</span>
              </div>
              <div className="text-right">
                {reviewedAt && (
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Analyzed on {new Date(reviewedAt).toLocaleDateString()}</span>
                )}
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Language: {project?.language || "Unknown"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* AI Analysis Report Panel */}
          <div className="lg:col-span-8 flex flex-col gap-xl">
            {readme && (
              <div className="flex gap-sm mb-md bg-[#181818] p-xs border border-[#2D2D2D] rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab("readme")}
                  className={`px-lg py-sm font-bold transition-all duration-200 font-label-sm text-label-sm rounded-md flex items-center gap-xs cursor-pointer ${
                    activeTab === "readme"
                      ? "bg-primary text-on-primary shadow-lg"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-[#252525]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">description</span>
                  README Documentation
                </button>
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-lg py-sm font-bold transition-all duration-200 font-label-sm text-label-sm rounded-md flex items-center gap-xs cursor-pointer ${
                    activeTab === "review"
                      ? "bg-primary text-on-primary shadow-lg"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-[#252525]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  AI Code Review
                </button>
              </div>
            )}

            {review || readme ? (
              <div className="bg-[#1E1E1E] border border-[#2D2D2D] flex flex-col h-full hover:border-primary transition-colors duration-300 rounded-lg overflow-hidden">
                <div className="px-xl py-md border-b border-[#2D2D2D] flex justify-between items-center bg-[#181818]">
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary">
                      {activeTab === "readme" ? "description" : "analytics"}
                    </span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      {activeTab === "readme" ? "Project README" : "AI Analysis Report"}
                    </h2>
                  </div>
                  <div className="flex gap-sm">
                    <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40"></span>
                    <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40"></span>
                    <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary/40"></span>
                  </div>
                </div>
                <div className="p-xl font-code-block text-code-block leading-relaxed custom-scrollbar overflow-y-auto max-h-[700px] bg-[#121212] m-md border border-[#2D2D2D] rounded-lg">
                  <pre className="text-on-surface-variant whitespace-pre-wrap font-code-block">
                    {activeTab === "readme" ? readme : review}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-[#1E1E1E] border border-[#2D2D2D] flex flex-col h-full hover:border-primary transition-colors duration-300 rounded-lg p-2xl text-center items-center justify-center">
                <h2 className="text-2xl font-bold font-headline-md text-on-surface">No Review Available</h2>
                <p className="text-on-surface-variant mt-md mb-lg">Upload your project ZIP or review a GitHub repository first.</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-primary text-on-primary hover:opacity-90 px-lg py-md rounded-lg font-bold transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Widgets (Right/Smaller) */}
          <div className="lg:col-span-4 flex flex-col gap-xl">
            {/* AI Suggestions Card */}
            <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-lg flex flex-col gap-md hover:border-primary transition-colors duration-300 rounded-lg">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Critical Tags</h3>
              <div className="flex flex-wrap gap-sm">
                <span className="px-sm py-1 font-label-caps text-label-caps bg-primary/15 border border-primary text-primary rounded-sm">THREAD_SAFETY</span>
                <span className="px-sm py-1 font-label-caps text-label-caps bg-primary/15 border border-primary text-primary rounded-sm">LOGIC_FLOW</span>
                <span className="px-sm py-1 font-label-caps text-label-caps bg-primary/15 border border-primary text-primary rounded-sm">OPTIMIZATION</span>
                <span className="px-sm py-1 font-label-caps text-label-caps bg-primary/15 border border-primary text-primary rounded-sm">REFACTOR</span>
              </div>
            </div>

            {/* Review Statistics */}
            <div className="bg-[#1E1E1E] border border-[#2D2D2D] overflow-hidden hover:border-primary transition-colors duration-300 rounded-lg">
              <div className="p-lg border-b border-[#2D2D2D]">
                <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase">Review Stats</h3>
              </div>
              <div className="divide-y divide-[#2D2D2D]">
                <div className="p-lg flex justify-between items-center hover:bg-[#252525] transition-colors">
                  <span className="font-body-md text-body-md text-on-surface-variant">Security Alerts</span>
                  <span className="font-headline-sm text-headline-sm text-error">03</span>
                </div>
                <div className="p-lg flex justify-between items-center hover:bg-[#252525] transition-colors">
                  <span className="font-body-md text-body-md text-on-surface-variant">Refactor Ops</span>
                  <span className="font-headline-sm text-headline-sm text-primary">12</span>
                </div>
                <div className="p-lg flex justify-between items-center hover:bg-[#252525] transition-colors">
                  <span className="font-body-md text-body-md text-on-surface-variant">Build Status</span>
                  <span className="font-headline-sm text-headline-sm text-[#10B981]">Pass</span>
                </div>
              </div>
            </div>

            {/* Infrastructure Visual */}
            <div className="bg-[#1E1E1E] border border-[#2D2D2D] p-lg hover:border-primary transition-colors duration-300 rounded-lg">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-md">System Architecture Snapshot</h3>
              <div className="relative w-full aspect-video border border-[#2D2D2D] bg-[#121212] flex items-center justify-center overflow-hidden rounded">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 flex flex-col items-center gap-sm">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '48px' }}>hub</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Distributed Cluster</span>
                </div>
              </div>
              <button className="w-full mt-md py-sm border border-[#2D2D2D] font-label-sm text-label-sm text-on-surface hover:border-primary hover:text-primary transition-all rounded">
                View Logic Map
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-lg py-xl flex flex-col md:flex-row justify-between items-center gap-md mx-auto bg-surface border-t border-outline-variant mt-auto">
        <div className="flex flex-col gap-xs items-center md:items-start">
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">CodeScope AI</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">© 2024 CodeScope AI. Technical Functionalism for Engineers.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-md">
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Documentation</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">API</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Privacy Policy</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Terms of Service</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Github</Link>
          <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Support</Link>
        </div>
      </footer>
    </div>
  );
}

export default Review;
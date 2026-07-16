import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [projectId, setProjectId] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [reviewingGithub, setReviewingGithub] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleCreateProject = async () => {
    if (!title.trim() || !description.trim() || !language.trim()) {
      alert("Please enter project title, description and language");
      return;
    }
    try {
      setCreating(true);
      const response = await api.post("/project/create", {
        title: title.trim(),
        description: description.trim(),
        language: language.trim(),
      });
      const createdProject = response.data.project || response.data.data || response.data;
      const newProjectId = createdProject?._id || createdProject?.id;
      if (!newProjectId) {
        alert("Project created, but project ID was not received");
        return;
      }
      setProjectId(newProjectId);
      alert("Project Created Successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      alert("Please select only a ZIP file");
      e.target.value = "";
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!projectId) {
      alert("Please Create Project First");
      return;
    }
    if (!selectedFile) {
      alert("Please Select ZIP File");
      return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("project", selectedFile);
      await api.post(`/project/upload/${projectId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Project Uploaded Successfully");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      navigate(`/review/${projectId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Project Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGithubReview = async () => {
    if (!projectId) {
      alert("Please Create Project First");
      return;
    }
    if (!githubUrl.trim() || !githubUrl.includes("github.com")) {
      alert("Please Enter a Valid GitHub Repository URL");
      return;
    }
    try {
      setReviewingGithub(true);
      await api.post(`/project/${projectId}/github-review`, { githubUrl: githubUrl.trim() });
      alert("GitHub Review Started Successfully");
      navigate(`/review/${projectId}`);
    } catch (error) {
      alert(error.response?.data?.message || "GitHub Review Failed");
    } finally {
      setReviewingGithub(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      {/* SideNavBar Anchor */}
      <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col p-gutter bg-surface border-r border-outline-variant">
        <div className="mb-10">
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">CodeScope AI</h1>
          <p className="text-on-surface-variant font-label-sm uppercase mt-1">AI Code Review</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-md px-md py-sm transition-colors duration-200 bg-secondary-container text-on-secondary-container font-bold rounded" to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link className="flex items-center gap-md px-md py-sm transition-colors duration-200 text-on-surface-variant hover:bg-surface-container-highest rounded" to="#">
            <span className="material-symbols-outlined">folder_open</span>
            <span>Projects</span>
          </Link>
          <Link className="flex items-center gap-md px-md py-sm transition-colors duration-200 text-on-surface-variant hover:bg-surface-container-highest rounded" to="#">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analysis</span>
          </Link>
          <Link className="flex items-center gap-md px-md py-sm transition-colors duration-200 text-on-surface-variant hover:bg-surface-container-highest rounded" to="#">
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
        </nav>
        <div className="mt-auto pt-gutter border-t border-outline-variant">
          <button onClick={handleLogout} className="flex items-center gap-md px-md py-sm transition-colors duration-200 text-on-surface-variant hover:bg-surface-container-highest rounded w-full text-left">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar Anchor */}
      <header className="fixed top-0 left-[240px] right-0 h-16 flex justify-between items-center px-lg bg-surface border-b border-outline-variant z-10">
        <div className="flex items-center gap-md">
          <span className="font-headline-md text-headline-md font-bold text-primary">Welcome Back</span>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-md text-on-surface-variant">
            <button className="hover:text-primary transition-all duration-200 flex items-center">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="hover:text-primary transition-all duration-200 flex items-center">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
          <div className="h-8 w-8 rounded-full border border-outline-variant overflow-hidden bg-surface-container">
            <img className="w-full h-full object-cover" data-alt="avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmfEw0AL876UCykKlq4SjtRsMpOHeJXCDvECGv5Vxabssy3d3ZCsAyKP3ihh2-Vf2855AJo8hFIhq088abAZnHUncvRm-FVbRlrIJ_MxuZJMILBZtUrjoJsMHOj0nC0JdfPkWBcCC3LA57aTfbtx_V619mN-t_DGdu3BH5AquO8v6t1GSPU-fCNbmk72wtMxIv5M5tmyFUSUvpL1yFIVofLZvSh9q6viytwKxwD7_JotZLKsRCb6VkRG78k4m-AxYKi3tN5uIT1g" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="p-lg max-w-7xl mx-auto space-y-gutter">
          {/* Welcome Header */}
          <section className="py-10">
            <h2 className="font-display text-display text-primary">Dashboard Overview</h2>
            <p className="text-on-surface-variant text-body-lg max-w-[672px] mt-md">
              Your security analysis workspace is synchronized and ready for the next deep-logic sweep.
            </p>
          </section>

          {/* Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="bg-surface border border-outline-variant p-container-padding">
              <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2">Projects Reviewed</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-headline-lg text-primary">124</span>
                <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant p-container-padding">
              <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2">Reports Generated</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-headline-lg text-primary">89</span>
                <span className="material-symbols-outlined text-primary text-sm">description</span>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant p-container-padding">
              <p className="text-on-surface-variant font-label-sm uppercase tracking-wider mb-2">Downloads</p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-headline-lg text-primary">1.4k</span>
                <span className="material-symbols-outlined text-primary text-sm">download</span>
              </div>
            </div>
          </div>

          {/* Project Creation Section */}
          <section className="bg-surface border border-outline-variant">
            <div className="px-container-padding py-md border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">add_box</span>
                <h3 className="font-headline-md text-headline-md font-bold">Create New Project</h3>
              </div>
              <span className="text-on-surface-variant font-code-md text-sm">v.2.4.0-stable</span>
            </div>
            <div className="p-container-padding space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-2">
                  <label className="block font-label-sm text-on-surface-variant uppercase">Project Title</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-md text-on-surface focus:border-primary focus:ring-0 font-code-md transition-colors" 
                    placeholder="e.g. Authentication Module Review" 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-label-sm text-on-surface-variant uppercase">Programming Language</label>
                  <select 
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-md text-on-surface focus:border-primary focus:ring-0 font-code-md transition-colors"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="">Select Language...</option>
                    <option value="TypeScript / JavaScript">TypeScript / JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block font-label-sm text-on-surface-variant uppercase">Description</label>
                <textarea 
                  className="w-full bg-surface-container-low border border-outline-variant rounded p-md text-on-surface focus:border-primary focus:ring-0 font-code-md transition-colors" 
                  placeholder="Provide a brief context for the AI sweep..." 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button 
                className="bg-primary text-on-primary-container font-bold px-xl py-md rounded transition-colors hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                onClick={handleCreateProject}
                disabled={creating}
              >
                {creating ? "SYNCHRONIZING..." : "CREATE"}
              </button>
              {projectId && (
                <div className="mt-lg border border-primary rounded-lg p-md bg-surface-container-low">
                  <p className="text-primary font-semibold">
                    ✓ Project Created Successfully
                  </p>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Now upload your ZIP file or enter your GitHub repository below.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Tooling Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Upload ZIP */}
            <div className="bg-surface border border-outline-variant p-container-padding flex flex-col justify-between items-start space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">upload_file</span>
                  <h4 className="font-headline-md text-headline-md font-bold">Upload ZIP</h4>
                </div>
                <p className="text-on-surface-variant">Drag and drop or select local archive for bulk analysis.</p>
              </div>
              <div className="w-full border-2 border-dashed border-outline-variant p-xl flex flex-col justify-center items-center rounded-lg bg-surface-container-lowest gap-md">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".zip,application/zip"
                  onChange={handleFileChange}
                />
                <button 
                  className="border border-outline-variant text-on-surface px-lg py-sm rounded hover:bg-surface-container-highest transition-colors font-bold uppercase tracking-wide"
                  onClick={() => fileInputRef.current?.click()}
                >
                  SELECT FILE
                </button>
                {selectedFile && (
                  <p className="text-primary font-code-md text-sm">
                    ✓ Selected: {selectedFile.name}
                  </p>
                )}
                <button 
                  className="w-full mt-sm bg-primary text-on-primary-container px-lg py-sm rounded hover:brightness-110 transition-colors font-bold uppercase tracking-wide disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? "UPLOADING..." : "UPLOAD & REVIEW"}
                </button>
              </div>
            </div>

            {/* GitHub Review */}
            <div className="bg-surface border border-outline-variant p-container-padding flex flex-col justify-between space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">terminal</span>
                  <h4 className="font-headline-md text-headline-md font-bold">GitHub Review</h4>
                </div>
                <p className="text-on-surface-variant">Analyze repositories directly from the source.</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">link</span>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant rounded pl-10 pr-3 py-md text-on-surface focus:border-primary focus:ring-0 font-code-md" 
                    placeholder="https://github.com/user/repo" 
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
                <button 
                  className="border border-outline-variant text-on-surface px-lg py-md rounded w-full hover:bg-surface-container-highest transition-colors font-bold uppercase tracking-wide disabled:opacity-50"
                  onClick={handleGithubReview}
                  disabled={reviewingGithub}
                >
                  {reviewingGithub ? "REVIEWING..." : "REVIEW"}
                </button>
              </div>
            </div>
          </div>

          {/* Contextual Animation Layer */}
          <div className="relative h-64 w-full bg-surface-container-lowest border border-outline-variant overflow-hidden">
            <div className="relative z-10 p-container-padding flex flex-col justify-center h-full">
              <h5 className="text-primary font-code-md">Global Thread Status</h5>
              <p className="text-on-surface-variant font-code-md text-sm mt-2">Observing 42 active security nodes in real-time...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
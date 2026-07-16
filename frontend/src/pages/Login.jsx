import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", response.data.token);

      alert(response.data.message || "Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      {/* TopAppBar */}
      <header className="bg-background border-b border-outline-variant w-full z-50">
        <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-md">
            <span className="font-headline-md text-headline-md font-bold text-on-background">CodeScope AI</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center px-gutter pt-16 pb-16">
        {/* Login Panel */}
        <div className="w-full max-w-[440px] bg-[#1E1E1E] border border-outline-variant rounded-lg p-xl flex flex-col gap-xl">
          {/* Card Header */}
          <div className="flex flex-col gap-xs text-center">
            <h1 className="font-headline-lg text-headline-lg text-on-background">CodeScope AI</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">AI Powered Code Review Platform</p>
          </div>
          
          {/* Login Form */}
          <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-sm">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Enter Email</label>
              <input 
                className="form-input w-full px-md py-sm rounded-lg font-body-md text-body-md" 
                id="email" 
                name="email" 
                placeholder="developer@codescope.ai" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Enter Password</label>
                <Link className="font-label-sm text-label-sm text-primary hover:underline" to="#">Forgot password?</Link>
              </div>
              <input 
                className="form-input w-full px-md py-sm rounded-lg font-body-md text-body-md" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button 
              className="w-full bg-[#3B82F6] text-white py-md rounded-lg font-label-caps text-label-caps hover:bg-[#2563EB] transition-colors active:opacity-80" 
              type="submit"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          {/* Card Footer */}
          <div className="text-center pt-md border-t border-outline-variant">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account?{" "}
              <Link className="text-primary font-bold hover:underline" to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-md max-w-container-max mx-auto gap-md">
          <div className="flex items-center gap-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">CODESCOPE AI</span>
            <span className="font-label-sm text-label-sm text-secondary">© 2024 CodeScope AI. Technical Functionalism.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
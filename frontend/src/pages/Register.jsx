import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert(response.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md relative overflow-hidden">
      {/* Structural Background Element */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3B82F6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      
      {/* TopAppBar */}
      <header className="bg-background border-b border-outline-variant w-full z-50">
        <div className="flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto h-16">
          <div className="flex items-center gap-md">
            <span className="font-headline-md text-headline-md font-bold text-on-background">CodeScope AI</span>
          </div>
          <div className="hidden md:flex items-center gap-lg">
            <Link className="font-headline-sm text-headline-sm text-on-surface-variant hover:bg-surface-container-high transition-colors px-md py-xs rounded" to="/">Home</Link>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-gutter py-2xl relative z-10">
        {/* Registration Card */}
        <div className="w-full max-w-[440px] bg-[#1E1E1E] border border-outline-variant p-xl shadow-2xl relative rounded-lg">
          <div className="mb-xl">
            <h1 className="font-headline-lg text-headline-lg mb-xs tracking-tight">CodeScope AI</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Create your account</p>
          </div>
          
          <form className="space-y-lg" onSubmit={handleRegister}>
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">NAME</label>
              <input 
                className="w-full bg-[#121212] border border-outline-variant focus:border-primary focus:outline-none px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant rounded" 
                placeholder="Enter Name" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">EMAIL ADDRESS</label>
              <input 
                className="w-full bg-[#121212] border border-outline-variant focus:border-primary focus:outline-none px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant rounded" 
                placeholder="Enter Email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-sm">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">PASSWORD</label>
              <input 
                className="w-full bg-[#121212] border border-outline-variant focus:border-primary focus:outline-none px-md py-sm font-body-md text-body-md text-on-surface placeholder:text-outline-variant rounded" 
                placeholder="Enter Password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="pt-md">
              <button 
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] active:opacity-80 transition-all text-white font-label-sm text-label-sm py-md font-bold tracking-widest rounded-lg" 
                type="submit"
                disabled={loading}
              >
                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
              </button>
            </div>
          </form>
          
          <div className="mt-xl text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link className="text-primary hover:underline transition-all" to="/login">Login</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-outline-variant w-full mt-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-lg py-md max-w-container-max mx-auto gap-md">
          <div className="flex flex-col md:flex-row items-center gap-md">
            <span className="font-label-caps text-label-caps text-on-surface-variant">CODESCOPE_SYSTEM_V4</span>
            <span className="font-label-sm text-label-sm text-secondary">© 2024 CodeScope AI. Technical Functionalism.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      {/* TopNavBar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-surface border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-lg py-md flex justify-between items-center">
          <div className="flex items-center gap-xl">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">CodeScope AI</span>
            <div className="hidden md:flex gap-lg">
              <Link className="font-label-sm text-label-sm text-primary border-b-2 border-primary transition-colors" to="/">Features</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">How It Works</Link>
              <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" to="/">Pricing</Link>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface px-md py-sm transition-all duration-200" to="/login">Login</Link>
            <Link className="bg-[#3B82F6] text-[#FFFFFF] font-label-sm text-label-sm px-lg py-sm rounded-DEFAULT hover:opacity-90 transition-opacity" to="/register">Get Started</Link>
          </div>
        </div>
      </nav>
      
      <main className="pt-[72px]">
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex items-center px-lg py-2xl overflow-hidden border-b border-outline-variant w-full">
          <div className="relative z-10 w-full max-w-[800px] mx-auto text-center">
            <div className="inline-flex items-center gap-sm px-sm py-xs technical-border rounded-full bg-surface-container-low mb-lg">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-caps text-label-caps text-primary">VERSION 2.4.0 NOW STABLE</span>
            </div>
            <h1 className="font-headline-lg text-[48px] md:text-[64px] leading-tight font-extrabold mb-md tracking-tighter">
              Understand Your Code.<br />Improve It With AI.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[672px] mx-auto">
              Professional-grade security and logic analysis for modern engineering teams. Synchronize your workspace and start your next deep-logic sweep in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-md">
              <Link className="bg-[#3B82F6] text-[#FFFFFF] font-label-sm text-label-sm px-xl py-md rounded-DEFAULT hover:opacity-90 transition-all flex items-center justify-center gap-sm" to="/register">
                Start Reviewing Free <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link className="technical-border text-on-surface font-label-sm text-label-sm px-xl py-md rounded-DEFAULT hover:bg-surface-container transition-all" to="/login">
                Login to Dashboard
              </Link>
            </div>
            {/* Hero Image Placeholder (Dashboard Preview) */}
            <div className="mt-2xl technical-border rounded-xl bg-surface-container-lowest overflow-hidden shadow-2xl">
              <img className="w-full h-auto aspect-video object-cover" data-alt="A dark-mode high-fidelity software dashboard interface for CodeScope AI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyWHjXWid6Af8keCUTNpvKE1sT85hgFhZtZrStl8UR-Eie1SDY-vQX9grCCB8p4-E9ro7zffonVNlRy5YS1qXeTsWk7ToWnwDOHMRAdx2x5VHK55V8C7d92OQcxjARu39NC7Vu-iWR0KqeSAI1h0eL_RyqK1bj7r4AFGfrkOxHe9uyYvxYs17v9_iNGfoSgyygun-U-9MQhRXIVIHikpm0iWCScdRlxZE8jK2jhTTYz0xYcxfs22qQOJJ4z22YQvo_h8A07QRiwg" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-container-max mx-auto px-lg py-2xl">
          <div className="mb-xl">
            <span className="font-label-caps text-label-caps text-primary tracking-widest block mb-sm">SYSTEM CAPABILITIES</span>
            <h2 className="font-headline-lg text-headline-lg font-bold">POWERFUL FEATURES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Feature Cards */}
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
              <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary">folder_zip</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-sm">ZIP Project Review</h3>
              <p className="text-on-surface-variant font-body-md">Analyze local archives instantly. Drag and drop your project bundles for immediate logic extraction without cloud sync requirements.</p>
            </div>
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
              <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary">art_track</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-sm">GitHub Repository Review</h3>
              <p className="text-on-surface-variant font-body-md">Direct integration for cloud-based repos. Connect your organization and automate code reviews on every pull request or push.</p>
            </div>
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group md:row-span-2 flex flex-col">
              <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary" data-weight="fill">pest_control</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-sm">Bug Detection</h3>
              <p className="text-on-surface-variant font-body-md mb-lg">Identify security vulnerabilities and logic flaws with zero false positives. Our engine simulates execution paths to find deep-seated memory leaks.</p>
              <div className="mt-auto technical-border rounded bg-surface-container-lowest p-sm font-code-block text-code-block">
                <div className="diff-removed px-xs text-error">- if (user.id == admin)</div>
                <div className="diff-added px-xs text-[#10B981]">+ if (user.id === admin_id)</div>
              </div>
            </div>
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
              <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-sm">Code Analysis</h3>
              <p className="text-on-surface-variant font-body-md">Deep-dive into structural complexity. Visualize cyclomatic complexity and maintainability indices across your entire stack.</p>
            </div>
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group">
              <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary">auto_fix_high</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-sm">Smart Improvements</h3>
              <p className="text-on-surface-variant font-body-md">AI-driven refactoring suggestions. Receive clean, idiomatic code proposals that maintain the original intent while optimizing performance.</p>
            </div>
            <div className="technical-border p-lg bg-surface-container-low hover:bg-surface-container-high transition-colors group col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row gap-lg">
                <div className="md:w-1/2">
                  <div className="w-10 h-10 technical-border flex items-center justify-center mb-md group-hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-sm">Architecture Analysis</h3>
                  <p className="text-on-surface-variant font-body-md">Global thread status and dependency mapping. Understand how components interact and identify potential circular dependencies or bottlenecks.</p>
                </div>
                <div className="md:w-1/2 technical-border rounded bg-surface-container-lowest p-md">
                  <div className="flex items-center justify-between mb-sm border-b border-outline-variant pb-xs">
                    <span className="font-label-caps text-label-caps">THREAD_POOL_MAIN</span>
                    <span className="text-primary font-label-sm text-label-sm">RUNNING</span>
                  </div>
                  <div className="space-y-xs">
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[75%]"></div>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[40%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-surface-container-lowest border-y border-outline-variant py-2xl">
          <div className="max-w-container-max mx-auto px-lg">
            <div className="text-center mb-2xl">
              <span className="font-label-caps text-label-caps text-primary tracking-widest block mb-sm">WORKFLOW PIPELINE</span>
              <h2 className="font-headline-lg text-headline-lg font-bold uppercase">HOW IT WORKS</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-xl relative">
              <div className="hidden md:block absolute top-[52px] left-0 w-full h-[1px] bg-outline-variant z-0"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container technical-border flex items-center justify-center mb-md font-bold text-primary group hover:scale-110 transition-transform">
                  01
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-sm">Connect Repo</h4>
                <p className="text-on-surface-variant font-body-md">Link your GitHub or upload a ZIP project to our secure environment.</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container technical-border flex items-center justify-center mb-md font-bold text-primary">
                  02
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-sm">Scan Logic</h4>
                <p className="text-on-surface-variant font-body-md">Our AI performs a deep-logic sweep using multi-threaded analysis patterns.</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container technical-border flex items-center justify-center mb-md font-bold text-primary">
                  03
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-sm">Review Reports</h4>
                <p className="text-on-surface-variant font-body-md">Detailed analysis of bugs, security leaks, and architecture bottlenecks.</p>
              </div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-surface-container technical-border flex items-center justify-center mb-md font-bold text-primary">
                  04
                </div>
                <h4 className="font-headline-sm text-headline-sm mb-sm">Deploy Fixes</h4>
                <p className="text-on-surface-variant font-body-md">Apply smart improvements with confidence through one-click refactoring.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-lg py-2xl text-center">
          <div className="technical-border p-2xl bg-surface relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="font-headline-lg text-headline-lg font-bold mb-md">Ready to optimize your codebase?</h2>
              <p className="text-on-surface-variant mb-xl max-w-[576px] mx-auto">Join over 10,000 engineers using CodeScope AI to eliminate technical debt and ship faster code.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-md">
                <Link className="bg-[#3B82F6] text-[#FFFFFF] font-label-sm text-label-sm px-xl py-md rounded-DEFAULT hover:scale-[1.02] transition-all" to="/register">
                  Get Started Now
                </Link>
                <Link className="technical-border text-on-surface font-label-sm text-label-sm px-xl py-md rounded-DEFAULT hover:bg-surface-container transition-all" to="/contact">
                  Contact Enterprise Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-lg py-xl flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col gap-xs items-center md:items-start">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">CodeScope AI</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 CodeScope AI. Technical Functionalism for Engineers.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-lg">
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Documentation</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">API</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Privacy Policy</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Terms of Service</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Github</Link>
            <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface underline transition-all duration-200" to="#">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
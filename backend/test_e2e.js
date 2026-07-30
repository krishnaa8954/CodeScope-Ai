/**
 * CodeScope AI — FULL END-TO-END LIVE TEST
 * 
 * Flow: Login → Create Project → GitHub Review → Wait for AI → Verify Review → Download PDF
 */
require("dotenv").config();
const http = require("http");

const BASE = "http://localhost:5000/api";

function request(method, path, body, token, timeout = 600000) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { "Content-Type": "application/json" },
      timeout,
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(data),
        });
      });
    });

    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timed out")); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log("");
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║   CodeScope AI — FULL LIVE TEST                 ║");
  console.log("╚══════════════════════════════════════════════════╝");
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 1: LOGIN
  // ═══════════════════════════════════════════
  console.log("━━━ STEP 1: LOGIN ━━━");

  await request("POST", "/auth/register", {
    name: "Live Tester",
    email: "livetest@codescope.ai",
    password: "LiveTest@123",
  }).catch(() => {});

  const loginRes = await request("POST", "/auth/login", {
    email: "livetest@codescope.ai",
    password: "LiveTest@123",
  });

  const token = JSON.parse(loginRes.body.toString()).token;
  if (!token) {
    console.log("❌ Login failed! Cannot proceed.");
    return;
  }
  console.log("✅ Logged in successfully");
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 2: CREATE PROJECT
  // ═══════════════════════════════════════════
  console.log("━━━ STEP 2: CREATE PROJECT ━━━");

  const createRes = await request("POST", "/project/create", {
    title: "Python Calculator App",
    description: "A simple Python calculator with basic arithmetic operations",
    language: "Python",
  }, token);

  const createData = JSON.parse(createRes.body.toString());
  const projectId = createData.project?._id;

  if (!projectId) {
    console.log("❌ Project creation failed:", createData.message);
    return;
  }

  console.log("✅ Project created!");
  console.log("   Title:       ", createData.project.title);
  console.log("   Language:    ", createData.project.language);
  console.log("   Description: ", createData.project.description);
  console.log("   Project ID:  ", projectId);
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 3: SUBMIT GITHUB REVIEW
  // ═══════════════════════════════════════════
  const GITHUB_URL = "https://github.com/avinashkranjan/Amazing-Python-Scripts";
  
  console.log("━━━ STEP 3: GITHUB REVIEW ━━━");
  console.log("   GitHub URL:", GITHUB_URL);
  console.log("   ⏳ Cloning repo + Running 5 AI analysis prompts...");
  console.log("   (This will take 2-5 minutes, please wait...)");
  console.log("");

  const startTime = Date.now();
  const progressInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    process.stdout.write(`\r   ⏳ Elapsed: ${elapsed}s... (AI thinking)`);
  }, 5000);

  let reviewRes;
  try {
    reviewRes = await request("POST", `/project/${projectId}/github-review`, {
      githubUrl: GITHUB_URL,
    }, token, 600000);
  } catch (e) {
    clearInterval(progressInterval);
    console.log(`\n   ❌ GitHub review failed: ${e.message}`);
    console.log("   Trying cleanup...");
    await request("DELETE", `/project/${projectId}`, null, token).catch(() => {});
    return;
  }

  clearInterval(progressInterval);
  const elapsed = Math.round((Date.now() - startTime) / 1000);

  const reviewData = JSON.parse(reviewRes.body.toString());
  if (reviewRes.status !== 200) {
    console.log(`\r   ❌ Review error (${elapsed}s): ${reviewData.message}`);
    await request("DELETE", `/project/${projectId}`, null, token).catch(() => {});
    return;
  }
  
  console.log(`\r   ✅ AI Review completed in ${elapsed} seconds!                      `);
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 4: VERIFY REVIEW CONTENT
  // ═══════════════════════════════════════════
  console.log("━━━ STEP 4: VERIFY REVIEW CONTENT ━━━");

  const getReviewRes = await request("GET", `/project/${projectId}/review`, null, token);
  const reviewResult = JSON.parse(getReviewRes.body.toString());

  console.log("   Review Status:  ", reviewResult.reviewStatus);
  console.log("   Review Length:  ", (reviewResult.review || "").length, "characters");

  const reviewText = reviewResult.review || "";
  const hasCodeScopeAIName = reviewText.includes("Project Name: CodeScope AI");
  
  // Extract project name from review
  const nameMatch = reviewText.match(/Project Name[:\s]*(.+?)(?:\n|$)/i);
  const aiProjectName = nameMatch ? nameMatch[1].trim() : "not found";

  console.log("");
  console.log("   🔍 AI detected project name: \"" + aiProjectName + "\"");
  console.log("   🔍 AI says 'CodeScope AI':   ", hasCodeScopeAIName ? "❌ BUG (wrong name)" : "✅ FIXED (no false name)");
  console.log("");

  // Show first 600 chars
  console.log("   ┌── AI Review Preview (first 600 chars) ──");
  const lines = reviewText.substring(0, 600).split("\n");
  for (const line of lines) {
    console.log("   │ " + line);
  }
  console.log("   └─────────────────────────────────────────");
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 5: PDF DOWNLOAD
  // ═══════════════════════════════════════════
  console.log("━━━ STEP 5: PDF DOWNLOAD ━━━");

  const pdfRes = await request("GET", `/project/${projectId}/download`, null, token);
  const contentDisp = pdfRes.headers["content-disposition"] || "";
  const contentType = pdfRes.headers["content-type"] || "";

  console.log("   Status:              ", pdfRes.status);
  console.log("   Content-Type:        ", contentType);
  console.log("   Content-Disposition: ", contentDisp);
  console.log("   PDF Size:            ", pdfRes.body.length, "bytes");

  const hasCorrectFilename = contentDisp.includes('"Python Calculator App.pdf"');
  const noUUID = !contentDisp.match(/[0-9a-f]{8}-[0-9a-f]{4}-/);

  console.log("");
  console.log("   🔍 Filename = project name: ", hasCorrectFilename ? "✅ YES" : "❌ NO");
  console.log("   🔍 No UUID in filename:     ", noUUID ? "✅ YES" : "❌ NO");
  console.log("   🔍 Valid PDF:               ", contentType.includes("pdf") ? "✅ YES" : "❌ NO");
  console.log("");

  // ═══════════════════════════════════════════
  // STEP 6: VERIFY LANGUAGE FIELD
  // ═══════════════════════════════════════════
  console.log("━━━ STEP 6: PROJECT DATA CHECK ━━━");

  const getProjectRes = await request("GET", `/project/${projectId}`, null, token);
  const projectData = JSON.parse(getProjectRes.body.toString());

  console.log("   Title:        ", projectData.title);
  console.log("   Language:     ", projectData.language || "MISSING!");
  console.log("   Review Status:", projectData.reviewStatus);
  console.log("   Language OK:  ", projectData.language === "Python" ? "✅ YES" : "❌ NO");
  console.log("");

  // ═══════════════════════════════════════════
  // FINAL SUMMARY
  // ═══════════════════════════════════════════
  const results = [
    ["Login", true],
    ["Create Project (title + language)", !!projectId],
    ["Language saved as 'Python'", projectData.language === "Python"],
    ["GitHub Clone + AI Review", reviewResult.reviewStatus === "Completed"],
    ["AI NOT saying 'CodeScope AI'", !hasCodeScopeAIName],
    ["PDF filename = project name", hasCorrectFilename],
    ["PDF has no UUID", noUUID],
    ["PDF is valid", contentType.includes("pdf")],
  ];

  const passed = results.filter(r => r[1]).length;
  const failed = results.filter(r => !r[1]).length;

  console.log("╔══════════════════════════════════════════════════════╗");
  console.log("║               FINAL TEST RESULTS                    ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  for (const [name, pass] of results) {
    const icon = pass ? "✅" : "❌";
    console.log(`║ ${icon} ${name.padEnd(48)}║`);
  }
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║ Total: ${passed} passed, ${failed} failed${" ".repeat(32)}║`);
  console.log("╚══════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`🌐 OPEN IN BROWSER: http://localhost:5174/review/${projectId}`);
  console.log("");
}

run().catch((e) => {
  console.error("❌ Test crashed:", e.message);
});

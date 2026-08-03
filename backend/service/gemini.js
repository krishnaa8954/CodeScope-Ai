const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY_1
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroq(prompt) {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await delay(2000);

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are CodeScope AI, a Senior Software Engineer and Software Architect. Follow every instruction in the user prompt. Return ONLY clean Markdown."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 3000,
      });

      return completion.choices[0]?.message?.content || "";
    } catch (error) {
      console.error(`Groq Error (Attempt ${attempt}):`, error?.message || error);
      if (attempt < maxRetries) {
        await delay(5000); // Wait longer to respect TPM rate limit reset
        continue;
      }
      throw error;
    }
  }
}

async function generateProjectSummary(code, projectInfo = {}) {
    const projectContext = projectInfo.title 
        ? `\n# PROJECT METADATA (provided by user)\nProject Title: ${projectInfo.title}\nProject Description: ${projectInfo.description || "Not provided"}\nProgramming Language: ${projectInfo.language || "Not specified"}\n\nIMPORTANT: Use the above Project Title as the project name. Do NOT guess the project name from the source code.\n`
        : "";

    // Automatically truncate code if it exceeds 10,000 characters to prevent Groq TPM (413) limit error
    const maxCodeLength = 10000;
    const trimmedCode = code.length > maxCodeLength 
        ? code.substring(0, maxCodeLength) + "\n\n[Code truncated due to size limits...]" 
        : code;

    const prompt = `
# ROLE
You are CodeScope AI. You are a Senior Software Engineer and Software Architect. Analyze ONLY the uploaded project. Return ONLY Markdown. Never invent files, folders, functions, or features. If any information is unavailable, write "Not Found".
${projectContext}

# TASK
Generate the complete and detailed project review report in exact Markdown containing the following sections:

## 1. Project Name
## 2. Project Purpose
## 3. Project Summary
## 4. Main Features
## 5. Technology Stack (Include a proper Markdown table: | Layer | Technology |)
## 6. Project Workflow
## 7. Current Project Architecture & Diagram

## Folder Structure Review
## Current Architecture Review
## 5. Code Quality Review
## 7. Security Review & 8. Performance Review
## 9. Refactoring Suggestions & 10. Code Improvements
## 11. Missing Features, 12. Production Readiness, 13. Final Score & 14. Final Recommendation

# PROJECT SOURCE CODE
${trimmedCode}
`;

    return await callGroq(prompt);
}

// Wrapper functions for controller compatibility
async function generateArchitectureReview(code) { return ""; }
async function generateCodeQualityReview(code) { return ""; }
async function generateSecurityPerformanceReview(code) { return ""; }
async function generateImprovementReview(code) { return ""; }

module.exports = {
    generateProjectSummary,
    generateArchitectureReview,
    generateCodeQualityReview,
    generateSecurityPerformanceReview,
    generateImprovementReview
};
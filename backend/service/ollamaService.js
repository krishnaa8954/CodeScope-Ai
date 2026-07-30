const axios = require("axios");

async function callOllama(prompt, numPredict = 1200) {

    const response = await axios.post(
        "http://127.0.0.1:11434/api/generate",
        {
            model: "qwen2.5-coder:3b",
            prompt,
            stream: false,

            options: {
                temperature: 0.1,
                num_predict: numPredict,
                num_ctx: 8192
            }

        },
        {
            timeout: 300000
        }
    );

    return response.data.response;

}


async function generateProjectSummary(code, projectInfo = {}) {

    const projectContext = projectInfo.title 
        ? `\n# PROJECT METADATA (provided by user)\nProject Title: ${projectInfo.title}\nProject Description: ${projectInfo.description || "Not provided"}\nProgramming Language: ${projectInfo.language || "Not specified"}\n\nIMPORTANT: Use the above Project Title as the project name. Do NOT guess the project name from the source code.\n`
        : "";

    const prompt = `
    # ROLE

You are CodeScope AI.

You are a Senior Software Engineer and Software Architect.

Analyze ONLY the uploaded project.

Return ONLY Markdown.

Never invent files, folders, functions, or features.

If any information is unavailable, write "Not Found".
${projectContext}
# TASK

Generate ONLY the following sections.

## 1. Project Name

Identify the project name.

---

## 2. Project Purpose

Explain:

- What problem does this project solve?
- Why was this project built?

---

## 3. Project Summary

Explain the project in 150-250 words.

Include:

- Overall goal
- Main functionality
- User flow

---

## 4. Main Features

List all important features.

Use bullet points.

---

## 5. Technology Stack

Create a table.

| Layer | Technology |

Include:

- Frontend
- Backend
- Database
- Authentication
- AI/LLM
- APIs
- Libraries

If unavailable write "Not Found".

---

## 6. Project Workflow

Explain step-by-step how the application works.

Example:

User

↓

Login

↓

Upload Project

↓

AI Review

↓

Database

↓

Dashboard

---

## 7. Current Project Architecture

Explain the architecture used in this project.

Generate a Markdown architecture diagram.

Example:

Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Database

Only use components that actually exist in the project.

---

# RULES

Do NOT review security.

Do NOT review bugs.

Do NOT review code quality.

Do NOT suggest improvements.

Do NOT generate code.

Only understand and summarize the project.

# PROJECT SOURCE CODE

${code}
`;

    return await callOllama(prompt,700);

}

async function generateArchitectureReview(code) {

    const prompt = `
# ROLE

You are CodeScope AI.

Analyze ONLY the architecture of the uploaded project.

Return ONLY Markdown.

Never repeat project summary.

Never invent files.

If information is unavailable write "Not Found".

# TASK

Analyze ONLY:

1. Folder Structure Review
   - Good Practices
   - Problems
   - Suggested Improvements
   - Folder Structure Rating (/10)

2. Current Architecture Review
   - Architecture Style
   - MVC Implementation
   - Separation of Concerns
   - Strengths
   - Weaknesses

3. Improved Architecture
   - Explain improvements
   - Generate a better architecture diagram

4. Architecture Issues Table

| Priority | File | Problem | Impact | Solution |

# PROJECT SOURCE CODE

${code}
`;

    return await callOllama(prompt, 900);

}

async function generateCodeQualityReview(code) {

const prompt = `
# ROLE

You are a Senior Software Engineer and Code Reviewer.

Analyze ONLY the uploaded source code.

Return ONLY Markdown.

Never invent files.

If something is unavailable write "Not Found".

--------------------------------------------

# TASK

Generate ONLY Section 5.

# 5. Code Quality Review

Review the project using real examples from the code.

Cover:

- Readability
- Naming Convention
- Folder Structure
- Maintainability
- Modularity
- Reusability
- SOLID Principles
- DRY Principle
- KISS Principle
- Error Handling
- Logging
- Code Duplication

For every point provide:

- Current State
- Why it matters
- Suggested Improvement

--------------------------------------------

## File Wise Review

For EVERY important file create a table.

| File | Quality | Problems | Rating |

Example:

| controllers/projectController.js | Good | Large function, duplicated logic | 8/10 |

Only include files that actually exist.

--------------------------------------------

## Overall Code Quality Score

| Category | Score |
|----------|-------|
| Readability | |
| Maintainability | |
| Reusability | |
| Clean Code | |
| SOLID | |
| DRY | |
| Overall | |

--------------------------------------------

Rules

Don't review security.

Don't review bugs.

Don't review performance.

Don't generate improved code.

Only review code quality.

PROJECT SOURCE CODE

${code}

`;

return await callOllama(prompt,1300);

}

async function generateSecurityPerformanceReview(code) {

const prompt = `
# ROLE

You are a Senior Security Engineer and Performance Engineer.

Analyze ONLY the uploaded project.

Return ONLY Markdown.

Never invent files.

If information is unavailable write "Not Found".

---------------------------------------

# TASK

Generate ONLY these sections.

## 7. Security Review

Review:

- Authentication
- Authorization
- JWT
- Password Hashing
- Input Validation
- File Upload Validation
- Environment Variables
- Hardcoded Secrets
- NoSQL Injection
- SQL Injection
- XSS
- CSRF
- Path Traversal
- Rate Limiting
- CORS
- Sensitive Data Exposure

For every issue provide:

- Risk
- Impact
- Solution

Create a table.

| Severity | File | Issue | Risk | Fix |

Rate Security (/10).

---------------------------------------

## 8. Performance Review

Review:

- Database Queries
- File System Usage
- Async/Await
- Memory Usage
- CPU Usage
- Blocking Operations
- Time Complexity
- Space Complexity
- API Response Time

Suggest optimizations.

Create a table.

| File | Problem | Optimization |

Rate Performance (/10).

---------------------------------------

Rules

Do NOT review bugs.

Do NOT review code quality.

Do NOT generate code.

PROJECT SOURCE CODE

${code}

`;

return await callOllama(prompt,1500);

}

async function generateImprovementReview(code) {

const prompt = `
# ROLE

You are a Principal Software Engineer.

Analyze ONLY the uploaded project.

Return ONLY Markdown.

Never invent files.

Use only files present in the project.

---------------------------------------

Generate ONLY these sections.

## 9. Refactoring Suggestions

Explain:

- Which functions should be split
- Which files should be moved
- Better folder structure
- Better naming
- Better architecture
- Better separation of concerns

---------------------------------------

## 10. Code Improvements

Choose ONLY the 5 most important improvements.

For each provide:

### File

### Issue

### Current Code

Only include the relevant snippet.

Maximum 20 lines.

### Improved Code

Maximum 20 lines.

### Explanation

### Benefits

---------------------------------------

## 11. Missing Features

Suggest useful production features.

Examples:

- Swagger
- API Versioning
- Rate Limiting
- Logging
- Docker
- Health Check API
- Unit Testing
- Integration Testing
- Email Verification
- Password Reset
- RBAC
- CI/CD
- Monitoring
- Redis Cache

Explain why each feature is useful.

---------------------------------------

## 12. Production Readiness

Explain:

Strengths

Weaknesses

Deployment Risks

Required Improvements

Is this production ready?

---------------------------------------

## 13. Final Score

Create a table.

| Category | Score (/10) |
|-----------|-------------|
| Architecture | |
| Code Quality | |
| Security | |
| Performance | |
| Maintainability | |
| Scalability | |
| Readability | |
| Documentation | |
| Overall Project | |

---------------------------------------

## 14. Final Recommendation

Mention:

- Biggest Strength
- Biggest Weakness
- Highest Priority Fix
- Recommended Next Steps

Final Decision

Approve

Approve with Changes

Reject

Explain the decision.

---------------------------------------

PROJECT SOURCE CODE

${code}

`;

return await callOllama(prompt,2000);

}
module.exports = {
    generateProjectSummary,
    generateArchitectureReview,
    generateCodeQualityReview,
    generateSecurityPerformanceReview,
    generateImprovementReview
};
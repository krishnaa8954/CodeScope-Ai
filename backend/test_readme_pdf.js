const axios = require("axios");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:5000/api";

async function run() {
    try {
        console.log("1. Registering/Logging in...");
        try {
            await axios.post(`${BASE}/auth/register`, {
                name: "Readme Tester",
                email: "readme_tester@codescope.ai",
                password: "Password123"
            });
        } catch (e) {
            // Already registered
        }

        const loginRes = await axios.post(`${BASE}/auth/login`, {
            email: "readme_tester@codescope.ai",
            password: "Password123"
        });
        const token = loginRes.data.token;
        console.log("✅ Logged in successfully!");

        console.log("2. Creating Project...");
        const createRes = await axios.post(`${BASE}/project/create`, {
            title: "Diagram Test Project",
            description: "A test project demonstrating proper box-drawing diagrams in PDFs",
            language: "JavaScript"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const projectId = createRes.data.project._id;
        console.log("✅ Project created with ID:", projectId);

        console.log("3. Creating Zip file with README.md...");
        const zip = new AdmZip();
        const readmeContent = `# Architecture Diagram Project

This is a test of Unicode box-drawing diagram rendering in PDF reports.

## System Architecture

Client Application
       │
       ▼
  API Gateway
       │
 ┌─────┴─────┐
 │           │
 ▼           ▼
Auth API    Project API
 │           │
 ▼           ▼
Redis      MongoDB

`;
        zip.addFile("README.md", Buffer.from(readmeContent, "utf8"));
        const zipBuffer = zip.toBuffer();
        console.log("✅ Zip file created in-memory");

        console.log("4. Uploading ZIP file...");
        const Boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        let body = Buffer.concat([
            Buffer.from(`--${Boundary}\r\nContent-Disposition: form-data; name="project"; filename="project.zip"\r\nContent-Type: application/zip\r\n\r\n`),
            zipBuffer,
            Buffer.from(`\r\n--${Boundary}--\r\n`)
        ]);

        const uploadRes = await axios.post(`${BASE}/project/upload/${projectId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": `multipart/form-data; boundary=${Boundary}`
            }
        });
        console.log("✅ Upload complete!");

        console.log("5. Fetching Project Details...");
        const getProjRes = await axios.get(`${BASE}/project/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("   Stored README exists:", !!getProjRes.data.readme);
        console.log("   README Length:", (getProjRes.data.readme || "").length, "characters");

        console.log("6. Downloading PDF...");
        const pdfRes = await axios.get(`${BASE}/project/${projectId}/download`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "arraybuffer"
        });
        const pdfPath = path.join(__dirname, "test_output.pdf");
        fs.writeFileSync(pdfPath, pdfRes.data);
        console.log("✅ PDF downloaded successfully to:", pdfPath);
        console.log("   PDF File Size:", pdfRes.data.byteLength, "bytes");

    } catch (error) {
        console.error("❌ Test failed:", error.response ? error.response.data : error.message);
    }
}

run();

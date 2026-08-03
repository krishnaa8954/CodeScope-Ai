const Project = require('../models/Projects');
const {
    generateProjectSummary,
    generateArchitectureReview,
    generateCodeQualityReview,
    generateSecurityPerformanceReview,
    generateImprovementReview
} = require("../service/gemini");
const {
    drawTitle,
    drawProjectInfo,
    drawHeading,
    drawParagraph,
    drawFooter,
    getMonospacedFont
} = require("../utils/pdfHelper");
const { parseReview } = require("../utils/reviewParser");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const simpleGit = require("simple-git");

const git = simpleGit();

// Helper delay function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createProject = async (req, res) => {
    try {
        const { title, description, language, githubUrl } = req.body;
        if (!title) {
            return res.status(400).json({
                message: "Project title is required"
            });
        }
        const project = new Project({
            title,
            description,
            language,
            githubUrl,
            owner: req.user.id
        });
        await project.save();
        return res.status(201).json({
            message: "Project created successfully",
            project: project
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getMyProjects = async (req, res) => {
    console.log(req.user);

    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const projects = await Project.find({
            owner: req.user.id
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(projects);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const { title, description, githubUrl } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        project.title = title || project.title;
        project.description = description || project.description;
        project.githubUrl = githubUrl || project.githubUrl;
        await project.save();
        return res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        await Project.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// Helper function to generate a clean folder tree layout (skipping lock files)
const getFolderTree = (dirPath, prefix = "") => {
    let treeStr = "";
    try {
        const skipDirs = new Set([
            "node_modules", ".git", "__pycache__", ".next", "dist", "build",
            ".venv", "venv", "env", ".env", ".idea", ".vscode", ".gradle",
            "target", "bin", "obj", ".cache", "coverage", ".tox", "vendor"
        ]);

        const skipFiles = new Set([
            "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "composer.lock", "poetry.lock",
            "bun.lockb", "Cargo.lock", "Gemfile.lock"
        ]);

        const items = fs.readdirSync(dirPath, { withFileTypes: true });

        const filteredItems = items.filter(item => {
            if (item.isDirectory() && skipDirs.has(item.name)) return false;
            if (item.isFile() && skipFiles.has(item.name)) return false;
            return true;
        });

        filteredItems.forEach((item, index) => {
            const isLast = index === filteredItems.length - 1;
            const pointer = isLast ? "└── " : "├── ";
            treeStr += `${prefix}${pointer}${item.name}\n`;

            if (item.isDirectory()) {
                const extension = isLast ? "    " : "│   ";
                treeStr += getFolderTree(path.join(dirPath, item.name), prefix + extension);
            }
        });
    } catch (err) {
        console.error("Error generating folder tree:", err);
    }
    return treeStr;
};

const readFiles = (folderPath) => {
    let allCode = "";

    const skipDirs = new Set([
        "node_modules", ".git", "__pycache__", ".next", "dist", "build",
        ".venv", "venv", "env", ".env", ".idea", ".vscode", ".gradle",
        "target", "bin", "obj", ".cache", "coverage", ".tox", "vendor"
    ]);

    const skipFiles = new Set([
        "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "composer.lock", "poetry.lock",
        "bun.lockb", "Cargo.lock", "Gemfile.lock"
    ]);

    const supportedExtensions = new Set([
        ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
        ".py", ".pyw",
        ".java", ".kt", ".kts",
        ".c", ".h", ".cpp", ".hpp", ".cc", ".cxx",
        ".cs", ".go", ".rs", ".rb", ".php", ".swift", ".dart",
        ".html", ".htm", ".css", ".scss", ".sass", ".less",
        ".json", ".yaml", ".yml", ".toml", ".xml", ".env.example",
        ".sh", ".bash", ".sql", ".md",
    ]);

    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            if (skipDirs.has(file)) continue;
            allCode += readFiles(filePath);
        } else {
            if (skipFiles.has(file)) continue;
            const ext = path.extname(file).toLowerCase();

            if (supportedExtensions.has(ext)) {
                if (stats.size > 50 * 1024) continue;
                const content = fs.readFileSync(filePath, "utf8");
                allCode += `\n\n===== ${filePath} =====\n`;
                allCode += content;
            }
        }
    }
    return allCode;
};

const findReadmeContentRecursive = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        const readmeFile = files.find(file => {
            const lower = file.toLowerCase();
            return lower === "readme.md" || lower === "readme" || lower === "readme.txt" || lower === "readme.markdown";
        });
        if (readmeFile) {
            const filePath = path.join(folderPath, readmeFile);
            return fs.readFileSync(filePath, "utf8");
        }
        const skipDirs = new Set([
            "node_modules", ".git", "__pycache__", ".next", "dist", "build",
            ".venv", "venv", "env", ".env", ".idea", ".vscode", ".gradle",
            "target", "bin", "obj", ".cache", "coverage", ".tox", "vendor"
        ]);
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory() && !skipDirs.has(file)) {
                const content = findReadmeContentRecursive(filePath);
                if (content) return content;
            }
        }
    } catch (err) {
        console.error("Error finding README:", err);
    }
    return null;
};

const uploadProject = async (req, res) => {
    console.log("UPLOAD API HIT");

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please upload a ZIP file"
            });
        }

        const zip = new AdmZip(req.file.path);
        const extractPath = path.join(
            "extracted",
            path.parse(req.file.filename).name
        );

        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
        }

        zip.extractAllTo(extractPath, true);

        const readmeContent = findReadmeContentRecursive(extractPath) || "";
        const folderTree = getFolderTree(extractPath);

        const code = `
        PROJECT STRUCTURE
            ${folderTree}
        ========================================
      PROJECT SOURCE CODE
      ${readFiles(extractPath)}`;

        console.log("CODE LENGTH:", code.length);

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }
        console.log("PROJECT FOUND:", project._id);

        const projectInfo = {
            title: project.title,
            description: project.description,
            language: project.language
        };

        // Single optimized call to avoid 429 rate limits
        console.log("Generating Complete AI Review...");
        const review = await generateProjectSummary(code, projectInfo);

        console.log("AI REVIEW GENERATED SUCCESSFULLY");

        project.review = review;
        project.reviewStatus = "Completed";
        project.reviewedAt = new Date();
        project.readme = readmeContent;

        project.reviewHistory.push({
            version: project.reviewHistory.length + 1,
            review: review,
            reviewedAt: new Date()
        });

        await project.save();
        console.log("PROJECT SAVED");

        return res.status(200).json({
            message: "Review generated successfully",
            review
        });

    } catch (error) {
        console.log("Upload Project Error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};

const reviewGithubProject = async (req, res) => {
    let clonePath;

    try {
        const { githubUrl } = req.body;

        if (!githubUrl) {
            return res.status(400).json({
                message: "GitHub URL is required"
            });
        }

        const repoName = githubUrl.split("/").pop().replace(".git", "");

        clonePath = path.join(
            __dirname,
            "..",
            "github-projects",
            `${repoName}-${Date.now()}`
        );

        const githubFolder = path.join(
            __dirname,
            "..",
            "github-projects"
        );

        if (!fs.existsSync(githubFolder)) {
            fs.mkdirSync(githubFolder, {
                recursive: true
            });
        }

        console.log("GitHub Review");
        console.log("Repository :", repoName);
        console.log("Cloning Repository...");

        await git.clone(githubUrl, clonePath);
        console.log("Repository Cloned Successfully");

        const folderTree = getFolderTree(clonePath);
        const rawCode = readFiles(clonePath);

        const code = `
        PROJECT STRUCTURE
            ${folderTree}
        ========================================
      PROJECT SOURCE CODE
      ${rawCode}`;

        const readmeContent = findReadmeContentRecursive(clonePath) || "";

        console.log("Generating AI Review...");

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const projectInfo = {
            title: project.title,
            description: project.description,
            language: project.language
        };

        // Single optimized call to prevent 429 errors
        const review = await generateProjectSummary(code, projectInfo);

        project.review = review;
        project.reviewStatus = "Completed";
        project.reviewedAt = new Date();
        project.readme = readmeContent;

        project.reviewHistory.push({
            version: project.reviewHistory.length + 1,
            review,
            reviewedAt: new Date()
        });

        await project.save();
        console.log("GitHub Review Saved Successfully");

        return res.status(200).json({
            success: true,
            message: "GitHub Review Generated Successfully",
            githubUrl,
            review
        });

    } catch (error) {
        console.error("GitHub Review Error :", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        if (clonePath && fs.existsSync(clonePath)) {
            await fs.promises.rm(clonePath, {
                recursive: true,
                force: true
            });
            console.log("Temporary GitHub Folder Deleted");
        }
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getReview = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            review: project.review,
            readme: project.readme || "",
            reviewStatus: project.reviewStatus,
            reviewedAt: project.reviewedAt
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getReviewHistory = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            history: project.reviewHistory.reverse()
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const cleanText = (text) => {
    if (!text) return "";
    return text
        .replace(/├──/g, "|--")
        .replace(/└──/g, "`--")
        .replace(/│/g, "|")
        .replace(/─/g, "-")
        .replace(/├/g, "|")
        .replace(/└/g, "`")
        .replace(/┌/g, "+")
        .replace(/┐/g, "+")
        .replace(/┴/g, "+")
        .replace(/┬/g, "+")
        .replace(/┤/g, "|")
        .replace(/┼/g, "+")
        .replace(/▲/g, "^")
        .replace(/▼/g, "v")
        .replace(/◀/g, "<")
        .replace(/▶/g, ">")
        .replace(/➔/g, "->")
        .replace(/→/g, "->")
        .replace(/←/g, "<-")
        .replace(/\*\*/g, "")
        .replace(/-{3,}/g, "---")
        .replace(/[•◦▪■]/g, "-")
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/[^\x00-\x7F]/g, "");
};

const downloadReviewPDF = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (project.owner.toString() !== req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const PDFDocument = require("pdfkit");
        const doc = new PDFDocument({
            margin: 50,
            size: "A4"
        });

        res.setHeader("Content-Type", "application/pdf");

        const safeTitle = (project.title || "project-review").replace(/[^\w\s-]/g, "").trim();
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${safeTitle}.pdf"; filename*=UTF-8''${encodeURIComponent(safeTitle)}.pdf`
        );

        doc.pipe(res);

        drawTitle(doc);
        drawProjectInfo(doc, project);

        // 1. Draw AI Code Review cleanly without undefined parser crashes
        if (project.review && project.review.trim().length > 0) {
            const cleanReview = cleanText(project.review);
            drawHeading(doc, "AI Code Review Report");
            drawParagraph(doc, cleanReview);
        }

        // 2. Draw Project README (if it exists)
        if (project.readme && project.readme.trim().length > 0) {
            doc.addPage();
            drawHeading(doc, "Project README Documentation");
            const cleanReadme = cleanText(project.readme);
            drawParagraph(doc, cleanReadme);
        }

        drawFooter(doc);
        doc.end();

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments({
            owner: req.user.id
        });

        const reviewedProjects = await Project.countDocuments({
            owner: req.user.id,
            reviewStatus: "Completed"
        });

        const pendingProjects = await Project.countDocuments({
            owner: req.user.id,
            reviewStatus: "Pending"
        });

        return res.status(200).json({
            totalProjects,
            reviewedProjects,
            pendingProjects
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const getRecentProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.user.id
        })
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const searchProjects = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const projects = await Project.find({
            owner: req.user.id,
            title: {
                $regex: keyword,
                $options: "i"
            }
        });

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const filterProjects = async (req, res) => {
    try {
        const status = req.query.status;

        const projects = await Project.find({
            owner: req.user.id,
            reviewStatus: status
        });

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    getProjectById,
    deleteProject,
    updateProject,
    uploadProject,
    getReview,
    getDashboardStats,
    getRecentProjects,
    searchProjects,
    filterProjects,
    getReviewHistory,
    downloadReviewPDF,
    reviewGithubProject
};
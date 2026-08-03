const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createProject, getMyProjects, updateProject, getProjectById, deleteProject, uploadProject, getReview, getDashboardStats, getRecentProjects, searchProjects, filterProjects, getReviewHistory, downloadReviewPDF, reviewGithubProject } = require("../controllers/projectController");

router.post("/create", authMiddleware, createProject);
router.get("/my-projects", authMiddleware, getMyProjects);
router.get("/dashboard/stats", authMiddleware, getDashboardStats);
router.get("/dashboard/recent", authMiddleware, getRecentProjects);
router.get("/search", authMiddleware, searchProjects);
router.get("/filter", authMiddleware, filterProjects);
router.post("/upload/:id", authMiddleware, upload.single("project"), uploadProject);
router.post("/:id/github-review", authMiddleware, reviewGithubProject);
router.get("/:id/review", authMiddleware, getReview);
router.get("/:id/history", authMiddleware, getReviewHistory);
router.get("/:id/download", authMiddleware, downloadReviewPDF);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
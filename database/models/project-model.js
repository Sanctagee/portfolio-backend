const mongoose = require("../database/")

const projectSchema = new mongoose.Schema({
  project_title: { type: String, required: true },
  project_description: { type: String, required: true },
  project_image: { type: String, default: null },
  project_url: { type: String, default: null },
  project_github: { type: String, default: null },
  project_tech: { type: String, default: null },
  project_featured: { type: Boolean, default: false },
  project_date: { type: Date, default: Date.now },
})

projectSchema.virtual("project_id").get(function () {
  return this._id.toString()
})
projectSchema.set("toJSON", { virtuals: true })
projectSchema.set("toObject", { virtuals: true })

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema, "project")

async function getAllProjects() {
  try {
    const projects = await Project.find().sort({ project_date: -1 })
    return projects
  } catch (error) {
    console.error("getAllProjects error:", error)
    return []
  }
}

async function getFeaturedProjects() {
  try {
    const projects = await Project.find({ project_featured: true }).sort({ project_date: -1 }).limit(6)
    return projects
  } catch (error) {
    console.error("getFeaturedProjects error:", error)
    return []
  }
}

async function getProjectById(project_id) {
  try {
    const project = await Project.findById(project_id)
    return project
  } catch (error) {
    console.error("getProjectById error:", error)
    return null
  }
}

async function addProject(
  project_title, project_description, project_image,
  project_url, project_github, project_tech, project_featured
) {
  try {
    const featured = project_featured === true || project_featured === "true" ||
                     project_featured === 1 || project_featured === "1"
    const project = await Project.create({
      project_title,
      project_description,
      project_image: project_image || null,
      project_url: project_url || null,
      project_github: project_github || null,
      project_tech: project_tech || null,
      project_featured: featured,
    })
    return project
  } catch (error) {
    console.error("addProject error:", error)
    return null
  }
}

async function updateProject(
  project_id, project_title, project_description, project_image,
  project_url, project_github, project_tech, project_featured
) {
  try {
    const featured = project_featured === true || project_featured === "true" ||
                     project_featured === 1 || project_featured === "1"
    const update = {
      project_title,
      project_description,
      project_url,
      project_github,
      project_tech,
      project_featured: featured,
    }
    // Mirrors the old COALESCE($3, project_image) — only overwrite the image if a new one was given.
    if (project_image) update.project_image = project_image

    const project = await Project.findByIdAndUpdate(project_id, update, { new: true })
    return project
  } catch (error) {
    console.error("updateProject error:", error)
    return null
  }
}

async function deleteProject(project_id) {
  try {
    const result = await Project.findByIdAndDelete(project_id)
    return !!result
  } catch (error) {
    console.error("deleteProject error:", error)
    return false
  }
}

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
}

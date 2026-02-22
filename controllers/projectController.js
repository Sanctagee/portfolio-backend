const projectModel = require('../models/project-model')

const projectCont = {}

/* ***************************
 * Get all projects (Public)
 * ************************** */
projectCont.getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectModel.getAllProjects()
    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Get featured projects (Public)
 * ************************** */
projectCont.getFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await projectModel.getFeaturedProjects()
    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Get single project (Public)
 * ************************** */
projectCont.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await projectModel.getProjectById(id)
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      })
    }
    res.json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add project (Admin only)
 * ************************** */
projectCont.addProject = async (req, res, next) => {
  try {
    const {
      project_title, project_description, project_image,
      project_url, project_github, project_tech, project_featured
    } = req.body

    const project = await projectModel.addProject(
      project_title, project_description, project_image,
      project_url, project_github, project_tech, project_featured
    )

    if (project) {
      res.status(201).json({ 
        success: true, 
        message: 'Project added successfully!', 
        data: project 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to add project' 
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Update project (Admin only)
 * ************************** */
projectCont.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      project_title, project_description, project_image,
      project_url, project_github, project_tech, project_featured
    } = req.body

    const project = await projectModel.updateProject(
      id, project_title, project_description, project_image,
      project_url, project_github, project_tech, project_featured
    )

    if (project) {
      res.json({ 
        success: true, 
        message: 'Project updated successfully!', 
        data: project 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update project' 
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Delete project (Admin only)
 * ************************** */
projectCont.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await projectModel.deleteProject(id)

    if (result) {
      res.json({ 
        success: true, 
        message: 'Project deleted successfully!' 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete project' 
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = projectCont
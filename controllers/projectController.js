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
 * Add project (Admin only) - WITH IMAGE UPLOAD
 * ************************** */
projectCont.addProject = async (req, res, next) => {
  try {
    const {
      project_title, project_description,
      project_url, project_github, project_tech, project_featured
    } = req.body

    // Handle image upload - if file was uploaded, use its path
    let project_image = req.body.project_image // Keep existing if provided via URL
    
    if (req.file) {
      // If file was uploaded, use the file path
      project_image = `/uploads/${req.file.filename}`
    }

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
 * Update project (Admin only) - WITH IMAGE UPLOAD
 * ************************** */
projectCont.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      project_title, project_description,
      project_url, project_github, project_tech, project_featured
    } = req.body

    // Handle image upload - if new file uploaded, use it; otherwise keep existing
    let project_image = req.body.project_image
    
    if (req.file) {
      // If new file was uploaded, use the file path
      project_image = `/uploads/${req.file.filename}`
      
      // Optional: Delete old image file here if you want to clean up
      // You'd need to get the old project first to get the old image path
    }

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
 * Delete project (Admin only) - WITH IMAGE CLEANUP
 * ************************** */
projectCont.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params
    
    // Optional: Get project first to delete the image file
    const project = await projectModel.getProjectById(id)
    
    const result = await projectModel.deleteProject(id)

    if (result) {
      // Optional: Delete image file from server
      if (project && project.project_image) {
        const fs = require('fs')
        const path = require('path')
        const imagePath = path.join(__dirname, '..', project.project_image)
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath) // Delete the file
        }
      }
      
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
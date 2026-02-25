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
      project_title, 
      project_description,
      project_url, 
      project_github, 
      project_tech, 
      is_featured  // Frontend sends is_featured
    } = req.body

    // Handle image upload
    let project_image = null
    
    if (req.file) {
      // Create full URL for the image
      const baseUrl = `${req.protocol}://${req.get('host')}`
      project_image = `${baseUrl}/uploads/${req.file.filename}`
      console.log('✅ Image uploaded:', project_image)
    } else if (req.body.project_image_url) {
      // If URL was provided instead of file
      project_image = req.body.project_image_url
    }

    // Convert featured to boolean properly
    const project_featured = is_featured === 'true' || 
                             is_featured === true || 
                             is_featured === '1' || 
                             is_featured === 1

    const project = await projectModel.addProject(
      project_title, 
      project_description, 
      project_image,
      project_url, 
      project_github, 
      project_tech, 
      project_featured
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
    console.error('❌ Add project error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during project creation'
    })
  }
}

/* ***************************
 * Update project (Admin only) - WITH IMAGE UPLOAD
 * ************************** */
projectCont.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      project_title, 
      project_description,
      project_url, 
      project_github, 
      project_tech, 
      is_featured
    } = req.body

    // Handle image upload
    let project_image = req.body.project_image // Keep existing image by default
    
    if (req.file) {
      // If new file uploaded
      const baseUrl = `${req.protocol}://${req.get('host')}`
      project_image = `${baseUrl}/uploads/${req.file.filename}`
      console.log('✅ Image uploaded for update:', project_image)
    }

    // Convert featured to boolean
    const project_featured = is_featured === 'true' || 
                             is_featured === true || 
                             is_featured === '1' || 
                             is_featured === 1

    const project = await projectModel.updateProject(
      id, 
      project_title, 
      project_description, 
      project_image,
      project_url, 
      project_github, 
      project_tech, 
      project_featured
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
    console.error('❌ Update project error:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error during project update'
    })
  }
}

/* ***************************
 * Delete project (Admin only) - WITH IMAGE CLEANUP
 * ************************** */
projectCont.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params
    
    // Get project first to get the image path for deletion
    const project = await projectModel.getProjectById(id)
    
    const result = await projectModel.deleteProject(id)

    if (result) {
      // Delete image file from server if it exists and is a local file
      if (project && project.project_image && project.project_image.includes('/uploads/')) {
        try {
          const fs = require('fs')
          const path = require('path')
          // Extract filename from URL
          const filename = project.project_image.split('/uploads/').pop()
          const imagePath = path.join(__dirname, '..', 'uploads', filename)
          
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
            console.log('✅ Deleted image file:', filename)
          }
        } catch (fileErr) {
          console.error('⚠️ Error deleting image file:', fileErr)
          // Don't fail the request if image deletion fails
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
    console.error('❌ Delete project error:', error)
    next(error)
  }
}

module.exports = projectCont
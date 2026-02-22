const skillModel = require("../models/skill-model")

const skillCont = {}

/* ***************************
 * Get All Skills (Public)
 * ************************** */
skillCont.getAllSkills = async (req, res, next) => {
  try {
    const skills = await skillModel.getAllSkills()
    res.json({ success: true, data: skills })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add Skill (Admin only)
 * ************************** */
skillCont.addSkill = async (req, res, next) => {
  try {
    const { skill_name, skill_category, skill_level, skill_icon, skill_order } = req.body
    const skill = await skillModel.addSkill(
      skill_name, skill_category, skill_level, skill_icon, skill_order
    )
    if (skill) {
      res.status(201).json({ success: true, message: "Skill added!", data: skill })
    } else {
      res.status(500).json({ success: false, message: "Failed to add skill" })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Update Skill (Admin only)
 * ************************** */
skillCont.updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params
    const { skill_name, skill_category, skill_level, skill_icon, skill_order } = req.body
    const skill = await skillModel.updateSkill(
      id, skill_name, skill_category, skill_level, skill_icon, skill_order
    )
    if (skill) {
      res.json({ success: true, message: "Skill updated!", data: skill })
    } else {
      res.status(500).json({ success: false, message: "Failed to update skill" })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Delete Skill (Admin only)
 * ************************** */
skillCont.deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await skillModel.deleteSkill(id)
    if (result) {
      res.json({ success: true, message: "Skill deleted!" })
    } else {
      res.status(500).json({ success: false, message: "Failed to delete skill" })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = skillCont
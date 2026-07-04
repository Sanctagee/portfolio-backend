const mongoose = require("../database/")

// Field names match the old Postgres columns exactly, so controllers and the
// frontend keep working unchanged. skill_id is a virtual mirroring Mongo's _id.
const skillSchema = new mongoose.Schema({
  skill_name: { type: String, required: true },
  skill_category: { type: String, required: true },
  skill_level: { type: Number, required: true, min: 1, max: 100 },
  skill_icon: { type: String, default: null },
  skill_order: { type: Number, default: 0 },
})

skillSchema.virtual("skill_id").get(function () {
  return this._id.toString()
})
skillSchema.set("toJSON", { virtuals: true })
skillSchema.set("toObject", { virtuals: true })

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema, "skill")

async function getAllSkills() {
  try {
    const skills = await Skill.find().sort({ skill_order: 1 })
    return skills
  } catch (error) {
    console.error("getAllSkills error:", error)
    return []
  }
}

async function addSkill(skill_name, skill_category, skill_level, skill_icon, skill_order) {
  try {
    const skill = await Skill.create({ skill_name, skill_category, skill_level, skill_icon, skill_order })
    return skill
  } catch (error) {
    console.error("addSkill error:", error)
    return null
  }
}

async function updateSkill(skill_id, skill_name, skill_category, skill_level, skill_icon, skill_order) {
  try {
    const skill = await Skill.findByIdAndUpdate(
      skill_id,
      { skill_name, skill_category, skill_level, skill_icon, skill_order },
      { new: true }
    )
    return skill
  } catch (error) {
    console.error("updateSkill error:", error)
    return null
  }
}

async function deleteSkill(skill_id) {
  try {
    const result = await Skill.findByIdAndDelete(skill_id)
    return !!result
  } catch (error) {
    console.error("deleteSkill error:", error)
    return false
  }
}

module.exports = { getAllSkills, addSkill, updateSkill, deleteSkill }

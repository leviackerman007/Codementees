import Course from "../models/course.model.js";

/**
 * Tool: getTrainingModules
 * Returns a summary list of all published onboarding training modules/paths.
 *
 * @returns {Array<{ title, description, duration, level, syllabusCount, contentCount }>}
 */
export async function getTrainingModules() {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("title description duration level techStack syllabus content")
      .lean();

    if (courses.length === 0) {
      return {
        message: "No published training modules are available yet.",
        modules: [],
      };
    }

    return courses.map((c) => ({
      title: c.title,
      description: c.description,
      duration: c.duration,
      level: c.level,
      topics: c.techStack || [],
      syllabusCount: c.syllabus?.length || 0,
      contentCount: c.content?.length || 0,
    }));
  } catch (err) {
    console.error("[Tool:getTrainingModules] Error:", err.message);
    return { error: "Failed to fetch training modules." };
  }
}

// Gemini Function Declaration for this tool
export const getTrainingModulesDeclaration = {
  name: "getTrainingModules",
  description:
    "Get the list of all available published onboarding training modules and learning paths. Use this when the user asks what courses are available, what they should study, or what training programs exist.",
  parameters: {
    type: "OBJECT",
    properties: {},
    required: [],
  },
};

import User from "../models/user.model.js";

export async function getAssignedMentor() {
  try {
    const mentors = await User.find({ role: "mentor" })
      .select("name email createdAt")
      .lean();

    if (mentors.length === 0) {
      return { message: "No onboarding managers are currently listed in the system." };
    }

    return mentors.map((m) => ({
      name: m.name,
      email: m.email,
    }));
  } catch (err) {
    console.error("[Tool:getAssignedMentor] Error:", err.message);
    return { error: "Failed to fetch mentor information." };
  }
}

export const getAssignedMentorDeclaration = {
  name: "getAssignedMentor",
  description:
    "Get the list of onboarding managers and mentors available in the company. Use this when the user asks who their manager is, who to contact for onboarding help, or who the mentors are.",
  parameters: {
    type: "OBJECT",
    properties: {},
    required: [],
  },
};

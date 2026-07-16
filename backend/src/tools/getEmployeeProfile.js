import User from "../models/user.model.js";

/**
 * Tool: getEmployeeProfile
 * Returns basic profile information for the authenticated user.
 *
 * @param {Object} context - { userId: string }
 * @returns {{ name, email, role, joinedDate }}
 */
export async function getEmployeeProfile({ userId }) {
  try {
    const user = await User.findById(userId).select("name email role createdAt").lean();
    if (!user) return { error: "Employee profile not found." };

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown",
    };
  } catch (err) {
    console.error("[Tool:getEmployeeProfile] Error:", err.message);
    return { error: "Failed to fetch employee profile." };
  }
}

// Gemini Function Declaration for this tool
export const getEmployeeProfileDeclaration = {
  name: "getEmployeeProfile",
  description:
    "Retrieve the authenticated employee's profile information including their name, email, role in the company, and the date they joined. Use this when the user asks about themselves or their account details.",
  parameters: {
    type: "OBJECT",
    properties: {},
    required: [],
  },
};

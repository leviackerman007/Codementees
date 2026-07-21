import Enrollment from "../models/enrollment.model.js";

// Progress % is stored in localStorage on the client, so we only return
// enrollment metadata and due dates from the server side.
export async function getChecklist({ userId }) {
  try {
    const enrollments = await Enrollment.find({ user: userId })
      .populate("course", "title description duration level")
      .lean();

    if (enrollments.length === 0) {
      return {
        enrolledCount: 0,
        message: "The employee is not currently enrolled in any onboarding paths.",
        courses: [],
      };
    }

    const courses = enrollments.map((e) => ({
      title: e.course?.title || "Unknown Course",
      description: e.course?.description || "",
      duration: e.course?.duration || "",
      enrolledAt: e.enrolledAt ? new Date(e.enrolledAt).toLocaleDateString() : "Unknown",
      dueDate: e.dueDate ? new Date(e.dueDate).toLocaleDateString() : null,
      assignedByAdmin: e.assignedByAdmin || false,
    }));

    const withDueDate = courses.filter((c) => c.dueDate);
    const overdue = courses.filter((c) => c.dueDate && new Date(c.dueDate) < new Date());

    return {
      enrolledCount: courses.length,
      overdueCount: overdue.length,
      upcomingDeadlines: withDueDate.length,
      courses,
    };
  } catch (err) {
    console.error("[Tool:getChecklist] Error:", err.message);
    return { error: "Failed to fetch onboarding checklist." };
  }
}

export const getChecklistDeclaration = {
  name: "getChecklist",
  description:
    "Get the employee's onboarding checklist — the list of enrolled training paths, due dates assigned by HR, and overall enrollment count. Use this when the user asks about their progress, assigned courses, deadlines, or what they still need to complete.",
  parameters: {
    type: "OBJECT",
    properties: {},
    required: [],
  },
};

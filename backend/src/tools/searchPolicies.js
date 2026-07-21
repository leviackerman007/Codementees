import KnowledgeDocument from "../models/knowledge.model.js";

export async function searchPolicies({ query }) {
  try {
    let docs = await KnowledgeDocument.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(4)
      .lean();

    // Fall back to recent docs if nothing matched the search
    if (docs.length === 0) {
      docs = await KnowledgeDocument.find().sort({ createdAt: -1 }).limit(3).lean();
    }

    return docs.map((d) => ({
      title: d.title,
      category: d.category,
      content: d.content,
    }));
  } catch (err) {
    console.error("[Tool:searchPolicies] Error:", err.message);
    return [];
  }
}

export const searchPoliciesDeclaration = {
  name: "searchPolicies",
  description:
    "Search the company knowledge base for HR policies, benefits information, technical guidelines, or any official company documents. Use this when the user asks about company rules, policies, procedures, or documentation.",
  parameters: {
    type: "OBJECT",
    properties: {
      query: {
        type: "STRING",
        description: "The search query to find relevant company documents, e.g. 'PTO policy' or 'engineering guidelines'",
      },
    },
    required: ["query"],
  },
};

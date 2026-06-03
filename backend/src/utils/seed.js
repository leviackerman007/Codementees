import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import KnowledgeDocument from "../models/knowledge.model.js";
import Enrollment from "../models/enrollment.model.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("✗ ERROR: MONGO_URI or MONGODB_URI environment variable is not defined");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✓ Connected to MongoDB.");

    // Clear existing collections
    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await KnowledgeDocument.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("✓ Collections cleared.");

    // Generate Hashed Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create Users
    console.log("Creating default users...");
    const adminUser = await User.create({
      name: "Sophia Martinez",
      email: "admin@onboardai.com",
      password: hashedPassword,
      role: "admin",
    });

    const managerUser = await User.create({
      name: "Marcus Vance",
      email: "manager@onboardai.com",
      password: hashedPassword,
      role: "mentor",
    });

    const employeeUser = await User.create({
      name: "Alex Rivera",
      email: "employee@onboardai.com",
      password: hashedPassword,
      role: "user",
    });

    console.log("✓ Created Users:");
    console.log(`  - Admin: ${adminUser.email} (pass: password123)`);
    console.log(`  - Manager: ${managerUser.email} (pass: password123)`);
    console.log(`  - Employee: ${employeeUser.email} (pass: password123)`);

    // Create Onboarding Paths (Courses)
    console.log("Creating default onboarding paths...");
    const path1 = await Course.create({
      title: "Engineering Team Boot Camp",
      description: "Master our internal code repositories, developer environments, Git branching workflows, and deployment pipelines.",
      duration: "2 Weeks",
      level: "Intermediate",
      techStack: ["Git", "Docker", "NodeJS", "Kubernetes", "AWS"],
      includes: [
        "Local Dev Environment Setup",
        "Git Branching & Pull Requests",
        "CI/CD Pipeline Overview",
        "API Guidelines & Design Standards",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Developer Accounts & Workspace Setup",
          description: "Get access to our tools and software.",
          topics: ["Requesting access tokens", "Setting up corporate Slack and Google accounts", "SSH keys configuration"],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 2: Code Repository & Local Env",
          description: "Clone the repo and boot up locally.",
          topics: ["Docker-compose command runs", "Seeding mock data", "Local environment variables config"],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 3: Continuous Integration & Delivery",
          description: "Learn how we test and deploy code.",
          topics: ["Linting standards", "Running automated tests", "Understanding deployment pipelines"],
        },
      ],
      content: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "1.1 Welcome to the Engineering Team",
          description: "A quick intro to our tech team guidelines.",
          videoUrl: "",
          resourceUrl: "https://github.com/leviackerman007/Codementees",
          type: "resource",
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "1.2 Getting Docker Configured",
          description: "Step by step instructions for getting Docker running on your dev laptop.",
          videoUrl: "",
          resourceUrl: "https://docs.docker.com",
          type: "resource",
        },
      ],
    });

    const path2 = await Course.create({
      title: "Corporate Culture, HR & Benefits Hub",
      description: "Learn about the company history, employee benefits, healthcare options, payroll schedules, and performance review cycles.",
      duration: "1 Week",
      level: "Beginner",
      techStack: ["Slack", "Notion", "Workday", "OnboardAI"],
      includes: [
        "Healthcare & Dental Benefits Details",
        "Paid Time Off (PTO) Tracking",
        "Expense Reporting Workflow",
        "Company OKRs & Mission Statement",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Welcome to the Team!",
          description: "Core values and who we are.",
          topics: ["Mission and Vision", "Leadership structure", "Slack etiquettes and channels"],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 2: Health Insurance & Wellness",
          description: "Details regarding coverage plans.",
          topics: ["Selecting health options", "Gym membership stipends", "Dental and Vision timelines"],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 3: Financial & Payroll Setup",
          description: "Setting up your banking details.",
          topics: ["Direct Deposit setup", "Payroll timeline", "Expense tracking and reimbursement"],
        },
      ],
      content: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "2.1 Welcome Message from the CEO",
          description: "Our organizational mission and core values.",
          videoUrl: "",
          resourceUrl: "",
          type: "text",
        },
      ],
    });

    console.log("✓ Created Onboarding Paths.");

    // Create default Knowledge Documents
    console.log("Creating default knowledge documents for RAG context...");
    await KnowledgeDocument.create([
      {
        title: "PTO & Vacation Policy",
        content: "The company offers 25 days of Paid Time Off (PTO) per calendar year, accrued monthly. Employees must submit PTO requests via the HR portal at least 5 business days in advance. All unused PTO up to 5 days can carry over to the next year. Onboarding Managers or HR team are available to answer queries.",
        category: "hr",
        uploadedBy: adminUser._id,
        fileName: "pto_policy.txt",
      },
      {
        title: "Engineering Developer Guidelines",
        content: "Our engineering codebase requires a minimum of 80% test coverage before merge. Pull requests must have approval from at least one peer developer. We use Docker to containerize our apps and deploy to Kubernetes on AWS. Code is deployed automatically after GitHub Actions CI checks pass.",
        category: "technical",
        uploadedBy: adminUser._id,
        fileName: "engineering_guidelines.md",
      },
      {
        title: "Health Insurance & Wellness Benefits",
        content: "Medical, dental, and vision insurance are covered 100% for full-time employees. Coverage begins on the first day of the month following the hire date. Gym memberships up to $50 per month are fully reimbursed as part of our health and wellness stipend.",
        category: "benefits",
        uploadedBy: adminUser._id,
        fileName: "insurance_benefits.txt",
      },
    ]);
    console.log("✓ Created Knowledge Base documents.");

    console.log("\n★ Database seeded successfully! ★");
  } catch (error) {
    console.error("✗ Seeding failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();

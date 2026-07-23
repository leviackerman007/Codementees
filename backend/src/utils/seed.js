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

    const path3 = await Course.create({
      title: "Security & Compliance 101",
      description: "Mandatory security awareness training covering data privacy, phishing, access management, and GDPR/SOC2 requirements.",
      duration: "2 Days",
      level: "Beginner",
      techStack: ["1Password", "Okta", "VPN"],
      includes: [
        "Phishing & Social Engineering Defence",
        "Password & Access Management",
        "GDPR Data Privacy Rules",
        "Incident Reporting Process",
      ],
      price: 0,
      createdBy: adminUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Threat Landscape",
          description: "Common attack vectors targeting new employees.",
          topics: ["Phishing emails", "Social engineering calls", "USB drops"],
        },
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 2: Access & Identity",
          description: "Securing your accounts and devices.",
          topics: ["Setting up 1Password", "MFA everywhere", "Okta SSO setup"],
        },
      ],
      content: [
        { _id: new mongoose.Types.ObjectId(), title: "3.1 Phishing Simulation Exercise", description: "Spot the fake email.", type: "text" },
      ],
    });

    const path4 = await Course.create({
      title: "Leadership & Management Track",
      description: "For new managers: effective 1:1s, performance reviews, feedback frameworks, and building psychologically safe teams.",
      duration: "3 Weeks",
      level: "Advanced",
      techStack: ["Lattice", "Notion", "Slack"],
      includes: [
        "Running Effective 1:1 Meetings",
        "Giving Constructive Feedback",
        "Performance Review Cycles",
        "Building Psychological Safety",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Your Role as a Manager",
          description: "Shifting from IC to manager mindset.",
          topics: ["Manager vs contributor", "Setting expectations", "Delegation basics"],
        },
      ],
      content: [
        { _id: new mongoose.Types.ObjectId(), title: "4.1 Manager Handbook", description: "Our internal guide for people managers.", type: "text" },
      ],
    });

    const path5 = await Course.create({
      title: "Sales & Revenue Enablement",
      description: "Product knowledge, objection handling scripts, CRM workflows, and pipeline management for the sales team.",
      duration: "1 Week",
      level: "Intermediate",
      techStack: ["Salesforce", "HubSpot", "Zoom"],
      includes: [
        "Product Demo Script & Walkthrough",
        "Handling Common Objections",
        "CRM Pipeline Management",
        "Closing & Contract Processes",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Our Product Story",
          description: "Understanding what we sell and why it matters.",
          topics: ["Value proposition", "Target personas", "Competitive landscape"],
        },
      ],
      content: [
        { _id: new mongoose.Types.ObjectId(), title: "5.1 Demo Script Recording", description: "Watch the standard demo walkthrough.", type: "video" },
      ],
    });

    const path6 = await Course.create({
      title: "Data & Analytics Fundamentals",
      description: "Product telemetry, dashboards, A/B experiments, and data-driven decision-making practices used across all teams.",
      duration: "1 Week",
      level: "Intermediate",
      techStack: ["Mixpanel", "Metabase", "Python", "SQL"],
      includes: [
        "Event Tracking & Instrumentation",
        "Building Dashboards in Metabase",
        "Running A/B Experiments",
        "Interpreting Statistical Significance",
      ],
      price: 0,
      createdBy: adminUser._id,
      isPublished: true,
      syllabus: [
        {
          _id: new mongoose.Types.ObjectId(),
          title: "Chapter 1: Data Sources & Tracking",
          description: "Where our data lives and how it flows.",
          topics: ["Mixpanel events", "SQL queries on Metabase", "ETL basics"],
        },
      ],
      content: [
        { _id: new mongoose.Types.ObjectId(), title: "6.1 SQL Query Starter Kit", description: "Our commonly used query templates.", type: "resource" },
      ],
    });

    console.log("✓ Created Onboarding Paths.");

    // Enroll the employee in path1 and path2 automatically
    await Enrollment.create([
      { user: employeeUser._id, course: path1._id, enrolledAt: new Date(), assignedByAdmin: true },
      { user: employeeUser._id, course: path2._id, enrolledAt: new Date(), assignedByAdmin: true },
    ]);
    console.log("✓ Auto-enrolled employee in Engineering Boot Camp and HR Hub.");

    // Create default Knowledge Documents
    console.log("Creating default knowledge documents for RAG context...");
    await KnowledgeDocument.create([
      {
        title: "PTO & Vacation Policy",
        content: "The company offers 25 days of Paid Time Off (PTO) per calendar year, accrued monthly. Employees must submit PTO requests via the HR portal at least 5 business days in advance. All unused PTO up to 5 days can carry over to the next year. Emergency leave of up to 3 days is available without prior notice.",
        category: "hr",
        uploadedBy: adminUser._id,
        fileName: "pto_policy.txt",
      },
      {
        title: "Engineering Developer Guidelines",
        content: "Our engineering codebase requires a minimum of 80% test coverage before merge. Pull requests must have approval from at least one peer developer. We use Docker to containerize apps and deploy to Kubernetes on AWS. Code is deployed automatically after GitHub Actions CI checks pass. Branch naming: feature/, fix/, chore/.",
        category: "technical",
        uploadedBy: adminUser._id,
        fileName: "engineering_guidelines.md",
      },
      {
        title: "Health Insurance & Wellness Benefits",
        content: "Medical, dental, and vision insurance are covered 100% for full-time employees. Coverage begins on the first day of the month following the hire date. Gym memberships up to $50 per month are fully reimbursed. Mental health support via BetterHelp is available for all employees.",
        category: "benefits",
        uploadedBy: adminUser._id,
        fileName: "insurance_benefits.txt",
      },
      {
        title: "Security Incident Response Policy",
        content: "Any suspected security incident must be reported within 1 hour to the security@company.com email and Slack #security-incidents channel. Do not attempt to remediate on your own. Preserve all evidence. The security team will lead a full investigation. Employees who report incidents in good faith are protected from any retaliation.",
        category: "security",
        uploadedBy: adminUser._id,
        fileName: "security_incident_policy.txt",
      },
      {
        title: "Remote Work & Equipment Policy",
        content: "All employees are eligible for a $1,500 home office stipend in their first year. Remote-first employees must be available during core hours 10am-3pm in their local timezone. Company laptops must not be used for personal projects. VPN must always be active when accessing internal systems.",
        category: "hr",
        uploadedBy: adminUser._id,
        fileName: "remote_work_policy.txt",
      },
      {
        title: "Code Review Standards",
        content: "Code reviews must be completed within 24 hours of the PR being raised. Reviewers should focus on logic correctness, test coverage, performance implications, and security vulnerabilities. Approvals are required from at least one senior engineer for backend changes. Frontend PRs need one cross-team design review for UI changes.",
        category: "technical",
        uploadedBy: adminUser._id,
        fileName: "code_review_standards.md",
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

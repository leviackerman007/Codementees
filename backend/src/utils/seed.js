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

const oid = () => new mongoose.Types.ObjectId();

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✓ Connected to MongoDB.");

    console.log("Clearing existing database collections...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await KnowledgeDocument.deleteMany({});
    await Enrollment.deleteMany({});
    console.log("✓ Collections cleared.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

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
    console.log(`  - Admin:    ${adminUser.email}   (pass: password123)`);
    console.log(`  - Manager:  ${managerUser.email} (pass: password123)`);
    console.log(`  - Employee: ${employeeUser.email} (pass: password123)`);

    console.log("Creating onboarding paths...");

    await Course.create({
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
        { _id: oid(), title: "Chapter 1: Developer Accounts & Workspace Setup", description: "Get access to our tools and software.", topics: ["Requesting access tokens", "Setting up corporate Slack and Google accounts", "SSH keys configuration"] },
        { _id: oid(), title: "Chapter 2: Code Repository & Local Env", description: "Clone the repo and boot up locally.", topics: ["Docker-compose command runs", "Seeding mock data", "Local environment variables config"] },
        { _id: oid(), title: "Chapter 3: CI/CD Pipelines", description: "Learn how we test and deploy code.", topics: ["Linting standards", "Running automated tests", "Understanding deployment pipelines"] },
      ],
      content: [
        { _id: oid(), title: "1.1 Welcome to the Engineering Team", description: "A quick intro to our tech team guidelines.", videoUrl: "", resourceUrl: "https://github.com/leviackerman007/Codementees", type: "resource" },
        { _id: oid(), title: "1.2 Getting Docker Configured", description: "Step by step Docker setup for your dev laptop.", videoUrl: "", resourceUrl: "https://docs.docker.com", type: "resource" },
      ],
    });

    await Course.create({
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
        { _id: oid(), title: "Chapter 1: Welcome to the Team!", description: "Core values and who we are.", topics: ["Mission and Vision", "Leadership structure", "Slack etiquettes and channels"] },
        { _id: oid(), title: "Chapter 2: Health Insurance & Wellness", description: "Details regarding coverage plans.", topics: ["Selecting health options", "Gym membership stipends", "Dental and Vision timelines"] },
        { _id: oid(), title: "Chapter 3: Financial & Payroll Setup", description: "Setting up your banking details.", topics: ["Direct Deposit setup", "Payroll timeline", "Expense tracking and reimbursement"] },
      ],
      content: [
        { _id: oid(), title: "2.1 Welcome Message from the CEO", description: "Our organizational mission and core values.", videoUrl: "", resourceUrl: "", type: "text" },
      ],
    });

    await Course.create({
      title: "Security & Compliance Essentials",
      description: "Understand our information security policies, GDPR compliance requirements, phishing awareness, and secure coding standards.",
      duration: "3 Days",
      level: "Beginner",
      techStack: ["1Password", "VPN", "JIRA", "Okta"],
      includes: [
        "Password Management Best Practices",
        "Phishing & Social Engineering Awareness",
        "Data Classification & Handling",
        "Incident Reporting Procedures",
        "GDPR & Data Privacy Basics",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: Identity & Access Management", description: "How we control who has access to what.", topics: ["SSO with Okta", "MFA setup", "VPN connection for remote work"] },
        { _id: oid(), title: "Chapter 2: Data Privacy & GDPR", description: "Your responsibilities around customer data.", topics: ["What constitutes personal data", "Data retention policies", "Reporting a data breach"] },
        { _id: oid(), title: "Chapter 3: Security Hygiene", description: "Day-to-day security habits every employee needs.", topics: ["Recognizing phishing emails", "Safe password practices", "Locking your workstation"] },
      ],
      content: [
        { _id: oid(), title: "3.1 Security Policies Overview", description: "Walk through our main security rules.", videoUrl: "", resourceUrl: "", type: "text" },
        { _id: oid(), title: "3.2 Phishing Awareness Quiz", description: "Test your ability to spot a phishing attempt.", videoUrl: "", resourceUrl: "", type: "text" },
      ],
    });

    await Course.create({
      title: "Product & Design Onboarding",
      description: "Get familiar with our product roadmap, design principles, user research processes, and the tools our product team uses daily.",
      duration: "1 Week",
      level: "Intermediate",
      techStack: ["Figma", "Notion", "Linear", "Miro", "Mixpanel"],
      includes: [
        "Product Vision & Roadmap Overview",
        "Our Design System & Component Library",
        "User Research & Usability Testing",
        "Agile Sprint Ceremonies",
        "Analytics & Feature Metrics",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: Product Vision & Strategy", description: "Where we are headed and why.", topics: ["Company roadmap Q1–Q4", "OKR alignment", "Stakeholder communication"] },
        { _id: oid(), title: "Chapter 2: Design Principles & Figma", description: "How we build beautiful, consistent UI.", topics: ["Our design system", "Component library conventions", "Handing off designs to engineering"] },
        { _id: oid(), title: "Chapter 3: Agile & Sprint Process", description: "How we plan and deliver each sprint.", topics: ["Backlog grooming", "Story points and estimation", "Retrospective format"] },
      ],
      content: [
        { _id: oid(), title: "4.1 Tour of Linear (Our Task Manager)", description: "How issues, projects, and cycles work in Linear.", videoUrl: "", resourceUrl: "https://linear.app/docs", type: "resource" },
        { _id: oid(), title: "4.2 Figma Basics for New Joiners", description: "Navigate our main Figma workspace.", videoUrl: "", resourceUrl: "https://www.figma.com/community", type: "resource" },
      ],
    });

    await Course.create({
      title: "Data & Analytics Onboarding",
      description: "Learn how our data infrastructure works, understand our key metrics dashboards, and get hands-on with SQL and our BI tools.",
      duration: "2 Weeks",
      level: "Advanced",
      techStack: ["Python", "SQL", "dbt", "Looker", "BigQuery", "Airflow"],
      includes: [
        "Data Warehouse Architecture Overview",
        "Writing Production-Quality SQL",
        "dbt Models & Data Lineage",
        "Key Business Metrics & Definitions",
        "Dashboard Creation in Looker",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: Our Data Stack", description: "The full data pipeline from ingestion to insight.", topics: ["BigQuery dataset overview", "Airflow DAG structure", "Data governance policy"] },
        { _id: oid(), title: "Chapter 2: dbt & Transformation Layer", description: "How raw data becomes clean models.", topics: ["Writing dbt models", "Testing and documentation", "Running dbt in CI"] },
        { _id: oid(), title: "Chapter 3: Looker & Dashboards", description: "Building and reading dashboards.", topics: ["LookML basics", "Building Explores", "Scheduling reports"] },
      ],
      content: [
        { _id: oid(), title: "5.1 BigQuery Access & Setup", description: "Get connected to the data warehouse.", videoUrl: "", resourceUrl: "https://cloud.google.com/bigquery/docs", type: "resource" },
        { _id: oid(), title: "5.2 Key Metrics Glossary", description: "Definitions for DAU, MAU, churn, LTV and more.", videoUrl: "", resourceUrl: "", type: "text" },
      ],
    });

    await Course.create({
      title: "Sales & Customer Success Onboarding",
      description: "Understand our sales process, learn how to use Salesforce, master our pitch deck, and get aligned on customer success playbooks.",
      duration: "1 Week",
      level: "Beginner",
      techStack: ["Salesforce", "HubSpot", "Gong", "Notion", "Zoom"],
      includes: [
        "Our ICP & Buyer Personas",
        "Sales Stages & Pipeline Management",
        "Demo Best Practices & Objection Handling",
        "Customer Success Handoff Process",
        "Renewal & Upsell Playbook",
      ],
      price: 0,
      createdBy: managerUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: Sales Fundamentals", description: "Our go-to-market strategy and ICP.", topics: ["Ideal customer profile", "Lead qualification (MEDDIC)", "Prospecting tools"] },
        { _id: oid(), title: "Chapter 2: CRM & Pipeline", description: "How we track and manage deals.", topics: ["Salesforce account setup", "Deal stages walkthrough", "Activity logging best practices"] },
        { _id: oid(), title: "Chapter 3: Customer Success", description: "Keeping customers happy after they sign.", topics: ["Onboarding call templates", "QBR format", "Escalation process"] },
      ],
      content: [
        { _id: oid(), title: "6.1 Product Demo Walkthrough", description: "A recorded product demo to learn from.", videoUrl: "", resourceUrl: "", type: "video" },
        { _id: oid(), title: "6.2 Salesforce Navigation Guide", description: "Key pages, views, and reports to know.", videoUrl: "", resourceUrl: "https://help.salesforce.com", type: "resource" },
      ],
    });

    await Course.create({
      title: "Leadership & Management Essentials",
      description: "For new managers and team leads — covers our people management philosophy, performance review process, hiring practices, and leadership frameworks.",
      duration: "2 Weeks",
      level: "Advanced",
      techStack: ["Lattice", "Workday", "Notion", "Google Meet"],
      includes: [
        "Our People Management Philosophy",
        "Running Effective 1:1s",
        "Performance Review Cycle",
        "Hiring & Interview Standards",
        "Compensation & Leveling Framework",
      ],
      price: 0,
      createdBy: adminUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: Leadership at Our Company", description: "What great leadership looks like here.", topics: ["Servant leadership model", "Giving and receiving feedback", "Psychological safety"] },
        { _id: oid(), title: "Chapter 2: People Processes", description: "The tools and ceremonies for managing people.", topics: ["1:1 templates", "Performance Improvement Plans (PIP)", "Career ladder conversations"] },
        { _id: oid(), title: "Chapter 3: Hiring & Interviewing", description: "How we attract and assess candidates.", topics: ["Writing a job description", "Structured interviews & scorecards", "Offer negotiation guidelines"] },
      ],
      content: [
        { _id: oid(), title: "7.1 Lattice Onboarding for Managers", description: "Set up your team in Lattice for performance tracking.", videoUrl: "", resourceUrl: "https://help.lattice.com", type: "resource" },
        { _id: oid(), title: "7.2 Manager Handbook", description: "The full manager handbook PDF.", videoUrl: "", resourceUrl: "", type: "text" },
      ],
    });

    await Course.create({
      title: "IT Setup & Tools Orientation",
      description: "Everything you need to get your laptop, accounts, and software configured on your first week, including VPN, SSO, and communication tools.",
      duration: "1 Day",
      level: "Beginner",
      techStack: ["macOS", "Okta", "Slack", "Google Workspace", "Zoom", "1Password"],
      includes: [
        "Laptop Unboxing & Initial Setup",
        "Google Workspace Account Configuration",
        "Slack Channels to Join Immediately",
        "VPN & Remote Access Setup",
        "1Password Team Vault Access",
      ],
      price: 0,
      createdBy: adminUser._id,
      isPublished: true,
      syllabus: [
        { _id: oid(), title: "Chapter 1: First-Day IT Checklist", description: "Every account and tool you need from day one.", topics: ["Google account setup", "Slack workspace join", "Laptop security settings"] },
        { _id: oid(), title: "Chapter 2: Communication & Calendar", description: "How we communicate and schedule internally.", topics: ["Slack channel guide", "Google Calendar best practices", "Zoom etiquette"] },
      ],
      content: [
        { _id: oid(), title: "8.1 IT Request Portal", description: "How to request software, hardware, or access.", videoUrl: "", resourceUrl: "", type: "text" },
      ],
    });

    console.log("✓ Created 8 onboarding paths.");

    console.log("Creating knowledge base documents...");
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
      {
        title: "Security & Acceptable Use Policy",
        content: "All employees must use company-approved devices for work. VPN is required when accessing internal systems remotely. Passwords must be stored in 1Password and must be at least 16 characters with MFA enabled. Suspected phishing emails should be reported to security@company.com immediately. Sharing credentials is strictly prohibited.",
        category: "security",
        uploadedBy: adminUser._id,
        fileName: "security_policy.txt",
      },
      {
        title: "Remote Work Policy",
        content: "Employees may work remotely up to 3 days per week. Core collaboration hours are 10am–3pm in the team's local timezone. All remote employees must have a stable internet connection and a quiet working environment for meetings. A $500 home office stipend is available for remote workers.",
        category: "hr",
        uploadedBy: adminUser._id,
        fileName: "remote_work_policy.txt",
      },
      {
        title: "Expense Reimbursement Policy",
        content: "Expenses up to $100 can be submitted without pre-approval. Expenses above $100 require manager sign-off before purchase. All expenses must be submitted within 30 days with valid receipts via Workday. Software subscriptions require IT approval before purchase.",
        category: "finance",
        uploadedBy: adminUser._id,
        fileName: "expense_policy.txt",
      },
    ]);
    console.log("✓ Created 6 knowledge base documents.");

    console.log("\n★ Database seeded successfully! ★\n");
    console.log("Demo Accounts:");
    console.log("  admin@onboardai.com   / password123  (Admin)");
    console.log("  manager@onboardai.com / password123  (Mentor)");
    console.log("  employee@onboardai.com/ password123  (Employee)");
  } catch (error) {
    console.error("✗ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

seedDatabase();

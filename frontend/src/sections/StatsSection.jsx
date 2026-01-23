import { motion } from "framer-motion";
import {
  UserGroupIcon,
  BookOpenIcon,
  CodeBracketIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default function StatsSection() {
  const features = [
    {
      title: "Superb mentors",
      desc: "Best in class mentors from top tech schools and industry favourite companies guide you personally.",
      icon: UserGroupIcon,
    },
    {
      title: "Industry-vetted curriculum",
      desc: "Content aligned with real industry needs to ensure you stand out as a tech professional.",
      icon: BookOpenIcon,
    },
    {
      title: "Project based learning",
      desc: "Hands-on learning with live projects focused on practical knowledge over theory.",
      icon: CodeBracketIcon,
    },
    {
      title: "Superb placements",
      desc: "Result-oriented programs with placement support for students and working professionals.",
      icon: BriefcaseIcon,
    },
  ];

  return (
    <section
      className="
        bg-gradient-to-b 
        from-slate-100 to-slate-200
        dark:from-slate-900 dark:to-slate-950
      "
    >
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Why CodeMentees?
          </h2>

          <p className="max-w-3xl leading-relaxed text-slate-700 dark:text-slate-300">
            Our platform is designed to help you master coding with expert-led mentorship,
            practical courses, and real-world projects. Whether you're a beginner or an
            experienced developer, we provide the guidance and support to accelerate your
            career growth.
          </p>
        </motion.div>

        {/* FEATURE CARDS */}
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="
                  rounded-xl p-6
                  bg-white/80 dark:bg-slate-900
                  border border-slate-200 dark:border-slate-800
                  backdrop-blur
                  hover:border-slate-400 dark:hover:border-slate-600
                  transition
                "
              >
                <Icon className="h-8 w-8 text-indigo-600 dark:text-yellow-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

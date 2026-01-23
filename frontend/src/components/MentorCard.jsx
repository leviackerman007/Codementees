export default function MentorCard({ mentor }) {
  return (
    <div className="card flex flex-col items-center text-center">
      <img
        src={mentor.image}
        alt={mentor.name}
        className="w-24 h-24 rounded-full object-cover mb-4"
      />

      <h3 className="text-lg font-semibold">
        {mentor.name}
      </h3>

      <p className="text-muted text-sm">
        {mentor.role} · {mentor.company}
      </p>

      <p className="text-sm mt-2">
        Experience: {mentor.experience}
      </p>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {mentor.expertise.map((skill) => (
          <span
            key={skill}
            className="text-xs px-3 py-1 rounded-full border border-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById } from "../../services/courseService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../utils/toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function StudyPathway() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null); // { type: 'syllabus' | 'content', data: any }
  const [completedItems, setCompletedItems] = useState([]); // Array of IDs

  const storageKey = user ? `onboardai_progress_${user._id || user.id}_${id}` : null;

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          setCompletedItems(JSON.parse(saved));
        } catch (e) {
          console.error("Error reading progress from storage", e);
        }
      }
    }
  }, [storageKey]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourseById(id);
      if (res && res.course) {
        setCourse(res.course);
        // Default to first content or syllabus item
        if (res.course.content && res.course.content.length > 0) {
          setActiveItem({ type: "content", data: res.course.content[0] });
        } else if (res.course.syllabus && res.course.syllabus.length > 0) {
          setActiveItem({ type: "syllabus", data: res.course.syllabus[0] });
        }
      } else {
        toast.error("Could not fetch onboarding pathway details.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to load path");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = (itemId) => {
    if (!storageKey) return;

    let updated;
    if (completedItems.includes(itemId)) {
      updated = completedItems.filter((i) => i !== itemId);
      toast.info("Marked as incomplete");
    } else {
      updated = [...completedItems, itemId];
      toast.success("🎉 Section completed!");
    }
    setCompletedItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Helper to extract embed url for YouTube or Vimeo
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    const vMatch = url.match(
      /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/i
    );
    if (vMatch && vMatch[3]) {
      return `https://player.vimeo.com/video/${vMatch[3]}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <LoadingSpinner size="lg" className="text-teal-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="panel text-center py-12">
        <h2 className="text-xl font-bold mb-2">Pathway Not Found</h2>
        <p className="text-muted mb-4">The requested onboarding path does not exist.</p>
        <button className="btn btn-primary" onClick={() => navigate("/dashboard/student")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const syllabusItems = course.syllabus || [];
  const contentItems = course.content || [];
  const totalItems = syllabusItems.length + contentItems.length;
  const completedCount = completedItems.filter(
    (id) =>
      syllabusItems.some((s) => s._id === id) ||
      contentItems.some((c) => c._id === id)
  ).length;

  const progressPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  return (
    <div className="space-y-6 fade-in">
      {/* HEADER WITH PROGRESS */}
      <div className="panel bg-gradient-to-r from-dash-panel to-transparent border-default p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate("/dashboard/student")}
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline mb-2 block"
          >
            ← Back to My Training
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
          <p className="text-sm text-muted mt-1">Level: {course.level} | Duration: {course.duration}</p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Overall Progress</span>
            <span>{progressPercent}% ({completedCount}/{totalItems} items)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* SIDEBAR NAVIGATION - 4 COLS */}
        <div className="lg:col-span-4 space-y-4">
          <div className="panel p-4 space-y-4">
            <h2 className="font-bold text-lg border-b border-default pb-2">Pathway Syllabus</h2>
            
            {/* CONTENT MODULES LIST */}
            {contentItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Training Modules</h3>
                <div className="space-y-1">
                  {contentItems.map((item) => {
                    const isCompleted = completedItems.includes(item._id);
                    const isActive = activeItem?.type === "content" && activeItem?.data?._id === item._id;

                    return (
                      <button
                        key={item._id}
                        onClick={() => setActiveItem({ type: "content", data: item })}
                        className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold border-l-4 border-teal-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg flex-shrink-0">
                            {item.type === "video" ? "🎬" : item.type === "text" ? "📝" : "📎"}
                          </span>
                          <span className="truncate text-sm">{item.title}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(item._id);
                          }}
                          className="w-4 h-4 accent-teal-600 cursor-pointer"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SYLLABUS TOPICS LIST */}
            {syllabusItems.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Concepts & Guides</h3>
                <div className="space-y-1">
                  {syllabusItems.map((item) => {
                    const isCompleted = completedItems.includes(item._id);
                    const isActive = activeItem?.type === "syllabus" && activeItem?.data?._id === item._id;

                    return (
                      <button
                        key={item._id}
                        onClick={() => setActiveItem({ type: "syllabus", data: item })}
                        className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${
                          isActive
                            ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 font-semibold border-l-4 border-teal-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg flex-shrink-0">📖</span>
                          <span className="truncate text-sm">{item.title}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(item._id);
                          }}
                          className="w-4 h-4 accent-teal-600 cursor-pointer"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {totalItems === 0 && (
              <p className="text-sm text-muted text-center py-4">No content has been added to this pathway yet.</p>
            )}
          </div>
        </div>

        {/* MAIN VIEWER - 8 COLS */}
        <div className="lg:col-span-8">
          {activeItem ? (
            <div className="panel p-6 space-y-6">
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4 border-b border-default pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {activeItem.type === "syllabus"
                        ? "📖"
                        : activeItem.data.type === "video"
                        ? "🎬"
                        : activeItem.data.type === "text"
                        ? "📝"
                        : "📎"}
                    </span>
                    <h2 className="text-xl font-bold">{activeItem.data.title}</h2>
                  </div>
                  <p className="text-xs text-muted mt-1 uppercase tracking-wider font-semibold">
                    {activeItem.type === "syllabus" ? "Syllabus Concept" : `Training Module (${activeItem.data.type})`}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleComplete(activeItem.data._id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 border ${
                    completedItems.includes(activeItem.data._id)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                      : "bg-teal-600 text-white border-transparent hover:bg-teal-700"
                  }`}
                >
                  {completedItems.includes(activeItem.data._id) ? "✓ Completed" : "Mark as Completed"}
                </button>
              </div>

              {/* BODY DESCRIPTION */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-secondary leading-relaxed whitespace-pre-line">
                  {activeItem.data.description || "No description provided."}
                </p>
              </div>

              {/* MEDIA/DASHBOARD VIEWER */}
              {activeItem.type === "content" && (
                <div className="space-y-4 pt-2">
                  {/* VIDEO EMEDDING */}
                  {activeItem.data.type === "video" && activeItem.data.videoUrl && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg">Video Lesson</h3>
                      {getEmbedUrl(activeItem.data.videoUrl) ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-default">
                          <iframe
                            src={getEmbedUrl(activeItem.data.videoUrl)}
                            title={activeItem.data.title}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <a
                          href={activeItem.data.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition"
                        >
                          ▶️ Watch Lesson on External Player
                        </a>
                      )}
                    </div>
                  )}

                  {/* RESOURCES DOWNLOAD */}
                  {activeItem.data.type === "resource" && activeItem.data.resourceUrl && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-default rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-teal-800 dark:text-teal-400 flex items-center gap-2">
                          <span>📎</span> Reference Resource Attachment
                        </h4>
                        <p className="text-xs text-muted mt-1 truncate max-w-md">{activeItem.data.resourceUrl}</p>
                      </div>
                      <a
                        href={activeItem.data.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary text-sm whitespace-nowrap self-start sm:self-auto"
                      >
                        📥 Download / View Resource
                      </a>
                    </div>
                  )}

                  {/* TEXT TYPE */}
                  {activeItem.data.type === "text" && activeItem.data.resourceUrl && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">Link Attachment</h3>
                      <a
                        href={activeItem.data.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 font-semibold hover:underline block"
                      >
                        🔗 View Link: {activeItem.data.resourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* SYLLABUS DETAIL */}
              {activeItem.type === "syllabus" && activeItem.data.topics && activeItem.data.topics.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-semibold text-lg">Key Topics & Concepts Covered</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {activeItem.data.topics.map((topic, index) => (
                      <div
                        key={index}
                        className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-default rounded-xl flex items-center gap-3"
                      >
                        <span className="text-teal-600 text-lg">✔</span>
                        <span className="font-medium text-sm">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="panel text-center py-20 text-muted">
              <span className="text-4xl block mb-2">📚</span>
              <p>Select a syllabus topic or module from the sidebar to begin studying.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

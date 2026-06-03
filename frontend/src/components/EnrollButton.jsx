import { useState } from 'react';
import { enrollInCourse } from '../services/enrollmentService';
import { toast } from '../utils/toast';
import LoadingSpinner from './LoadingSpinner';
import ConfirmModal from './ConfirmModal';

export default function EnrollButton({ course, onEnrollSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollInCourse(course._id);
      toast.success(`🎉 Successfully enrolled in ${course.title}!`);
      if (onEnrollSuccess) onEnrollSuccess();
    } catch (error) {
      toast.error(error.message || 'Failed to enroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="text-white" />
            <span>Enrolling...</span>
          </>
        ) : (
          <>
            <span>🎓</span>
            <span>Enroll Now</span>
          </>
        )}
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleEnroll}
        title="Confirm Enrollment"
        message={`Are you sure you want to enroll in "${course.title}"? You'll get access to all course materials and can track your progress.`}
        confirmText="Yes, Enroll Me!"
        cancelText="Cancel"
        type="info"
      />
    </>
  );
}

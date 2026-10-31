
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../../api/api";

const DeleteHabitModal = ({
  isOpen,
  onClose,
  onDelete,
  habitId,
  habitName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Escape key and prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  // Reset errors when the modal opens or the habit changes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
    }
  }, [isOpen, habitId]);

  // Don't render when closed
  if (!isOpen) return null;

  // Delete selected habit
  const handleDelete = async () => {

    
    if (isDeleting) return;


    if (!habitId) {
      setErrorMessage("Habit ID is missing. Please select a habit.");
      console.error("Cannot delete habit: habitId is missing.");
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      // Send DELETE request to the backend
      const response = await api.delete(
        `/habits/${encodeURIComponent(habitId)}`,
      );

      // Call the parent handler after the API request succeeds.
      // This accepts either a success flag or a successful HTTP response.
      if (
        response.status >= 200 &&
        response.status < 300 &&
        response.data?.success !== false
      ) {
        if (typeof onDelete === "function") {
          await onDelete(habitId);
        }

        onClose();
      } else {
        setErrorMessage(response.data?.message || "Failed to delete habit.");
      }
    } catch (error) {
      console.error(
        "Error deleting habit:",
        error.response?.data || error.message,
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to delete habit. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div
      className="habit-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <section
        className="habit-modal delete-habit-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-habit-title"
        aria-describedby="delete-habit-description"
        aria-busy={isDeleting}
      >
        {/* Close button */}
        <button
          type="button"
          className="habit-modal-close"
          onClick={onClose}
          aria-label="Close delete confirmation"
          disabled={isDeleting}
        >
          ×
        </button>

        {/* Modal heading */}
        <div className="habit-modal-heading">
          <div className="habit-modal-icon" aria-hidden="true">
            ⚠️
          </div>

          <h2 id="delete-habit-title">Are you sure?</h2>

          <p id="delete-habit-description">
            Are you sure you want to delete{" "}
            <strong>{habitName || "this habit"}</strong>? This action cannot
            be undone.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <p className="habit-error" role="alert">
            {errorMessage}
          </p>
        )}

        {/* Action buttons */}
        <div className="delete-habit-actions">
          <button
            type="button"
            className="btn_wht"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn_ppl"
            onClick={handleDelete}
            disabled={isDeleting || !habitId}
          >
            {isDeleting ? "Deleting..." : "Yes, delete"}
          </button>
        </div>

        {/* Footer */}
        <p className="habit-modal-footer">
          Your progress on this habit will be lost.
        </p>
      </section>
    </div>,
    document.body,
  );
};

export default DeleteHabitModal;

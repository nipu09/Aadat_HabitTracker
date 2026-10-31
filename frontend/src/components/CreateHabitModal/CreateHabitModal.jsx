import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./CreateHabitModal.css";
import api from "../../api/api";

const CreateHabitModal = ({ isOpen, onClose, onSave }) => {
  const [habitName, sethabitName] = useState("");

  const [description, setDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
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
  }, [isOpen, onClose, isSaving]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = habitName.trim();
    const habitDescription = description.trim();

    if (!name || isSaving) return;

    setIsSaving(true);
    setErrorMessage("");

    try {
      // Send the habit data to the backend
      const response = await api.post("/habits", {
        habitName: name,
        description: habitDescription,
      });

      if (response.status === 201) {
        const habit = response.data.habit;

        onSave(habit);

        sethabitName("");
        setDescription("");

        onClose();
      } else {
        setErrorMessage(
          "The habit could not be confirmed as created. Please try again.",
        );
      }
    } catch (error) {
      console.error(
        "Error creating habit:",
        error.response?.data || error.message,
      );

      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create habit. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="habit-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      
      <section
        className="habit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
        aria-busy={isSaving}
      >
        {/* Close button */}
        <button
          type="button"
          className="habit-modal-close"
          onClick={onClose}
          aria-label="Close create habit dialog"
          disabled={isSaving}
        >
          ×{" "}
        </button>
        {/* Modal heading */}
        <div className="habit-modal-heading">
          <div className="habit-modal-icon" aria-hidden="true">
            ✳
          </div>

          <h2 id="habit-modal-title">Create a habit</h2>

          <p>Grow one small habit at a time.</p>
        </div>
        {/* Habit creation form */}
        <form onSubmit={handleSubmit}>
          {/* Habit name */}
          <div className="habit-form-group">
            <label htmlFor="habit-name">Habit name</label>

            <input
              id="habit-name"
              type="text"
              placeholder="e.g. Practice gratitude"
              value={habitName}
              onChange={(event) => {
                sethabitName(event.target.value);

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              autoFocus
              required
              maxLength={100}
              disabled={isSaving}
            />
          </div>

          {/* Habit description */}
          <div className="habit-form-group">
            <label htmlFor="habit-description">Description</label>

            <input
              id="habit-description"
              type="text"
              placeholder="Write down 3 good things"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              maxLength={200}
              disabled={isSaving}
            />
          </div>

          {/* API error message */}
          {errorMessage && (
            <p className="habit-error" role="alert">
              {errorMessage}
            </p>
          )}

          {/* Submit button */}
          <button type="submit" className="habit-save-btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save habit"}
          </button>
        </form>
        {/* Footer */}
        <p className="habit-modal-footer">
          Small steps make meaningful changes.
        </p>
      </section>
    </div>,
    document.body,
  );
};

export default CreateHabitModal;

'use client';

import { useFormStatus } from 'react-dom';

interface DeleteMeetingButtonProps {
  meetingLabel: string;
}

/**
 * Submit button for the delete form. Asks for confirmation first and shows a
 * pending state while the Server Action runs.
 */
export default function DeleteMeetingButton({
  meetingLabel,
}: DeleteMeetingButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Delete meeting on ${meetingLabel}`}
      onClick={(event) => {
        const confirmed = window.confirm(
          `Delete the meeting on ${meetingLabel}? This cannot be undone.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="font-semibold text-red-700 hover:text-red-900 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}

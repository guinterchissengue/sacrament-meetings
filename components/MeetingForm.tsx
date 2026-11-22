'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { MEETING_TYPE_OPTIONS, emptyMeetingFormValues } from '@/lib/meeting-form';
import type {
  MeetingFormErrors,
  MeetingFormField,
  MeetingFormState,
  MeetingFormValues,
  SpeakerFormValue,
} from '@/lib/types';

type MeetingFormAction = (
  prevState: MeetingFormState,
  formData: FormData
) => Promise<MeetingFormState>;

interface MeetingFormProps {
  action: MeetingFormAction;
  submitLabel: string;
  initialValues?: MeetingFormValues;
}

const baseInput =
  "w-full rounded-lg border bg-white px-3 py-2 text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-700";

function inputClass(hasError: boolean) {
  return `${baseInput} ${hasError ? "border-red-600" : "border-slate-300"}`;
}

/**
 * Error container. It is always rendered (even when empty) so screen readers
 * already know the live region exists and announce messages when they appear.
 */
function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  return (
    <div id={id} aria-live="polite" className="mt-1 text-sm text-red-700">
      {messages?.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

interface TextFieldProps {
  name: MeetingFormField;
  label: string;
  defaultValue: string;
  errors: MeetingFormErrors;
  type?: "text" | "date";
  inputMode?: "numeric";
}

function TextField({
  name,
  label,
  defaultValue,
  errors,
  type = "text",
  inputMode,
}: TextFieldProps) {
  const fieldErrors = errors[name];

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        defaultValue={defaultValue}
        aria-invalid={fieldErrors ? true : undefined}
        aria-describedby={`${name}-error`}
        className={inputClass(Boolean(fieldErrors))}
      />
      <FieldError id={`${name}-error`} messages={fieldErrors} />
    </div>
  );
}

interface TextAreaFieldProps {
  name: MeetingFormField;
  label: string;
  hint: string;
  defaultValue: string;
  errors: MeetingFormErrors;
}

function TextAreaField({ name, label, hint, defaultValue, errors }: TextAreaFieldProps) {
  const fieldErrors = errors[name];

  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <p id={`${name}-hint`} className="mb-1 text-sm text-slate-500">
        {hint}
      </p>
      <textarea
        id={name}
        name={name}
        rows={4}
        defaultValue={defaultValue}
        aria-invalid={fieldErrors ? true : undefined}
        aria-describedby={`${name}-hint ${name}-error`}
        className={inputClass(Boolean(fieldErrors))}
      />
      <FieldError id={`${name}-error`} messages={fieldErrors} />
    </div>
  );
}

interface HymnFieldsProps {
  legend: string;
  numberName: MeetingFormField;
  titleName: MeetingFormField;
  numberValue: string;
  titleValue: string;
  errors: MeetingFormErrors;
}

function HymnFields({
  legend,
  numberName,
  titleName,
  numberValue,
  titleValue,
  errors,
}: HymnFieldsProps) {
  return (
    <fieldset className="rounded-lg border border-slate-200 p-4">
      <legend className="px-2 text-sm font-bold text-slate-900">{legend}</legend>
      <div className="grid gap-4 sm:grid-cols-[9rem_1fr]">
        <TextField
          name={numberName}
          label="Hymn number"
          defaultValue={numberValue}
          errors={errors}
          inputMode="numeric"
        />
        <TextField
          name={titleName}
          label="Hymn title"
          defaultValue={titleValue}
          errors={errors}
        />
      </div>
    </fieldset>
  );
}

const emptySpeaker: SpeakerFormValue = { name: "", topic: "", type: "speaker" };

export default function MeetingForm({
  action,
  submitLabel,
  initialValues,
}: MeetingFormProps) {
  const startValues = initialValues ?? emptyMeetingFormValues();

  const initialState: MeetingFormState = {
    message: null,
    errors: {},
    values: startValues,
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  // React resets uncontrolled fields after every action, so we re-fill them
  // from the values returned by the server (what the user actually typed).
  const values = state.values ?? startValues;
  const errors = state.errors;

  // Always show one spare row; "Add another" appends more.
  const [rowCount, setRowCount] = useState(
    Math.max(startValues.speakers.length + 1, 3)
  );

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    const firstField = Object.keys(state.errors)[0];
    if (!firstField) return;

    const targetId = firstField === "speakers" ? "speaker-name-0" : firstField;
    document.getElementById(targetId)?.focus();
  }, [state]);

  const hasErrors = Object.keys(errors).length > 0;
  const meetingTypeErrors = errors.meetingType;
  const speakerErrors = errors.speakers;

  return (
    <form
      action={formAction}
      noValidate
      aria-describedby="form-status"
      className="mx-auto max-w-3xl space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Form-level status: announced to screen readers when it changes */}
      <div id="form-status" role="status" aria-live="polite">
        {state.message && (
          <p
            className={`rounded-lg border p-3 text-sm font-medium ${
              hasErrors
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {state.message}
          </p>
        )}
      </div>

      {/* Basics */}
      <fieldset className="space-y-4">
        <legend className="mb-2 text-lg font-bold text-slate-900">
          Meeting details
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="date"
            label="Meeting date"
            type="date"
            defaultValue={values.date}
            errors={errors}
          />

          <div>
            <label htmlFor="meetingType" className="mb-1 block text-sm font-semibold text-slate-800">
              Meeting type
            </label>
            <select
              id="meetingType"
              name="meetingType"
              defaultValue={values.meetingType}
              aria-invalid={meetingTypeErrors ? true : undefined}
              aria-describedby="meetingType-error"
              className={inputClass(Boolean(meetingTypeErrors))}
            >
              <option value="">Select a type…</option>
              {MEETING_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FieldError id="meetingType-error" messages={meetingTypeErrors} />
          </div>

          <TextField name="presiding" label="Presiding" defaultValue={values.presiding} errors={errors} />
          <TextField name="conducting" label="Conducting" defaultValue={values.conducting} errors={errors} />
        </div>
      </fieldset>

      <TextAreaField
        name="announcements"
        label="Announcements (optional)"
        hint="Write one announcement per line."
        defaultValue={values.announcements}
        errors={errors}
      />

      <HymnFields
        legend="Opening hymn"
        numberName="openingHymnNumber"
        titleName="openingHymnTitle"
        numberValue={values.openingHymnNumber}
        titleValue={values.openingHymnTitle}
        errors={errors}
      />

      <TextField name="openingPrayer" label="Opening prayer" defaultValue={values.openingPrayer} errors={errors} />

      <div className="space-y-4">
        <TextAreaField
          name="wardBusiness"
          label="Ward business (optional)"
          hint="Write one item per line."
          defaultValue={values.wardBusiness}
          errors={errors}
        />

        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-semibold text-slate-800">
            There is stake business
          </label>
        </div>
      </div>

      <HymnFields
        legend="Sacrament hymn"
        numberName="sacramentHymnNumber"
        titleName="sacramentHymnTitle"
        numberValue={values.sacramentHymnNumber}
        titleValue={values.sacramentHymnTitle}
        errors={errors}
      />

      {/* Speakers and musical numbers */}
      <fieldset
        aria-describedby="speakers-hint speakers-error"
        className="space-y-4 rounded-lg border border-slate-200 p-4"
      >
        <legend className="px-2 text-sm font-bold text-slate-900">
          Speakers and musical numbers
        </legend>
        <p id="speakers-hint" className="text-sm text-slate-500">
          Empty rows are ignored. Use “Add another row” if you need more.
        </p>
        <FieldError id="speakers-error" messages={speakerErrors} />

        {Array.from({ length: rowCount }, (_, index) => {
          const row = values.speakers[index] ?? emptySpeaker;

          return (
            <fieldset
              key={index}
              className="grid gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_11rem]"
            >
              <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Row {index + 1}
              </legend>

              <div>
                <label htmlFor={`speaker-name-${index}`} className="mb-1 block text-sm font-semibold text-slate-800">
                  Name
                </label>
                <input
                  id={`speaker-name-${index}`}
                  name="speakerName"
                  type="text"
                  defaultValue={row.name}
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label htmlFor={`speaker-topic-${index}`} className="mb-1 block text-sm font-semibold text-slate-800">
                  Topic or title
                </label>
                <input
                  id={`speaker-topic-${index}`}
                  name="speakerTopic"
                  type="text"
                  defaultValue={row.topic}
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label htmlFor={`speaker-type-${index}`} className="mb-1 block text-sm font-semibold text-slate-800">
                  Type
                </label>
                <select
                  id={`speaker-type-${index}`}
                  name="speakerType"
                  defaultValue={row.type}
                  className={inputClass(false)}
                >
                  <option value="speaker">Speaker</option>
                  <option value="musical-number">Musical number</option>
                </select>
              </div>
            </fieldset>
          );
        })}

        <button
          type="button"
          onClick={() => setRowCount((count) => Math.min(count + 1, 20))}
          className="rounded-lg border border-slate-400 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
        >
          Add another row
        </button>
      </fieldset>

      <HymnFields
        legend="Closing hymn"
        numberName="closingHymnNumber"
        titleName="closingHymnTitle"
        numberValue={values.closingHymnNumber}
        titleValue={values.closingHymnTitle}
        errors={errors}
      />

      <TextField name="closingPrayer" label="Closing prayer" defaultValue={values.closingPrayer} errors={errors} />

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving…" : submitLabel}
        </button>

        <Link href="/meetings" className="font-medium text-slate-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}

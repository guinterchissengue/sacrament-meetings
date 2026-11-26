'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  addMeeting,
  updateMeeting as updateMeetingRecord,
  deleteMeeting as deleteMeetingRecord,
} from '@/lib/meetings-db';
import type {
  MeetingFormErrors,
  MeetingFormField,
  MeetingFormState,
  MeetingFormValues,
  MeetingInput,
  MeetingType,
} from '@/lib/types';

const MEETING_TYPES: MeetingType[] = [
  'testimony',
  'regular',
  'stake',
  'general',
  'special',
];

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function isRealDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const requiredText = (label: string, max = 100) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

const hymnNumber = (label: string) =>
  z
    .string()
    .trim()
    .regex(/^\d{1,4}$/, `${label} must be a whole number from 1 to 1000.`)
    .refine((value) => {
      const number = Number(value);
      return number >= 1 && number <= 1000;
    }, `${label} must be a whole number from 1 to 1000.`);

const MeetingFormSchema = z.object({
  date: z
    .string()
    .trim()
    .refine(isRealDate, 'Choose a valid meeting date.'),
  meetingType: z
    .string()
    .refine(
      (value) => MEETING_TYPES.includes(value as MeetingType),
      'Select a meeting type.'
    ),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  announcements: z
    .string()
    .max(2000, 'Announcements must be 2000 characters or fewer.'),
  openingHymnNumber: hymnNumber('Opening hymn number'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  wardBusiness: z
    .string()
    .max(2000, 'Ward business must be 2000 characters or fewer.'),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber('Sacrament hymn number'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  speakers: z
    .array(
      z.object({
        name: z.string().trim().max(100),
        topic: z.string().trim().max(200),
        type: z.enum(['speaker', 'musical-number']),
      })
    )
    .max(20, 'A meeting can have at most 20 speakers or musical numbers.')
    .superRefine((rows, ctx) => {
      rows.forEach((row, index) => {
        const hasName = row.name !== '';
        const hasTopic = row.topic !== '';

        // A completely empty row is simply ignored.
        if (hasName !== hasTopic) {
          ctx.addIssue({
            code: 'custom',
            path: [index],
            message: `Row ${index + 1}: enter both a name and a topic (or leave the row empty).`,
          });
        }
      });
    }),
  closingHymnNumber: hymnNumber('Closing hymn number'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
});

/**
 * Reads the raw FormData into plain strings, keeping exactly what the user
 * typed so the form can be re-filled after a failed validation.
 */
function readFormValues(formData: FormData): MeetingFormValues {
  const text = (name: string) => String(formData.get(name) ?? '');

  const names = formData.getAll('speakerName').map(String);
  const topics = formData.getAll('speakerTopic').map(String);
  const types = formData.getAll('speakerType').map(String);
  const rowCount = Math.max(names.length, topics.length, types.length);

  return {
    date: text('date'),
    meetingType: text('meetingType'),
    presiding: text('presiding'),
    conducting: text('conducting'),
    announcements: text('announcements'),
    openingHymnNumber: text('openingHymnNumber'),
    openingHymnTitle: text('openingHymnTitle'),
    openingPrayer: text('openingPrayer'),
    wardBusiness: text('wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymnNumber: text('sacramentHymnNumber'),
    sacramentHymnTitle: text('sacramentHymnTitle'),
    speakers: Array.from({ length: rowCount }, (_, index) => ({
      name: names[index] ?? '',
      topic: topics[index] ?? '',
      type:
        types[index] === 'musical-number'
          ? ('musical-number' as const)
          : ('speaker' as const),
    })),
    closingHymnNumber: text('closingHymnNumber'),
    closingHymnTitle: text('closingHymnTitle'),
    closingPrayer: text('closingPrayer'),
  };
}

function splitLines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

type ValidationResult =
  | { success: true; data: MeetingInput; values: MeetingFormValues }
  | { success: false; state: MeetingFormState };

/**
 * Validates the submitted form with Zod. On success it returns the data
 * converted to the SacramentMeeting shape; on failure it returns a State
 * object with field-level error messages.
 */
function validateMeetingForm(formData: FormData): ValidationResult {
  const values = readFormValues(formData);
  const result = MeetingFormSchema.safeParse(values);

  if (!result.success) {
    const errors: MeetingFormErrors = {};

    for (const issue of result.error.issues) {
      const field = String(issue.path[0]) as MeetingFormField;
      const messages = (errors[field] ??= []);

      // Show one message per field, except the speakers group where
      // every incomplete row is listed.
      if (field === 'speakers' || messages.length === 0) {
        if (!messages.includes(issue.message)) {
          messages.push(issue.message);
        }
      }
    }

    return {
      success: false,
      state: {
        message: 'Please correct the highlighted fields and try again.',
        errors,
        values,
      },
    };
  }

  const form = result.data;
  const announcements = splitLines(form.announcements);

  return {
    success: true,
    values,
    data: {
      date: form.date,
      meetingType: form.meetingType as MeetingType,
      presiding: form.presiding,
      conducting: form.conducting,
      announcements: announcements.length > 0 ? announcements : undefined,
      openingHymn: {
        number: Number(form.openingHymnNumber),
        title: form.openingHymnTitle,
      },
      openingPrayer: form.openingPrayer,
      wardBusiness: splitLines(form.wardBusiness).map((description) => ({
        description,
      })),
      stakeBusiness: form.stakeBusiness,
      sacramentHymn: {
        number: Number(form.sacramentHymnNumber),
        title: form.sacramentHymnTitle,
      },
      speakers: form.speakers
        .filter((row) => row.name !== '' && row.topic !== '')
        .map((row) => ({
          name: row.name,
          topic: row.topic,
          type: row.type,
        })),
      closingHymn: {
        number: Number(form.closingHymnNumber),
        title: form.closingHymnTitle,
      },
      closingPrayer: form.closingPrayer,
    },
  };
}

const MAX_INT4 = 2_147_483_647; // SERIAL limit: larger ids would make PostgreSQL throw

/**
 * Every mutation is checked here too: the proxy only protects pages, but a Server Action
 * can be called from any page (the Delete button is on the public list).
 */
async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
}

function isValidId(id: number): boolean {
  return Number.isInteger(id) && id >= 1 && id <= MAX_INT4;
}

/** date is UNIQUE in the meetings table: PostgreSQL error 23505 = duplicate value. */
function isDuplicateDateError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}

function duplicateDateState(values: MeetingFormValues): MeetingFormState {
  return {
    message: 'Please correct the highlighted fields and try again.',
    errors: { date: ['A meeting already exists for this date.'] },
    values,
  };
}

/* ------------------------------------------------------------------ */
/* Server Actions                                                      */
/* ------------------------------------------------------------------ */

/**
 * Creates a meeting. Used with useActionState in the 'new meeting' form.
 */
export async function createMeeting(
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireSession();
  const validation = validateMeetingForm(formData);

  if (!validation.success) {
    return validation.state;
  }

  try {
    await addMeeting(validation.data);
  } catch (error) {
    if (isDuplicateDateError(error)) {
      return duplicateDateState(validation.values);
    }
    console.error('createMeeting failed:', error);
    throw new Error('We could not create the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  revalidatePath('/meetings/current');
  redirect('/meetings');
}

/**
 * Updates a meeting. Bound to the meeting id in the edit page:
 * updateMeeting.bind(null, id)
 */
export async function updateMeeting(
  id: number,
  prevState: MeetingFormState,
  formData: FormData
): Promise<MeetingFormState> {
  await requireSession();
  const validation = validateMeetingForm(formData);

  if (!validation.success) {
    return validation.state;
  }

  if (!isValidId(id)) {
    return {
      message: 'This meeting could not be found.',
      errors: {},
      values: readFormValues(formData),
    };
  }

  let updated: Awaited<ReturnType<typeof updateMeetingRecord>>;

  try {
    updated = await updateMeetingRecord(id, validation.data);
  } catch (error) {
    if (isDuplicateDateError(error)) {
      return duplicateDateState(validation.values);
    }
    console.error('updateMeeting failed:', error);
    throw new Error('We could not update the meeting. Please try again.');
  }

  if (updated === null) {
    return {
      message: 'This meeting no longer exists, so it could not be updated.',
      errors: {},
      values: readFormValues(formData),
    };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  revalidatePath('/meetings/current');
  redirect('/meetings');
}

/**
 * Deletes a meeting. Bound to the meeting id in the delete form:
 * <form action={deleteMeeting.bind(null, meeting.id)}>
 */
export async function deleteMeeting(id: number): Promise<void> {
  await requireSession();
  if (!isValidId(id)) {
    throw new Error('Invalid meeting id.');
  }

  try {
    await deleteMeetingRecord(id);
  } catch (error) {
    console.error('deleteMeeting failed:', error);
    throw new Error('We could not delete the meeting. Please try again.');
  }

  // The list page re-renders in place, so no redirect is needed here.
  revalidatePath('/meetings');
  revalidatePath('/meetings/current');
}

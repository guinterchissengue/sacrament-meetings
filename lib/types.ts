export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general'
  | 'special';

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  date: string;              // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}

/**
 * Data needed to create or update a meeting (everything except the id).
 */
export type MeetingInput = Omit<SacramentMeeting, "id">;

/**
 * Names of the form fields that can show a validation error.
 * They match the `name`/`id` attributes used in MeetingForm.
 */
export type MeetingFormField =
  | "date"
  | "meetingType"
  | "presiding"
  | "conducting"
  | "announcements"
  | "openingHymnNumber"
  | "openingHymnTitle"
  | "openingPrayer"
  | "wardBusiness"
  | "sacramentHymnNumber"
  | "sacramentHymnTitle"
  | "speakers"
  | "closingHymnNumber"
  | "closingHymnTitle"
  | "closingPrayer";

/**
 * Field-level error messages returned by the Server Actions.
 */
export type MeetingFormErrors = Partial<Record<MeetingFormField, string[]>>;

/**
 * One speaker / musical number row as it exists in the form (plain strings).
 */
export interface SpeakerFormValue {
  name: string;
  topic: string;
  type: SpeakerItem["type"];
}

/**
 * Raw values of the meeting form. Everything is a string (or boolean) so the
 * form can be re-filled with exactly what the user typed after a failed submit.
 */
export interface MeetingFormValues {
  date: string;
  meetingType: string;
  presiding: string;
  conducting: string;
  announcements: string; // one announcement per line
  openingHymnNumber: string;
  openingHymnTitle: string;
  openingPrayer: string;
  wardBusiness: string; // one item per line
  stakeBusiness: boolean;
  sacramentHymnNumber: string;
  sacramentHymnTitle: string;
  speakers: SpeakerFormValue[];
  closingHymnNumber: string;
  closingHymnTitle: string;
  closingPrayer: string;
}

/**
 * State returned by createMeeting / updateMeeting and consumed by useActionState.
 */
export interface MeetingFormState {
  message: string | null;
  errors: MeetingFormErrors;
  values?: MeetingFormValues;
}

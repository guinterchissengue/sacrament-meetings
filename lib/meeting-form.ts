import type {
  MeetingFormValues,
  MeetingType,
  SacramentMeeting,
} from './types';

/**
 * Meeting types shown in the form's <select>.
 */
export const MEETING_TYPE_OPTIONS: { value: MeetingType; label: string }[] = [
  { value: 'regular', label: 'Regular Sacrament' },
  { value: 'testimony', label: 'Fast & Testimony' },
  { value: 'stake', label: 'Stake Conference (Non-Sacrament)' },
  { value: 'general', label: 'General Conference (Non-Sacrament)' },
  { value: 'special', label: 'Special Sacrament Meeting' },
];

/**
 * Initial (blank) values for the "Create meeting" form.
 */
export function emptyMeetingFormValues(): MeetingFormValues {
  return {
    date: "",
    meetingType: "",
    presiding: "",
    conducting: "",
    announcements: "",
    openingHymnNumber: "",
    openingHymnTitle: "",
    openingPrayer: "",
    wardBusiness: "",
    stakeBusiness: false,
    sacramentHymnNumber: "",
    sacramentHymnTitle: "",
    speakers: [],
    closingHymnNumber: "",
    closingHymnTitle: "",
    closingPrayer: "",
  };
}

/**
 * Converts a saved meeting into the string-based values used by the form.
 */
export function meetingToFormValues(
  meeting: SacramentMeeting
): MeetingFormValues {
  return {
    date: meeting.date,
    meetingType: meeting.meetingType,
    presiding: meeting.presiding,
    conducting: meeting.conducting,
    announcements: (meeting.announcements ?? []).join("\n"),
    openingHymnNumber: String(meeting.openingHymn.number),
    openingHymnTitle: meeting.openingHymn.title,
    openingPrayer: meeting.openingPrayer,
    wardBusiness: meeting.wardBusiness
      .map((item) => item.description)
      .join("\n"),
    stakeBusiness: meeting.stakeBusiness,
    sacramentHymnNumber: String(meeting.sacramentHymn.number),
    sacramentHymnTitle: meeting.sacramentHymn.title,
    speakers: meeting.speakers.map((item) => ({
      name: item.name,
      topic: item.topic,
      type: item.type,
    })),
    closingHymnNumber: String(meeting.closingHymn.number),
    closingHymnTitle: meeting.closingHymn.title,
    closingPrayer: meeting.closingPrayer,
  };
}

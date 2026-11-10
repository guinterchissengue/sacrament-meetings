import type { SacramentMeeting } from './types';

export function getMostRecentSundayISO(referenceDate: Date = new Date()): string {
  const dayOfWeek = referenceDate.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(referenceDate);
  sunday.setDate(referenceDate.getDate() - dayOfWeek);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const currentSundayISO = getMostRecentSundayISO();

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'In Remembrance of Thy Suffering' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: 'I Stand All Amazed', type: 'musical-number' },
      { name: 'Brother Wilson', topic: 'Enduring to the End', type: 'speaker' }
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis',
    announcements: [
      'Ward temple night: Friday, May 8 at 6:30 PM',
      'Youth combined activity this Wednesday at 7:00 PM'
    ]
  },
  {
    id: 2,
    date: '2026-05-10',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Bishop Smith',
    openingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    openingPrayer: 'Brother Johnson',
    wardBusiness: [
      { description: 'Release of Sunday School Gospel Doctrine teachers with heartfelt thanks' },
      { description: 'Welcome of new ward members' }
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 181, title: 'Jesus of Nazareth, Savior and King' },
    speakers: [
      { name: 'Congregation', topic: 'Bearing of Fast and Testimony', type: 'speaker' }
    ],
    closingHymn: { number: 67, title: 'Glory to God on High' },
    closingPrayer: 'Sister Martinez',
    announcements: [
      'Fast offerings may be submitted to a member of the bishopric or online',
      'Relief Society ministering interviews scheduled this week'
    ]
  },
  {
    id: 3,
    date: '2026-05-17',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Clark',
    openingHymn: { number: 85, title: 'How Firm a Foundation' },
    openingPrayer: 'Brother Anderson',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Brother Thomas', topic: 'Service and Charity in the Community', type: 'speaker' },
      { name: 'Primary Children Ensemble', topic: 'I Am a Child of God', type: 'musical-number' },
      { name: 'Sister White', topic: 'Strengthening the Home Through Prayer', type: 'speaker' }
    ],
    closingHymn: { number: 252, title: 'Put Your Shoulder to the Wheel' },
    closingPrayer: 'Sister Lee',
    announcements: [
      'Bishopric youth discussions after the second-hour block',
      'Ward choir practice at 3:30 PM in the chapel'
    ]
  },
  {
    id: 4,
    date: '2026-05-24',
    meetingType: 'stake',
    presiding: 'Stake President Miller',
    conducting: 'President Miller',
    openingHymn: { number: 6, title: 'Redeemer of Israel' },
    openingPrayer: 'Brother King',
    wardBusiness: [{ description: 'Annual Stake Conference general session' }],
    stakeBusiness: true,
    sacramentHymn: { number: 196, title: 'Jesus, Once of Humble Birth' },
    speakers: [
      { name: 'Sister Carla Mendes', topic: 'Finding Joy in Keeping Covenants', type: 'speaker' },
      { name: 'Stake Combined Choir', topic: 'Come, Thou Fount of Every Blessing', type: 'musical-number' },
      { name: 'President Miller', topic: 'Building Zion in Our Stake', type: 'speaker' }
    ],
    closingHymn: { number: 89, title: 'The Lord Is My Light' },
    closingPrayer: 'Sister Young',
    announcements: [
      'Stake Conference general session convenes at the Stake Center at 10:00 AM',
      'No ward classes held today'
    ]
  },
  {
    id: 5,
    date: '2026-05-31',
    meetingType: 'general',
    presiding: 'First Presidency',
    conducting: 'General Authorities',
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'General Authority Seventy',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 175, title: 'O God, the Eternal Father' },
    speakers: [
      { name: 'General Conference Broadcast', topic: 'Messages from Living Prophets and Apostles', type: 'speaker' },
      { name: 'Tabernacle Choir', topic: 'Press Forward, Saints', type: 'musical-number' }
    ],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'General Officer',
    announcements: [
      'Members are invited to view the General Conference broadcast online or at the meetinghouse'
    ]
  },
  {
    id: 6,
    date: currentSundayISO === '2026-05-03' ? '2026-06-07' : currentSundayISO,
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    openingHymn: { number: 92, title: 'For the Beauty of the Earth' },
    openingPrayer: 'Sister Chissengue',
    wardBusiness: [{ description: 'Sustaining of newly called Youth Sunday School advisors' }],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Brother Mateus', topic: 'Walking in the Covenant Path', type: 'speaker' },
      { name: 'Ward Quartet', topic: 'Be Still, My Soul', type: 'musical-number' },
      { name: 'Sister Helena', topic: 'The Blessings of the Sacrament', type: 'speaker' }
    ],
    closingHymn: { number: 241, title: 'Count Your Many Blessings' },
    closingPrayer: 'Brother Mabunda',
    announcements: [
      'Current Sunday Sacrament Program — welcome visitors and ward members',
      'Building cleaning assignment: Group B on Saturday at 8:00 AM'
    ]
  }
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter(m => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find(m => m.id === id) ?? null;
}

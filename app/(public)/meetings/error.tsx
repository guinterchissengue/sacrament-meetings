'use client';

import MeetingsErrorView from '@/components/MeetingsErrorView';

export default function MeetingsError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <MeetingsErrorView {...props} />;
}

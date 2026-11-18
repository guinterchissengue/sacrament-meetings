import { getMeetingById } from '@/lib/meetings-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const MAX_INT4 = 2_147_483_647; // SERIAL limit: larger ids would make PostgreSQL throw

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id: rawId } = await context.params;

  // 400: not a plain positive integer (e.g. "abc", "1.5", "1e3") or out of range.
  if (!/^\d+$/.test(rawId) || Number(rawId) < 1 || Number(rawId) > MAX_INT4) {
    return Response.json(
      { error: `Invalid meeting id "${rawId}". ID must be a positive integer.` },
      { status: 400 }
    );
  }

  const parsedId = Number(rawId);

  try {
    const meeting = await getMeetingById(parsedId);

    // 404: a valid id that does not exist (e.g. 9999)
    if (!meeting) {
      return Response.json(
        { error: `No meeting found with id ${parsedId}.` },
        { status: 404 }
      );
    }

    return Response.json(meeting, { status: 200 });
  } catch (error) {
    console.error('GET /api/meetings/[id] failed:', error);
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

import { getMeetingById } from '@/lib/meetings-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  const { id: rawId } = await context.params;
  const parsedId = Number(rawId);

  if (!rawId || !Number.isInteger(parsedId) || parsedId <= 0) {
    return Response.json(
      { error: `Invalid meeting id "${rawId}". ID must be a positive integer.` },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(parsedId);

  if (!meeting) {
    return Response.json(
      { error: `No meeting found with id ${parsedId}.` },
      { status: 404 }
    );
  }

  return Response.json(meeting, { status: 200 });
}

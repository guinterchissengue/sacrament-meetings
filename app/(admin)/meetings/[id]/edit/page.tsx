export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-3xl font-bold">Edit Meeting — Coming in Week 04</h1>
      <p className="mt-2 text-gray-700">Meeting ID: {id}</p>
    </div>
  );
}

export async function POST(req) {
  await connectDB();
  const data = await req.json();
  await Email.create(data);
  return Response.json({ success: true });
}

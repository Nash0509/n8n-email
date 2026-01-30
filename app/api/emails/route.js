import { connectDB } from "../../../lib/mongodb";
import Email from "../../../models/Email";

export async function GET() {
  await connectDB();

  const emails = await Email.find().sort({ createdAt: -1 }).limit(100);

  console.log("-----------------------------");
  console.log(emails);

  return Response.json(emails);
}

import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    requireAdmin(req);
    const snapshot = await db.collection("alumni").get();
    const alumniList = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(alumniList);
  } catch (error) {
    sendError(res, error);
  }
}

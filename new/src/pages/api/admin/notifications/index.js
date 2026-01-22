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
    const snapshot = await db.collection("notifications").orderBy("created_at", "desc").limit(50).get();
    const notifications = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(notifications);
  } catch (error) {
    sendError(res, error);
  }
}

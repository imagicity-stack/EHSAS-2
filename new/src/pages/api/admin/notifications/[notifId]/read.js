import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    requireAdmin(req);
    const { notifId } = req.query;
    const snapshot = await db.collection("notifications").where("id", "==", notifId).limit(1).get();
    if (snapshot.empty) {
      res.status(404).json({ detail: "Notification not found" });
      return;
    }

    await snapshot.docs[0].ref.update({ is_read: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    sendError(res, error);
  }
}

import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  const { eventId } = req.query;

  if (req.method === "PUT") {
    try {
      requireAdmin(req);
      const data = req.body || {};
      const snapshot = await db.collection("events").where("id", "==", eventId).limit(1).get();
      if (snapshot.empty) {
        res.status(404).json({ detail: "Event not found" });
        return;
      }

      const doc = snapshot.docs[0];
      await doc.ref.update({
        title: data.title || "",
        description: data.description || "",
        event_type: data.event_type || "",
        date: data.date || "",
        time: data.time || "",
        location: data.location || "",
        image_url: data.image_url || "",
      });

      res.status(200).json({ message: "Event updated" });
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      requireAdmin(req);
      const snapshot = await db.collection("events").where("id", "==", eventId).limit(1).get();
      if (snapshot.empty) {
        res.status(404).json({ detail: "Event not found" });
        return;
      }
      await snapshot.docs[0].ref.delete();
      res.status(200).json({ message: "Event deleted" });
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  res.status(405).json({ detail: "Method not allowed" });
}

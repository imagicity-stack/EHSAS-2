import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { active_only = "true" } = req.query;
      let query = db.collection("events");
      if (active_only !== "false") {
        query = query.where("is_active", "==", true);
      }
      const snapshot = await query.get();
      const events = snapshot.docs.map((doc) => doc.data());
      res.status(200).json(events);
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  if (req.method === "POST") {
    try {
      requireAdmin(req);
      const data = req.body || {};
      const eventDoc = {
        id: uuidv4(),
        title: data.title || "",
        description: data.description || "",
        event_type: data.event_type || "",
        date: data.date || "",
        time: data.time || "",
        location: data.location || "",
        image_url: data.image_url || "",
        is_active: true,
        created_at: new Date().toISOString(),
      };
      await db.collection("events").add(eventDoc);
      res.status(200).json(eventDoc);
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  res.status(405).json({ detail: "Method not allowed" });
}

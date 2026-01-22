import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  const { spotlightId } = req.query;

  if (req.method === "PUT") {
    try {
      requireAdmin(req);
      const data = req.body || {};
      const snapshot = await db.collection("spotlight").where("id", "==", spotlightId).limit(1).get();
      if (snapshot.empty) {
        res.status(404).json({ detail: "Spotlight alumni not found" });
        return;
      }

      const doc = snapshot.docs[0];
      await doc.ref.update({
        name: data.name || "",
        batch: data.batch || "",
        profession: data.profession || "",
        achievement: data.achievement || "",
        category: data.category || "",
        image_url: data.image_url || "",
      });

      res.status(200).json({ message: "Spotlight alumni updated" });
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  if (req.method === "DELETE") {
    try {
      requireAdmin(req);
      const snapshot = await db.collection("spotlight").where("id", "==", spotlightId).limit(1).get();
      if (snapshot.empty) {
        res.status(404).json({ detail: "Spotlight alumni not found" });
        return;
      }
      await snapshot.docs[0].ref.delete();
      res.status(200).json({ message: "Spotlight alumni deleted" });
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  res.status(405).json({ detail: "Method not allowed" });
}

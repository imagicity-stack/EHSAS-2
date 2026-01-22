import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("spotlight").where("is_featured", "==", true).get();
      const spotlight = snapshot.docs.map((doc) => doc.data());
      res.status(200).json(spotlight);
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  if (req.method === "POST") {
    try {
      requireAdmin(req);
      const data = req.body || {};
      const spotlightDoc = {
        id: uuidv4(),
        name: data.name || "",
        batch: data.batch || "",
        profession: data.profession || "",
        achievement: data.achievement || "",
        category: data.category || "",
        image_url: data.image_url || "",
        is_featured: true,
      };
      await db.collection("spotlight").add(spotlightDoc);
      res.status(200).json(spotlightDoc);
    } catch (error) {
      sendError(res, error);
    }
    return;
  }

  res.status(405).json({ detail: "Method not allowed" });
}

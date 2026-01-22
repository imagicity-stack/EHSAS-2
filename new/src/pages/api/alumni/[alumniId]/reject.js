import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { sendRejectionEmail } from "@/lib/email";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    requireAdmin(req);
    const { alumniId } = req.query;

    const snapshot = await db.collection("alumni").where("id", "==", alumniId).limit(1).get();
    if (snapshot.empty) {
      res.status(404).json({ detail: "Alumni not found" });
      return;
    }

    const doc = snapshot.docs[0];
    const alumni = doc.data();

    await doc.ref.update({ status: "rejected" });
    await sendRejectionEmail(alumni);

    res.status(200).json({ message: "Alumni registration rejected" });
  } catch (error) {
    sendError(res, error);
  }
}

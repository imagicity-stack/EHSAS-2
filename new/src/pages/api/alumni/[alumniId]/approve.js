import { db } from "@/lib/firebaseAdmin";
import { requireAdmin } from "@/lib/auth";
import { generateEhsasId } from "@/lib/server-utils";
import { sendApprovalEmail } from "@/lib/email";
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

    const approvedSnapshot = await db
      .collection("alumni")
      .where("year_of_leaving", "==", alumni.year_of_leaving)
      .where("status", "==", "approved")
      .get();

    const ehsasId = generateEhsasId(alumni.year_of_leaving, approvedSnapshot.size + 1);

    await doc.ref.update({
      status: "approved",
      ehsas_id: ehsasId,
      approved_at: new Date().toISOString(),
    });

    const emailSent = await sendApprovalEmail(alumni, ehsasId);

    res.status(200).json({
      message: `Alumni approved with EHSAS ID: ${ehsasId}`,
      ehsas_id: ehsasId,
      email_sent: emailSent,
    });
  } catch (error) {
    sendError(res, error);
  }
}

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
    const approvedSnapshot = await db.collection("alumni").where("status", "==", "approved").get();
    const pendingSnapshot = await db.collection("alumni").where("status", "==", "pending").get();
    const eventsSnapshot = await db.collection("events").where("is_active", "==", true).get();

    const batchMap = new Map();
    approvedSnapshot.docs.forEach((doc) => {
      const alumni = doc.data();
      const batch = alumni.year_of_leaving;
      batchMap.set(batch, (batchMap.get(batch) || 0) + 1);
    });

    const batchDistribution = Array.from(batchMap.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 10)
      .map(([batch, count]) => ({ batch, count }));

    res.status(200).json({
      total_alumni: approvedSnapshot.size,
      pending_registrations: pendingSnapshot.size,
      total_events: eventsSnapshot.size,
      batch_distribution: batchDistribution,
    });
  } catch (error) {
    sendError(res, error);
  }
}

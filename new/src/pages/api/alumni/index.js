import { db } from "@/lib/firebaseAdmin";
import { sendError } from "@/lib/api-helpers";

const normalize = (value) => (value || "").toString().toLowerCase();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    const { batch, profession, city, status = "approved" } = req.query;
    let query = db.collection("alumni");

    if (status) {
      query = query.where("status", "==", status);
    }

    if (batch) {
      query = query.where("year_of_leaving", "==", Number(batch));
    }

    const snapshot = await query.get();
    let alumniList = snapshot.docs.map((doc) => doc.data());

    if (profession) {
      const professionTerm = normalize(profession);
      alumniList = alumniList.filter((item) => normalize(item.profession).includes(professionTerm));
    }

    if (city) {
      const cityTerm = normalize(city);
      alumniList = alumniList.filter((item) => normalize(item.city).includes(cityTerm));
    }

    const result = alumniList.map((item) => ({
      ...item,
      approved_at: item.approved_at || null,
      created_at: item.created_at || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

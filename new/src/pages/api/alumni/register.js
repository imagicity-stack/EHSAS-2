import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebaseAdmin";
import { sendRegistrationNotification } from "@/lib/email";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    const data = req.body || {};
    if (!data.email) {
      res.status(400).json({ detail: "Email is required" });
      return;
    }

    const existing = await db.collection("alumni").where("email", "==", data.email).limit(1).get();
    if (!existing.empty) {
      res.status(400).json({ detail: "Email already registered" });
      return;
    }

    const alumniId = uuidv4();
    const alumniDoc = {
      id: alumniId,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      email: data.email,
      mobile: data.mobile || "",
      year_of_joining: Number(data.year_of_joining),
      year_of_leaving: Number(data.year_of_leaving),
      class_of_joining: data.class_of_joining || "",
      last_class_studied: data.last_class_studied || "",
      last_house: data.last_house || "",
      full_address: data.full_address || "",
      city: data.city || "",
      pincode: data.pincode || "",
      state: data.state || "",
      country: data.country || "",
      profession: data.profession || "",
      organization: data.organization || "",
      status: "pending",
      ehsas_id: null,
      created_at: new Date().toISOString(),
      approved_at: null,
    };

    await db.collection("alumni").add(alumniDoc);

    const notificationDoc = {
      id: uuidv4(),
      type: "registration",
      title: "New Alumni Registration",
      message: `${data.first_name} ${data.last_name} (${data.email}) has registered from batch ${data.year_of_leaving}`,
      alumni_id: alumniId,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    await db.collection("notifications").add(notificationDoc);

    await sendRegistrationNotification(alumniDoc);

    res.status(201).json({
      message: "Registration submitted successfully. You will receive confirmation once approved.",
      id: alumniId,
    });
  } catch (error) {
    sendError(res, error);
  }
}

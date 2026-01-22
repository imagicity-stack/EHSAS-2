import { db } from "@/lib/firebaseAdmin";
import { createJwtToken } from "@/lib/auth";
import { ensureAdminAccount } from "@/lib/admin";
import { verifyPassword } from "@/lib/server-utils";
import { sendError } from "@/lib/api-helpers";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    await ensureAdminAccount();
    const { email, password } = req.body || {};

    if (!email || !password) {
      res.status(400).json({ detail: "Email and password are required" });
      return;
    }

    const adminSnapshot = await db.collection("admins").where("email", "==", email).limit(1).get();
    if (adminSnapshot.empty) {
      res.status(401).json({ detail: "Invalid credentials" });
      return;
    }

    const admin = adminSnapshot.docs[0].data();
    if (!verifyPassword(password, admin.password)) {
      res.status(401).json({ detail: "Invalid credentials" });
      return;
    }

    const token = createJwtToken({ id: admin.id, email: admin.email, role: "admin" });
    res.status(200).json({
      id: admin.id,
      email: admin.email,
      role: "admin",
      token,
    });
  } catch (error) {
    sendError(res, error);
  }
}

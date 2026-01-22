import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebaseAdmin";
import { hashPassword } from "@/lib/server-utils";

const ADMIN_EMAIL = "deweshkk@gmail.com";
const ADMIN_PASSWORD = "Dew@2002k";

export const ensureAdminAccount = async () => {
  const adminsRef = db.collection("admins");
  const snapshot = await adminsRef.where("email", "==", ADMIN_EMAIL).limit(1).get();
  if (!snapshot.empty) {
    return snapshot.docs[0].data();
  }

  const adminDoc = {
    id: uuidv4(),
    email: ADMIN_EMAIL,
    password: hashPassword(ADMIN_PASSWORD),
    role: "admin",
    created_at: new Date().toISOString(),
  };

  await adminsRef.add(adminDoc);
  return adminDoc;
};

const db = require("../utils/dbconnection");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, code } = req.body;

  try {
    const docRef = db.collection("verificationCodes").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "No code found for this email" });
    }

    const data = doc.data();

    // Check if code matches
    if (data.code !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect code" });
    }

    // Check if code expired
    if (data.expiresAt.toDate() < new Date()) {
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    // Optionally, delete the code after successful verification
    await docRef.delete();

    return res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

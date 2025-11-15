const Mail = require("../Mail/Mail");
const db = require("../utils/dbconnection");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, code } = req.body;

  try {
    const docRef = db.collection("verificationCodes").doc(email);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Code not found" });
    }

    const data = docSnap.data();

    if (data.code.toString() !== code.toString()) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // Update the status to verified instead of deleting
    await docRef.update({
      status: "verified", // can be an enum if you like
      verifiedAt: new Date(),
    });

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

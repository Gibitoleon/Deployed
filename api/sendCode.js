const Mail = require("../Mail/Mail");
const generateCode = require("../utils/otp");
const db = require("../utils/dbconnection"); // This already has admin initialized

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;

  // Validate email
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  // Generate a verification code
  const verificationcode = generateCode();

  try {
    // Save the code to the firestore db associated with the user email
    await db
      .collection("verificationCodes")
      .doc(email)
      .set({
        status: "pending",
        code: verificationcode,
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 min
      });

    // Send the verification code to the user's email
    await Mail.sendMail(
      email,
      "Verification Code",
      verificationcode,
      "verification"
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Firestore error:", err);

    // Handle specific Firestore errors
    if (err.code === 5) {
      res.status(404).json({
        success: false,
        message: "Database resource not found. Check your Firestore setup.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

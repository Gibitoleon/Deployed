const Mail = require("../Mail/Mail");
const generateCode = require("../utils/otp");
const db = require("../utils/dbconnection");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;
  // Generate a verification code
  const verificationcode = generateCode();

  // Save the code to  the firestore db associated with the user email
  await db
    .collection("verificationCodes")
    .doc(email)
    .set({
      code: verificationcode,
      createdAt: admin.firestore.Timestamp.now(),
      expiresAt: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 5 * 60 * 1000)
      ), // expires in 5 min
    });

  //Send the verifcation code to the user's email
  try {
    await Mail.sendMail(
      email,
      "Verification Code",
      verificationcode,
      "verification"
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

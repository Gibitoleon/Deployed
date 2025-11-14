const Mail = require("../Mail/Mail");

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { email, verificationcode } = req.body;

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

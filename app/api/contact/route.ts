import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "booking@inftour.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required" },
        { status: 400 }
      );
    }

    // TODO: Integrate with your email provider (Resend, Nodemailer, etc.)
    // Example with Resend: await resend.emails.send({ from: '...', to: TO_EMAIL, subject: '...', text: message, replyTo: email });
    console.log("Contact form submission:", { to: TO_EMAIL, replyTo: email, message: message.slice(0, 100) });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact form error:", e);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

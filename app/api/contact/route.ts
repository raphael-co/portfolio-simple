import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function escapeHtml(input: string = "") {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderContactEmail({
  name,
  email,
  message,
  ip,
  ua,
}: {
  name: string;
  email: string;
  message: string;
  ip?: string;
  ua?: string;
}) {
  const escName = escapeHtml(name);
  const escEmail = escapeHtml(email);
  const escMessage = escapeHtml(message);
  const when = new Date().toLocaleString("fr-FR", { hour12: false });
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
    "Re: Votre message — Portfolio"
  )}&body=${encodeURIComponent(`Bonjour ${name},\n\n`)}`;

  return `
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    Nouveau message de ${escName} via le portfolio
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f6f9fc;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e6e8ec;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:#111827;padding:18px 20px;">
              <h1 style="margin:0;color:#ffffff;font-family:Inter,Arial,sans-serif;font-size:18px;line-height:1.3;">
                📬 Nouveau message — Portfolio
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 22px 6px 22px;font-family:Inter,Arial,sans-serif;color:#111827;">
              <p style="margin:0 0 10px 0;font-size:15px;opacity:.9;">
                Vous avez reçu un message depuis le formulaire de contact.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin:12px 0 16px 0;">
                <tr>
                  <td style="padding:6px 0;width:120px;color:#6b7280;font-size:13px;">De</td>
                  <td style="padding:6px 0;font-size:14px;">
                    <strong>${escName}</strong> &lt;${escEmail}&gt;
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;width:120px;color:#6b7280;font-size:13px;">Reçu</td>
                  <td style="padding:6px 0;font-size:14px;">${when}</td>
                </tr>
                ${
                  ip
                    ? `<tr>
                        <td style="padding:6px 0;width:120px;color:#6b7280;font-size:13px;">IP</td>
                        <td style="padding:6px 0;font-size:14px;">${escapeHtml(ip)}</td>
                       </tr>`
                    : ""
                }
                ${
                  ua
                    ? `<tr>
                        <td style="padding:6px 0;width:120px;color:#6b7280;font-size:13px;">Agent</td>
                        <td style="padding:6px 0;font-size:14px;">${escapeHtml(ua)}</td>
                       </tr>`
                    : ""
                }
              </table>

              <div style="border-left:3px solid #4F46E5;background:#f3f4f6;border-radius:8px;padding:14px 16px;margin:6px 0 14px 0;">
                <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;color:#111827;">
                  ${escMessage}
                </div>
              </div>

              <p style="margin:0 0 18px 0;">
                <a href="${replyHref}"
                   style="display:inline-block;background:#4F46E5;color:#ffffff;text-decoration:none;font-size:14px;padding:10px 14px;border-radius:10px;">
                  Répondre à ${escName}
                </a>
              </p>

              <p style="margin:0;color:#6b7280;font-size:12px;">
                — Envoyé automatiquement depuis raphael-comandon.dev (formulaire de contact)
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:12px 20px 18px 20px;border-top:1px solid #e6e8ec;background:#fafbfc;">
              <p style="margin:0;color:#6b7280;font-family:Inter,Arial,sans-serif;font-size:12px;">
                Si ce message vous semble suspect, ignorez-le ou répondez pour demander plus d’informations.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}


export async function POST(req: NextRequest) {
  try {
    const { name, email, message, website } = await req.json();

    if (website) return NextResponse.json({ ok: true });

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      (req as any).ip ||
      undefined;
    const ua = req.headers.get("user-agent") || undefined;

    const host =
      process.env.SMTP_HOST || process.env.MAIL_SERVER || "smtp.gmail.com";
    const portRaw = process.env.SMTP_PORT || process.env.Port;
    const port = Number(portRaw ?? 587);
    const secureEnv =
      (process.env.SMTP_SECURE || process.env.Secure || "")
        .toString()
        .toLowerCase() || undefined;
    const secure = secureEnv ? secureEnv === "true" : port === 465;

    const user = process.env.SMTP_USER || process.env.MAIL_FROM || email;
    const pass = process.env.SMTP_PASS || process.env.MAIL_PASSWORD;

    const from = process.env.SMTP_FROM || user || email;
    const to = process.env.CONTACT_TO || "comandonraphael@gmail.com";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined,
    });

    if (process.env.NODE_ENV !== "production") {
      try {
        await transporter.verify();
      } catch (e) {
        console.warn("SMTP verify failed:", e);
      }
    }

    const textPlain =
      `De: ${name} <${email}>\n` +
      (ip ? `IP: ${ip}\n` : "") +
      (ua ? `UA: ${ua}\n` : "") +
      `Reçu: ${new Date().toISOString()}\n\n` +
      `${message}`;

    await transporter.sendMail({
      from: `"Portfolio" <${from}>`,
      to,
      replyTo: email,
      subject: `📬 Nouveau message — ${name}`,
      text: textPlain,
      html: renderContactEmail({ name, email, message, ip, ua }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

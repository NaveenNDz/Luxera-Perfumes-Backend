import nodemailer from "nodemailer";

export interface OrderItemDetail {
  name: string;
  brand?: string;
  volume?: string;
  quantity: number;
  price: number;
}

export interface SendOrderEmailPayload {
  orderId: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  paymentMethod?: string;
  status: string;
  total: number;
  flacon?: string;
  items?: OrderItemDetail[];
  date?: string;
}

const getMailTransporter = async () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    if (process.env.EMAIL_HOST) {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    }

    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailUser.trim(),
        pass: emailPass.replace(/\s+/g, ""),
      },
    });
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log(
      "[LUXERA Email] No EMAIL_USER/EMAIL_PASS in .env. Using Ethereal development mailer:",
      testAccount.user
    );
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn("[LUXERA Email] Could not initialize test mailer:", err);
    return null;
  }
};

export const sendOrderConfirmationEmail = async (
  payload: SendOrderEmailPayload
): Promise<{ success: boolean; messageId?: string; previewUrl?: string | false; error?: string }> => {
  try {
    if (!payload.email || !payload.email.includes("@")) {
      console.warn("[LUXERA Email] Invalid recipient email address:", payload.email);
      return { success: false, error: "Invalid recipient email" };
    }

    const transporter = await getMailTransporter();
    if (!transporter) {
      console.log(
        `[LUXERA Email Mock] Order confirmation simulated for ${payload.email} (Order #${payload.orderId})`
      );
      return { success: true, previewUrl: false };
    }

    const orderRef = payload.orderId ? payload.orderId.slice(-6).toUpperCase() : "LUXERA";
    const formattedTotal = (Number(payload.total) || 0).toLocaleString();
    const customerName = payload.customer || "Valued Fragrance Connoisseur";
    const address = payload.address || "Sri Lanka (Island-wide)";
    const phone = payload.phone || "Not provided";
    const status = payload.status || "Pending";
    const paymentMethod = payload.paymentMethod || "Cash on delivery";
    const date =
      payload.date ||
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    let itemsHtml = "";
    let itemsText = "";

    if (payload.items && payload.items.length > 0) {
      itemsHtml = payload.items
        .map(
          (item) => `
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #f4f4f5; font-size: 13px;">
                <strong>${item.name}</strong>
                ${item.brand ? `<span style="color: #a1a1aa; font-size: 11px; display: block;">${item.brand}${item.volume ? ` · ${item.volume}` : ""}</span>` : ""}
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #d4d4d8; font-size: 13px; text-align: center;">
                ${item.quantity}
              </td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #ffffff; font-size: 13px; text-align: right; font-weight: 600;">
                Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}
              </td>
            </tr>
          `
        )
        .join("");

      itemsText = payload.items
        .map(
          (item) =>
            `- ${item.name} ${item.volume || ""} x${item.quantity} = Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}`
        )
        .join("\n");
    } else {
      const summary = payload.flacon || "Original Fragrance Flacon";
      itemsHtml = `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #f4f4f5; font-size: 13px;">
            ${summary}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #d4d4d8; font-size: 13px; text-align: center;">
            1
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #27272e; color: #ffffff; font-size: 13px; text-align: right; font-weight: 600;">
            Rs. ${formattedTotal}
          </td>
        </tr>
      `;
      itemsText = `- ${summary} = Rs. ${formattedTotal}`;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - LUXERA</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #08080c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #08080c; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #101017; border: 1px solid #22222d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(180deg, #181824 0%, #101017 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #2a2a38;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; color: #d4af37; font-weight: 700; text-transform: uppercase;">
                      L U X E R A
                    </h1>
                    <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 2px; color: #a1a1aa; text-transform: uppercase;">
                      Fine Fragrance House · Colombo
                    </p>
                  </td>
                </tr>

                <!-- Order Success Badge -->
                <tr>
                  <td style="padding: 28px 24px 16px; text-align: center;">
                    <div style="display: inline-block; background-color: rgba(212, 175, 55, 0.12); border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 20px; padding: 6px 16px; color: #e2c785; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Order Status: ${status}
                    </div>
                    <h2 style="margin: 16px 0 6px; color: #ffffff; font-size: 20px; font-weight: 600;">
                      Order Confirmation
                    </h2>
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5;">
                      Dear <strong style="color: #ffffff;">${customerName}</strong>, thank you for choosing LUXERA. We have received your order (#${orderRef}) and it has been queued for dispatch.
                    </p>
                  </td>
                </tr>

                <!-- Order Details Card -->
                <tr>
                  <td style="padding: 0 24px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161622; border: 1px solid #272738; border-radius: 12px; padding: 16px;">
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Order Reference:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #ffffff; font-weight: 600; text-align: right;">#${orderRef}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Order Date:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #ffffff; text-align: right;">${date}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Recipient Name:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #ffffff; font-weight: 600; text-align: right;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Contact Phone:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #ffffff; text-align: right;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Delivery Address:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #ffffff; text-align: right; font-weight: 500;">${address}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 12px; font-size: 12px; color: #a1a1aa;">Payment Method:</td>
                        <td style="padding: 6px 12px; font-size: 12px; color: #34d399; font-weight: 600; text-align: right;">${paymentMethod}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Purchased Fragrances Table -->
                <tr>
                  <td style="padding: 0 24px 20px;">
                    <h3 style="margin: 0 0 10px; font-size: 13px; color: #e2c785; text-transform: uppercase; letter-spacing: 1px;">
                      Order Items
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #161622; border: 1px solid #272738; border-radius: 12px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #1a1a28;">
                          <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 600;">Fragrance</th>
                          <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 600;">Qty</th>
                          <th style="padding: 10px 12px; text-align: right; font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: 600;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                        <tr>
                          <td colspan="2" style="padding: 14px 12px; text-align: right; font-size: 13px; color: #a1a1aa; font-weight: 600; border-top: 1px solid #272738;">
                            Final Total (Cash on Delivery):
                          </td>
                          <td style="padding: 14px 12px; text-align: right; font-size: 16px; color: #d4af37; font-weight: 700; border-top: 1px solid #272738;">
                            Rs. ${formattedTotal}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Notice / Logistics -->
                <tr>
                  <td style="padding: 0 24px 24px;">
                    <div style="background-color: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 10px; padding: 14px 16px; font-size: 12px; line-height: 1.5; color: #fef08a;">
                      <strong>Island-Wide Courier Delivery (1–3 Days):</strong> Please keep the exact cash amount ready upon delivery by Prompt / Koombiyo courier. Inspect your sealed batch code box prior to hand-off.
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0a0a0f; padding: 20px 24px; text-align: center; border-top: 1px solid #1f1f2a;">
                    <p style="margin: 0; font-size: 11px; color: #71717a;">
                      LUXERA Fine Fragrance House · Colombo 03, Sri Lanka
                    </p>
                    <p style="margin: 4px 0 0; font-size: 10px; color: #52525b;">
                      100% Original Sealed Batches · All Rights Reserved
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent = `
LUXERA FINE FRAGRANCE HOUSE - ORDER CONFIRMATION
===============================================
Order Reference: #${orderRef}
Order Status: ${status}
Order Date: ${date}

Dear ${customerName},

Thank you for your order at LUXERA. Your order has been placed in Pending status awaiting courier dispatch.

ORDER DETAILS:
- Recipient Name: ${customerName}
- Delivery Address: ${address}
- Contact Phone: ${phone}
- Payment Method: ${paymentMethod}

ORDER ITEMS:
${itemsText}

FINAL PAYABLE TOTAL: Rs. ${formattedTotal}
(Cash on delivery)

Our courier partner will deliver your sealed flacons within 1-3 business days.

Warm regards,
LUXERA Fine Fragrance House
Colombo, Sri Lanka
    `.trim();

    const senderEmail = process.env.EMAIL_USER || process.env.EMAIL_FROM || "orders@luxera.lk";

    const mailOptions = {
      from: `"LUXERA Fragrances" <${senderEmail}>`,
      to: payload.email,
      subject: `Order Confirmation #${orderRef} - LUXERA Fine Fragrance House`,
      text: textContent,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info);

    //console.log(`[LUXERA Email] Order confirmation dispatched to ${payload.email} (Message ID: ${info.messageId})`);
    if (previewUrl) {
      //console.log(`[LUXERA Email Preview] Ethereal preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || false,
    };
  } catch (error: any) {
    console.error("[LUXERA Email Error] Failed to send order confirmation email:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Email dispatch failed",
    };
  }
};

// Vercel Serverless Function — /api/send-email
// Called by the React app to send transactional emails via Resend
// The API key never touches the browser

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const { type, to, data } = req.body;

  if (!type || !to) {
    return res.status(400).json({ error: 'Missing required fields: type, to' });
  }

  let subject, html;

  // ── Email templates ──────────────────────────────────────────────────────────

  const baseStyle = `
    font-family: 'DM Sans', Arial, sans-serif;
    max-width: 520px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  `;

  const header = `
    <div style="background: #0f172a; padding: 24px 32px; text-align: center;">
      <div style="font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.5px;">
        Twirl<span style="color: #0d9488;">Power</span>
      </div>
      <div style="font-size: 11px; color: #64748b; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px;">
        Track · Compete · Advance
      </div>
    </div>
  `;

  const footer = `
    <div style="background: #f8fafc; padding: 16px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        Questions? Email us at <a href="mailto:hello@twirlpower.com" style="color: #0d9488;">hello@twirlpower.com</a>
      </p>
    </div>
  `;

  const appUrl = 'https://app.twirlpower.com';

  if (type === 'coach_link_request') {
    // Coach invited an athlete — notify the family
    const { coachName, coachStudio, coachOrgs, athleteName } = data;
    subject = `${coachName} wants to connect with ${athleteName} on TwirlPower`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            Coach connection request
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            <strong>${coachName}</strong>${coachStudio ? ` from ${coachStudio}` : ''} has sent a connection request for <strong>${athleteName}</strong> on TwirlPower.
          </p>
          ${coachOrgs && coachOrgs.length > 0 ? `
            <div style="background: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #475569;">
              <strong>Organizations:</strong> ${coachOrgs.join(', ')}
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 24px;">
            Once accepted, ${coachName} will be able to view ${athleteName}'s classification levels and send competition invites.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
              Review request in TwirlPower
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            You can accept or decline this request from your dashboard notifications.
          </p>
        </div>
        ${footer}
      </div>
    `;
  }

  else if (type === 'coach_link_accepted') {
    // Family accepted coach link — notify the coach
    const { familyName, athleteName, accepted } = data;
    subject = accepted
      ? `${familyName} accepted your connection request for ${athleteName}`
      : `${familyName} declined your connection request for ${athleteName}`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            Connection request ${accepted ? 'accepted' : 'declined'}
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            ${accepted
              ? `<strong>${familyName}</strong> has accepted your connection request for <strong>${athleteName}</strong>. You can now view their classification levels and send competition invites.`
              : `<strong>${familyName}</strong> has declined your connection request for <strong>${athleteName}</strong>.`
            }
          </p>
          ${accepted ? `
            <div style="text-align: center; margin: 28px 0;">
              <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
                View in TwirlPower
              </a>
            </div>
          ` : ''}
        </div>
        ${footer}
      </div>
    `;
  }

  else if (type === 'competition_invite') {
    // Coach created a competition invite — notify the family
    const { coachName, athleteName, compName, compDate, compLocation, compOrg } = data;
    subject = `${coachName} invited ${athleteName} to ${compName}`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            Competition invite for ${athleteName}
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            <strong>${coachName}</strong> has invited <strong>${athleteName}</strong> to compete at:
          </p>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${compName}</div>
            ${compDate ? `<div style="font-size: 14px; color: #475569; margin-bottom: 4px;">📅 ${compDate}</div>` : ''}
            ${compLocation ? `<div style="font-size: 14px; color: #475569; margin-bottom: 4px;">📍 ${compLocation}</div>` : ''}
            ${compOrg ? `<div style="font-size: 13px; color: #0d9488; font-weight: 600; margin-top: 8px;">${compOrg}</div>` : ''}
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
              Accept or Decline in TwirlPower
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            You can accept or decline this invite from your dashboard notifications.
          </p>
        </div>
        ${footer}
      </div>
    `;
  }

  else if (type === 'family_invite') {
    // Family account added a guardian — notify them by email
    const { inviterName, guardianName, relationship, athleteNames } = data;
    subject = `You've been added to a TwirlPower family account`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            You've been added to a family account
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            <strong>${inviterName}</strong> has added you as a <strong>${relationship}</strong> on their TwirlPower account${athleteNames ? ` for <strong>${athleteNames}</strong>` : ''}.
          </p>
          <p style="font-size: 14px; color: #475569; line-height: 1.7; margin: 0 0 24px;">
            TwirlPower tracks baton twirling classifications, competition history, and advancement progress across USTA, NBTA, TU, and DMA.
          </p>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; font-size: 13px; color: #475569;">
            To access the account, sign up at TwirlPower using this email address. The family's data will be visible once you're signed in.
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
              Open TwirlPower
            </a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            If you weren't expecting this, you can ignore this email.
          </p>
        </div>
        ${footer}
      </div>
    `;
  }

  else {
    return res.status(400).json({ error: `Unknown email type: ${type}` });
  }

  // ── Send via Resend ──────────────────────────────────────────────────────────

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TwirlPower <hello@twirlpower.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend error:', result);
      return res.status(response.status).json({ error: result.message || 'Email send failed' });
    }

    return res.status(200).json({ success: true, id: result.id });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

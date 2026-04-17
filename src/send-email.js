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
    const { coachName, coachClub, coachOrgs, athleteName } = data;
    subject = `${coachName} wants to connect with ${athleteName} on TwirlPower`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            Coach connection request
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            <strong>${coachName}</strong>${coachClub ? ` from ${coachClub}` : ''} has sent a connection request for <strong>${athleteName}</strong> on TwirlPower.
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

  else if (type === 'bug_report') {
    const { page, description, expected, severity, user_email, user_role, user_agent, appUrl } = data;
    const severityLabel = { bug: '🐛 Bug', ux: '😤 UX Issue', missing: '💡 Missing Feature', other: '💬 Other' }[severity] || severity;
    subject = `[TwirlPower Beta] ${severityLabel} — ${page}`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 28px 32px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 16px;">Bug Report</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
            ${[['Severity', severityLabel], ['Page', page], ['User', user_email], ['Role', user_role]].map(([k,v]) => `
              <tr>
                <td style="padding: 6px 12px; background: #f1f5f9; font-weight: 600; color: #64748b; width: 120px; border: 1px solid #e2e8f0;">${k}</td>
                <td style="padding: 6px 12px; border: 1px solid #e2e8f0; color: #0f172a;">${v || '—'}</td>
              </tr>`).join('')}
          </table>
          <div style="margin-bottom: 16px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 13px;">WHAT HAPPENED</div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; color: #475569; white-space: pre-line;">${description}</div>
          </div>
          ${expected ? `<div style="margin-bottom: 16px;">
            <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 13px;">EXPECTED</div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; color: #475569; white-space: pre-line;">${expected}</div>
          </div>` : ''}
          <div style="font-size: 11px; color: #94a3b8; margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            URL: ${appUrl || '—'}<br/>
            ${user_agent || ''}
          </div>
        </div>
      </div>
    `;
  }

  else if (type === 'beta_feedback') {
    const { rating, working, frustrating, missing, user_email, user_role } = data;
    const stars = '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    subject = `[TwirlPower Beta] Feedback — ${stars} from ${user_email}`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 28px 32px;">
          <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px;">Beta Feedback</h2>
          <div style="font-size: 24px; margin-bottom: 16px;">${stars}</div>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 20px;">From: ${user_email} (${user_role})</div>
          ${[['What\'s working well', working], ['What\'s frustrating', frustrating], ['What\'s missing', missing]].filter(([,v]) => v).map(([k,v]) => `
            <div style="margin-bottom: 16px;">
              <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 13px;">${k.toUpperCase()}</div>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; color: #475569; white-space: pre-line;">${v}</div>
            </div>`).join('')}
        </div>
      </div>
    `;
  }

  else if (type === 'advancement_alert') {
    const { athleteName, orgId, orgName, event, currentLevel, nextLevel, winsCount, winsNeeded } = data;
    subject = `${athleteName} is ready to advance in ${orgId} ${event}!`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            🏆 Advancement milestone reached!
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            <strong>${athleteName}</strong> has reached the win threshold to advance in <strong>${orgId} ${event}</strong>.
          </p>
          <div style="background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Current Level</div>
                <div style="font-size: 20px; font-weight: 700; color: #0f172a;">${currentLevel}</div>
              </div>
              <div style="font-size: 24px; color: #0d9488; padding: 0 16px;">→</div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Next Level</div>
                <div style="font-size: 20px; font-weight: 700; color: #0d9488;">${nextLevel}</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 12px; font-size: 13px; color: #64748b;">
              ${orgId} · ${event} · ${winsCount} of ${winsNeeded} wins
            </div>
          </div>
          <p style="font-size: 13px; color: #475569; line-height: 1.7; margin: 0 0 24px;">
            Remember to verify the advancement with <strong>${orgName}</strong> according to their official rulebook before registering at the new level. TwirlPower tracks wins to help you stay informed, but official classifications are determined by each organization.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
              View Progress in TwirlPower
            </a>
          </div>
        </div>
        ${footer}
      </div>
    `;
  }

  else if (type === 'advancement_alert_coach') {
    const { athleteName, familyName, orgId, orgName, event, currentLevel, nextLevel } = data;
    subject = `${athleteName} is ready to advance — ${orgId} ${event}`;
    html = `
      <div style="${baseStyle}">
        ${header}
        <div style="padding: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 12px;">
            🏆 Athlete advancement milestone
          </h2>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin: 0 0 20px;">
            Your athlete <strong>${athleteName}</strong> (${familyName}) has reached the win threshold to advance in <strong>${orgId} ${event}</strong> from <strong>${currentLevel}</strong> to <strong>${nextLevel}</strong>.
          </p>
          <p style="font-size: 13px; color: #475569; line-height: 1.7; margin: 0 0 24px;">
            The family has been notified. You can view their full classification progress in TwirlPower.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${appUrl}" style="display: inline-block; background: #0d9488; color: white; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px; text-decoration: none;">
              View in TwirlPower
            </a>
          </div>
        </div>
        ${footer}
      </div>
    `;
  }

  else if (type === 'club_unclaimed_notify') {
    const { coachName, clubName, city, state } = data;
    subject = `A twirler created a club listing for ${clubName} on TwirlPower`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">Your club is on TwirlPower</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Hi ${coachName || "Coach"}, a twirler just created a club listing for <strong>${clubName}</strong>${city || state ? ` in ${[city,state].filter(Boolean).join(", ")}` : ""} on TwirlPower.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        TwirlPower is a baton twirling classification tracking app. You can claim this club listing to manage your club profile, approve twirler memberships, and send competition invites.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">
          Claim Your Club on TwirlPower
        </a>
      </div>
      <p style="font-size:12px;color:#94a3b8;">Sign up as a coach, then go to My Club to claim this listing. Admin approval is required.</p>
    </div>${footer}</div>`;
  }

  else if (type === 'club_claim_request') {
    const { coachName, coachEmail, clubName, city, state, message, type: claimType } = data;
    subject = `[TwirlPower Admin] Club claim request — ${clubName}`;
    html = `<div style="${baseStyle}">${header}<div style="padding:28px 32px;">
      <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 16px;">Club Claim Request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:20px;">
        ${[["Club", clubName], ["Location", [city,state].filter(Boolean).join(", ") || "—"], ["Coach", coachName], ["Email", coachEmail], ["Type", claimType === "new" ? "New club created by coach" : "Claiming existing club"]].map(([k,v]) =>
          `<tr><td style="padding:6px 12px;background:#f1f5f9;font-weight:600;color:#64748b;width:100px;border:1px solid #e2e8f0;">${k}</td><td style="padding:6px 12px;border:1px solid #e2e8f0;color:#0f172a;">${v||"—"}</td></tr>`
        ).join("")}
      </table>
      ${message ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-size:13px;color:#475569;margin-bottom:16px;white-space:pre-line;">${message}</div>` : ""}
      <p style="font-size:13px;color:#64748b;">Review and approve or deny this request in the Admin panel.</p>
      <div style="text-align:center;margin:20px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">Open Admin Panel</a>
      </div>
    </div>${footer}</div>`;
  }

  else if (type === 'club_claim_approved') {
    const { coachName, clubName } = data;
    subject = `Your club claim has been approved — ${clubName}`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">🎉 Club claim approved!</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Hi ${coachName}, your claim for <strong>${clubName}</strong> has been approved. You can now manage your club profile, approve twirler memberships, and invite new twirlers.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">Manage Your Club</a>
      </div>
    </div>${footer}</div>`;
  }

  else if (type === 'club_claim_denied') {
    const { coachName, clubName } = data;
    subject = `Club claim update — ${clubName}`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">Club claim update</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Hi ${coachName}, we were unable to approve your claim for <strong>${clubName}</strong> at this time. If you believe this is an error or would like to provide additional documentation, please contact us at ${CONTACT_EMAIL}.
      </p>
    </div>${footer}</div>`;
  }

  else if (type === 'club_join_request') {
    const { coachName, twirlerName, clubName } = data;
    subject = `${twirlerName} wants to join ${clubName} on TwirlPower`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">New club membership request</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        Hi ${coachName}, <strong>${twirlerName}</strong> has selected <strong>${clubName}</strong> as their club on TwirlPower and is requesting to join.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">Review in TwirlPower</a>
      </div>
    </div>${footer}</div>`;
  }

  else if (type === 'club_invite_external') {
    const { twirlerName, clubName, coachName, city, state } = data;
    subject = `You're invited to join ${clubName} on TwirlPower`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">You're invited to TwirlPower!</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        <strong>${coachName}</strong> from <strong>${clubName}</strong>${city||state ? ` in ${[city,state].filter(Boolean).join(", ")}` : ""} has invited ${twirlerName ? `<strong>${twirlerName}</strong>` : "your twirler"} to join their club on TwirlPower.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        TwirlPower tracks baton twirling classifications and competition history across USTA, NBTA, TU, and DMA — all in one place.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">Join TwirlPower Free</a>
      </div>
    </div>${footer}</div>`;
  }

  else if (type === 'club_invite_coach') {
    const { coachName, inviterName, clubName, city, state } = data;
    subject = `You're invited to join ${clubName} on TwirlPower`;
    html = `<div style="${baseStyle}">${header}<div style="padding:32px;">
      <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">Coach invitation</h2>
      <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 20px;">
        <strong>${inviterName}</strong> has invited ${coachName ? `<strong>${coachName}</strong>` : "you"} to join <strong>${clubName}</strong>${city||state ? ` in ${[city,state].filter(Boolean).join(", ")}` : ""} as a coach on TwirlPower.
      </p>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">
        Sign in to TwirlPower as a coach and go to My Clubs to accept this invitation.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}" style="display:inline-block;background:#0d9488;color:white;font-size:15px;font-weight:600;padding:14px 32px;border-radius:8px;text-decoration:none;">Open TwirlPower</a>
      </div>
    </div>${footer}</div>`;
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

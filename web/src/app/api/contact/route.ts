/**
 * Contact API Route
 * Validates payload, checks honeypot, and sends email via Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  services: string[];
  reason: string;
  timeline?: string;
  honeypot?: string;
};

function validate(payload: ContactPayload) {
  const errors: Record<string, string> = {};
  if (!payload.name?.trim()) errors.name = 'Name is required';
  if (!payload.email?.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = 'Invalid email';
  if (!payload.reason?.trim()) errors.reason = 'Reason is required';
  // services optional
  if (payload.honeypot) errors.honeypot = 'Spam detected';
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    // Robust env loading in case Next inferred the wrong root directory
    if (!process.env.__CONTACT_ENV_LOADED) {
      try { dotenvConfig({ path: path.resolve(process.cwd(), '.env.local') }); } catch {}
      try { dotenvConfig({ path: path.resolve(process.cwd(), 'web/.env.local') }); } catch {}
      try { dotenvConfig({ path: path.resolve(process.cwd(), '../.env.local') }); } catch {}
      // flag so we don't re-run every request
      Object.assign(process.env, { __CONTACT_ENV_LOADED: '1' });
    }

    const body = (await req.json()) as ContactPayload;
    const errors = validate(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO || 'baz@usevulcan.app';
    const from = process.env.CONTACT_FROM || 'no-reply@homeenergyfoundry.com';
    console.log('[contact] env check', {
      hasKey: Boolean(resendKey),
      to,
      from
    });
    if (!resendKey) {
      return NextResponse.json({ ok: false, error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const subject = `Contact Request from ${body.name}`;
    const text = `New Contact Request\n\nName: ${body.name}\nEmail: ${body.email}\nCompany: ${body.company || 'Not provided'}\n\nServices:\n${body.services.map(s => `• ${s}`).join('\n')}\n\nReason:\n${body.reason}\n\nTimeline: ${body.timeline || 'Not specified'}\n\n---\nSent from baziyer-website`;

    try {
      const res = await resend.emails.send({ to, from, subject, text });
      console.log('[contact] resend response', res);
      // Some versions return { data, error }. Use in-operator without ts-expect-error
      if (res && typeof res === 'object' && 'error' in res && (res as { error?: unknown }).error) {
        const errVal = (res as { error?: unknown }).error;
        console.error('[contact] resend error (soft)', errVal);
        return NextResponse.json({ ok: false, error: String(errVal) }, { status: 500 });
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Resend send failed';
      console.error('[contact] resend send exception', message, e);
      return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}



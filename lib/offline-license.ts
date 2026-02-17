import { createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';

export type OfflineLicenseTier = 'basic' | 'pro';

export type OfflineLicensePayload = {
  sub: string;
  tier: OfflineLicenseTier;
  iat: number;
  exp: number;
};

export type OfflineLicenseVerification = {
  valid: boolean;
  reason?: 'invalid_format' | 'invalid_signature' | 'expired' | 'not_yet_valid';
  payload?: OfflineLicensePayload;
};

const encodeBase64Url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

const decodeBase64Url = (input: string): Buffer => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded =
    normalized.length % 4 === 0 ? normalized : normalized + '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(padded, 'base64');
};

export function createOfflineLicenseToken(
  payload: OfflineLicensePayload,
  privateKeyPem: string,
): string {
  const serialized = JSON.stringify(payload);
  const body = encodeBase64Url(serialized);
  const key = createPrivateKey(privateKeyPem);
  const signature = sign(null, Buffer.from(body), key);
  return `${body}.${encodeBase64Url(signature)}`;
}

export function verifyOfflineLicenseToken(
  token: string,
  publicKeyPem: string,
  nowUnixSeconds = Math.floor(Date.now() / 1000),
): OfflineLicenseVerification {
  const [body, signaturePart] = token.split('.');
  if (!body || !signaturePart) {
    return { valid: false, reason: 'invalid_format' };
  }

  let payload: OfflineLicensePayload;
  try {
    payload = JSON.parse(decodeBase64Url(body).toString('utf8')) as OfflineLicensePayload;
  } catch {
    return { valid: false, reason: 'invalid_format' };
  }

  const key = createPublicKey(publicKeyPem);
  const signature = decodeBase64Url(signaturePart);
  const signatureValid = verify(null, Buffer.from(body), key, signature);
  if (!signatureValid) {
    return { valid: false, reason: 'invalid_signature' };
  }

  if (payload.iat > nowUnixSeconds + 60) {
    return { valid: false, reason: 'not_yet_valid', payload };
  }
  if (payload.exp < nowUnixSeconds) {
    return { valid: false, reason: 'expired', payload };
  }

  return { valid: true, payload };
}

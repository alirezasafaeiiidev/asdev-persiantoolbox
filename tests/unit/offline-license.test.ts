import { generateKeyPairSync } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  createOfflineLicenseToken,
  verifyOfflineLicenseToken,
  type OfflineLicensePayload,
} from '@/lib/offline-license';

describe('offline license token', () => {
  it('validates signed token payload', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    const publicPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();

    const payload: OfflineLicensePayload = {
      sub: 'user-1',
      tier: 'pro',
      iat: 1_700_000_000,
      exp: 1_900_000_000,
    };
    const token = createOfflineLicenseToken(payload, privatePem);
    const result = verifyOfflineLicenseToken(token, publicPem, 1_800_000_000);

    expect(result.valid).toBe(true);
    expect(result.payload?.tier).toBe('pro');
  });

  it('rejects tampered token', () => {
    const { privateKey, publicKey } = generateKeyPairSync('ed25519');
    const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    const publicPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();

    const payload: OfflineLicensePayload = {
      sub: 'user-2',
      tier: 'basic',
      iat: 1_700_000_000,
      exp: 1_900_000_000,
    };
    const token = createOfflineLicenseToken(payload, privatePem);
    const [body, signature] = token.split('.');
    const tamperedBody = `x${body?.slice(1) ?? ''}`;
    const tampered = `${tamperedBody}.${signature ?? ''}`;
    const result = verifyOfflineLicenseToken(tampered, publicPem, 1_800_000_000);

    expect(result.valid).toBe(false);
  });
});

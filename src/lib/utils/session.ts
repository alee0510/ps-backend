import crypto from "crypto";

export class Session {
  private data: Record<string, any>;
  private dirty = false;
  private destroyed = false;
  private touched = false;

  constructor(initial: Record<string, any> = {}) {
    this.data = { ...initial };
  }

  get(key: string) {
    return this.data[key];
  }

  set(key: string, value: any) {
    this.data[key] = value;
    this.dirty = true;
  }

  delete(key: string) {
    delete this.data[key];
    this.dirty = true;
  }

  all() {
    return this.data;
  }

  isDirty() {
    return this.dirty;
  }

  touch() {
    this.touched = true;
  }

  destroy() {
    this.data = {};
    this.destroyed = true;
  }

  isDestroyed() {
    return this.destroyed;
  }

  isTouched() {
    return this.touched;
  }

  replace(newData: Record<string, any> = {}) {
    this.data = { ...newData };
    this.dirty = true;
  }
}

// @utils to sign and unsign session id
export function sign(value: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(value);
  return value + "." + hmac.digest("base64url");
}

export function unsign(signedValue: string, secret: string): string | null {
  const [value, sig] = signedValue.split(".");
  if (!value || !sign) return null;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(value);
  const expectedSig = hmac.digest("base64url");
  if (sig !== expectedSig) return null; // invalid signature or tampered
  return value;
}

export function fromBufferToDataURI(buffer: Buffer, mimeType: string): string {
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

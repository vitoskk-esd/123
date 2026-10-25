// Чтение kwork.zip без сторонних библиотек. Бот кладёт listings.json и обложки без сжатия;
// сжатые записи читаем через DecompressionStream, если браузер его умеет.
async function kwUnzip(buffer) {
  const dv = new DataView(buffer);
  let eocd = -1;
  for (let i = buffer.byteLength - 22; i >= Math.max(0, buffer.byteLength - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("это не ZIP-архив");
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const utf8 = new TextDecoder();
  const files = {};
  for (let k = 0; k < count; k++) {
    if (dv.getUint32(off, true) !== 0x02014b50) throw new Error("архив повреждён");
    const method = dv.getUint16(off + 10, true);
    const size = dv.getUint32(off + 20, true);
    const nameLen = dv.getUint16(off + 28, true), extraLen = dv.getUint16(off + 30, true);
    const commentLen = dv.getUint16(off + 32, true), local = dv.getUint32(off + 42, true);
    const name = utf8.decode(new Uint8Array(buffer, off + 46, nameLen));
    const start = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
    files[name] = {method, data: new Uint8Array(buffer, start, size)};
    off += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

async function kwEntryBytes(entry) {
  if (entry.method === 0) return entry.data;
  if (entry.method === 8 && typeof DecompressionStream !== "undefined") {
    const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  throw new Error("архив сжат неподдерживаемым способом — скачайте kwork.zip из бота заново");
}

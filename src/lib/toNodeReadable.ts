import { Readable } from "stream";
import { NextRequest } from "next/server";

/** Chuyển NextRequest thành Readable stream với headers (phục vụ formidable) */
export function toNodeReadable(req: NextRequest): Readable & { headers: any } {
  const reader = req.body?.getReader();

  const stream = new Readable({
    async read() {
      const { done, value } = await reader!.read();
      if (done) this.push(null);
      else this.push(value);
    },
  }) as Readable & { headers: any };

  stream.headers = Object.fromEntries(req.headers.entries());

  return stream;
}

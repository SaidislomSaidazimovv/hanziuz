/**
 * @jest-environment node
 */
type InsertResult = { error: { message: string } | null };

const insertMock = jest.fn<Promise<InsertResult>, [unknown]>();

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

type PostHandler = typeof import("@/app/api/contact/route").POST;
let POST: PostHandler;
let ipCounter = 0;

function freshPost(): PostHandler {
  let handler!: PostHandler;
  jest.isolateModules(() => {
    handler = require("@/app/api/contact/route").POST as PostHandler;
  });
  return handler;
}

function makeRequest(body: unknown) {
  ipCounter += 1;
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": `10.0.0.${ipCounter}`,
    },
    body: JSON.stringify(body),
  });
}

async function readJson(res: Response) {
  return res.json();
}

describe("Contact API — validation", () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
    POST = freshPost();
  });

  it("rejects empty name", async () => {
    const res = await POST(
      makeRequest({ name: "", email: "a@b.co", message: "hello world!" })
    );
    expect(res.status).toBe(400);
    const body = await readJson(res);
    expect(body.error).toMatch(/Ism/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects name shorter than 2 chars", async () => {
    const res = await POST(
      makeRequest({ name: "A", email: "a@b.co", message: "hello world!" })
    );
    expect(res.status).toBe(400);
  });

  it("rejects invalid email", async () => {
    const res = await POST(
      makeRequest({ name: "Ali", email: "not-an-email", message: "hello world!" })
    );
    expect(res.status).toBe(400);
    const body = await readJson(res);
    expect(body.error).toMatch(/Email/i);
  });

  it("rejects message under 10 chars", async () => {
    const res = await POST(
      makeRequest({ name: "Ali", email: "a@b.co", message: "short" })
    );
    expect(res.status).toBe(400);
    const body = await readJson(res);
    expect(body.error).toMatch(/Xabar/i);
  });

  it("accepts valid form data", async () => {
    const res = await POST(
      makeRequest({
        name: "Ali",
        email: "ali@mail.uz",
        message: "Salom, savolim bor.",
      })
    );
    expect(res.status).toBe(200);
    const body = await readJson(res);
    expect(body.success).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });
});

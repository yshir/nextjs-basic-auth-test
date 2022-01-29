import { NextRequest, NextResponse } from "next/server";

const USERNAME = "foo";
const PASSWORD = "bar";

export const middleware = (req: NextRequest): NextResponse | Response => {
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const auth = basicAuth.split(" ")[1];
    const [username, password] = Buffer.from(auth, "base64")
      .toString()
      .split(":");

    if (username === USERNAME && password === PASSWORD) {
      return NextResponse.next();
    }
  }

  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
};

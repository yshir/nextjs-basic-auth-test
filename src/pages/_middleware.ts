import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest): NextResponse | Response => {
  if (verifyEnv() || verifyQuery(req) || verifyHeader(req)) {
    return NextResponse.next();
  }

  return new Response("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
};

// NO_AUTH=1 npm run dev
const verifyEnv = (): boolean => {
  return !!process.env.NO_AUTH;
};

// http://localhost:3000?no_auth=1
const verifyQuery = (req: NextRequest): boolean => {
  const query = Object.fromEntries(
    new URLSearchParams(req.nextUrl.search).entries()
  );

  return !!query.no_auth;
};

const verifyHeader = (req: NextRequest): boolean => {
  const basicAuth = req.headers.get("authorization");
  if (!basicAuth) {
    return false;
  }

  const auth = basicAuth.split(" ")[1];
  const [username, password] = Buffer.from(auth, "base64")
    .toString()
    .split(":");
  return username === "foo" && password === "bar";
};

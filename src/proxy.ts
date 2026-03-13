// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import * as setCookieParser from "set-cookie-parser";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// export async function proxy(request: NextRequest) {
//   const authToken = request.cookies.get("authToken")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;

//   // Ideally, you would decode the authToken here (e.g., using `jose`) to check if it's expired.
//   // For simplicity, we trigger a refresh if the authToken is missing but a refreshToken exists.
//   const needsRefresh = !authToken && refreshToken;

//   // Create a response object early so we can attach cookies to it if needed
//   let response = NextResponse.next();

//   if (needsRefresh) {
//     try {
//       const refreshResponse = await fetch(
//         `${BASE_URL}/accounts/sessions/refresh`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Cookie: `refreshToken=${refreshToken}`,
//           },
//         }
//       );

//       if (refreshResponse.ok) {
//         const setCookieHeader = refreshResponse.headers.get("set-cookie");

//         if (setCookieHeader) {
//           const parsedCookies = setCookieParser.parse(setCookieHeader, {
//             decodeValues: false,
//           });

//           parsedCookies.forEach((cookie) => {
//             const cookieOptions = {
//               maxAge: cookie.maxAge,
//               expires: cookie.expires,
//               path: cookie.path || "/",
//               domain: cookie.domain,
//               secure: cookie.secure,
//               httpOnly: cookie.httpOnly,
//               sameSite: cookie.sameSite as "lax" | "strict" | "none",
//             };

//             // 1. Forward the new cookie to the incoming request
//             // so Server Components calling `cookies()` see the updated token immediately.
//             request.cookies.set(cookie.name, cookie.value);

//             // We must recreate the NextResponse after modifying the request cookies
//             response = NextResponse.next({
//               request: {
//                 headers: request.headers,
//               },
//             });

//             // 2. Attach the new cookie to the outgoing response
//             // so the user's browser actually saves it.
//             response.cookies.set(cookie.name, cookie.value, cookieOptions);
//           });
//         }
//       } else {
//         // If the refresh token is also invalid/expired, wipe the cookies and redirect to login
//         response.cookies.delete("authToken");
//         response.cookies.delete("refreshToken");
//         return NextResponse.redirect(new URL("/login", request.url));
//       }
//     } catch (error) {
//       console.error("[Middleware] Token refresh failed:", error);
//     }
//   }

//   return response;
// }

// // Configure the paths where this middleware should run
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as setCookieParser from "set-cookie-parser";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

// 1. Updated type to expect an array of strings (string[])
let pendingRefreshPromise: Promise<string[] | null> | null = null;

async function fetchNewTokens(refreshToken: string): Promise<string[] | null> {
  try {
    const response = await fetch(`${BASE_URL}/accounts/sessions/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (response.ok) {
      // 2. USE getSetCookie() HERE! This correctly returns an array of individual cookies
      return response.headers.getSetCookie();
    }
    return null;
  } catch (error) {
    console.error("[Middleware] Network error during token refresh:", error);
    return null;
  }
}

// 3. Renamed to 'middleware' so Next.js picks it up automatically
export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const needsRefresh = !authToken && refreshToken;

  let response = NextResponse.next();

  if (needsRefresh) {
    if (!pendingRefreshPromise) {
      pendingRefreshPromise = fetchNewTokens(refreshToken).finally(() => {
        pendingRefreshPromise = null;
      });
    }

    // setCookieHeaders is now of type: string[] | null
    const setCookieHeaders = await pendingRefreshPromise;

    // 4. Ensure it's not null AND has length before parsing
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      const parsedCookies = setCookieParser.parse(setCookieHeaders, {
        decodeValues: false,
      });

      parsedCookies.forEach((cookie) => {
        const cookieOptions = {
          maxAge: cookie.maxAge,
          expires: cookie.expires,
          path: cookie.path || "/",
          domain: cookie.domain,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite as "lax" | "strict" | "none",
        };

        // Update the incoming request for Server Components
        request.cookies.set(cookie.name, cookie.value);

        response = NextResponse.next({
          request: { headers: request.headers },
        });

        // Update the outgoing response for the browser
        response.cookies.set(cookie.name, cookie.value, cookieOptions);
      });
    } else {
      // If the refresh failed (or returned no cookies), wipe cookies and redirect
      response.cookies.delete("authToken");
      response.cookies.delete("refreshToken");
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // console.log("not need refresh");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

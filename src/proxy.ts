import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publishedSlugLookup } from "@/lib/pratishtha/visibility";
import { isIndexableSlug, visibleRecordDecision } from "@/lib/seo-slug";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase/env";

function missingRecord(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/pratishtha-missing";
  url.search = "";
  return NextResponse.rewrite(url);
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const recordSlug = path.match(/^\/pratishtha-kainkaryam\/([^/]+)$/);
  if (recordSlug) {
    const slug = decodeURIComponent(recordSlug[1]);
    const lookup = isIndexableSlug(slug) ? await publishedSlugLookup(slug) : "absent";
    if (visibleRecordDecision(slug, lookup) === "not-found") return missingRecord(request);
    return NextResponse.next();
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl(), supabaseKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLogin = path === "/admin/login";
  const isAdmin = path === "/admin" || path.startsWith("/admin/");

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/pratishtha-kainkaryam/:slug"],
};

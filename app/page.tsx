import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Dashboard } from "@/components/dashboard";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
          <div className="relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-32">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              }
            >
              <Dashboard />
            </Suspense>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

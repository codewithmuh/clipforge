import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Dashboard } from "@/components/dashboard";
import { SiteNav } from "@/components/site-nav";

export const dynamic = "force-dynamic";

export default function AppPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
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
  );
}

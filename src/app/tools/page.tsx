import { Suspense } from "react";
import { ToolsPageClient, ToolsPageLoading } from "@/components/tools-page";
import { fetchToolsDataServer } from "@/lib/server-data-service";

async function ToolsPageWithData() {
  const { resources, tags } = await fetchToolsDataServer();

  return (
    <ToolsPageClient
      initialResources={resources}
      initialTags={tags}
      initialLayout="cards"
    />
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<ToolsPageLoading />}>
      <ToolsPageWithData />
    </Suspense>
  );
}

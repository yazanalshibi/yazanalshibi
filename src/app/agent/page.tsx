import { SiteHeader } from "@/components/SiteHeader";
import { AgentChat } from "@/components/AgentChat";

export const metadata = {
  title: "Agent · MVP Specialist",
  description: "Chat with MVP Specialist to scope and scaffold your next product.",
};

export default function AgentPage() {
  return (
    <div className="atmosphere min-h-screen">
      <SiteHeader />
      <AgentChat />
    </div>
  );
}

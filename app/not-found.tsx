import { ExperienceState } from "@/components/ui/experience-state";

export default function NotFound() {
  return (
    <ExperienceState
      eyebrow="VELOCE / 404"
      title="A different road."
      message="This page is no longer here. Return to the collection and discover your next drive."
      href="/fleet"
      action="Explore the collection"
    />
  );
}
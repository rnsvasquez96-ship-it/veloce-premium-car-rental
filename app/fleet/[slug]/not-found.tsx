import { ExperienceState } from "@/components/ui/experience-state";

export default function VehicleNotFound() {
  return <ExperienceState eyebrow="Collection / 404" title="Vehicle not found" message="This machine is no longer part of the current collection." href="/fleet" action="Return to the collection" />;
}

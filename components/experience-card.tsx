import { Badge } from "@/components/ui";
import SpotlightCard from "./spotlight-card";

export default function ExperienceCard({
  company, role, period, location, bullets,
}: {
  company: string; role: string; period: string; location: string; bullets: string[];
}) {
  return (
    <SpotlightCard className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{role}</h3>
          <p className="opacity-80">{company} · {location}</p>
        </div>
        <Badge>{period}</Badge>
      </div>
      <ul className="list-inside list-disc space-y-1">
        {bullets.map((b, i) => <li key={i} className="opacity-90">{b}</li>)}
      </ul>
    </SpotlightCard>
  );
}

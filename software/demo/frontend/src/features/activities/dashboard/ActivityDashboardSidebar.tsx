import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/lib/hooks/useAccount";
import { useActivityFilterStore } from "@/lib/stores/useActivityFilterStore";
import type { Activity, Weapon, SkillLevel } from "@/lib/types";
import { getInitialCalendarMonth, type ParticipationFilter } from "./ActivityFilters";
import {
  EVENT_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  WEAPON_OPTIONS,
} from "@/lib/constants/activityOptions";

const PARTICIPATION_OPTIONS: { value: ParticipationFilter; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "going", label: "Going" },
  { value: "notGoing", label: "Not Going" },
];

type Props = {
  activities: Activity[] | undefined;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  );
}

function ActivityDashboardSidebar({ activities }: Props) {
  const { currentUser } = useAccount();
  const isClubAdmin = currentUser?.role === "ClubAdmin";
  const filters = useActivityFilterStore((state) => state.filters);
  const onFiltersChange = useActivityFilterStore((state) => state.setFilters);
  const resetFilters = useActivityFilterStore((state) => state.resetFilters);

  const toggleEventType = (eventType: (typeof EVENT_TYPE_OPTIONS)[number]) => {
    const isSelected = filters.eventTypes.includes(eventType);
    onFiltersChange({
      ...filters,
      eventTypes: isSelected
        ? filters.eventTypes.filter((type) => type !== eventType)
        : [...filters.eventTypes, eventType],
    });
  };

  // Seeded/demo activities are dated months out from "today", so the
  // calendar needs to open on the month where events actually exist
  // rather than the current month.
  const [month, setMonth] = useState(new Date());
  const hasInitializedMonth = useRef(false);

  useEffect(() => {
    if (!hasInitializedMonth.current && activities && activities.length > 0) {
      setMonth(getInitialCalendarMonth(activities));
      hasInitializedMonth.current = true;
    }
  }, [activities]);

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        {/* Participation (not meaningful for a Club Admin, who manages every event rather than attending as a member) */}
        {!isClubAdmin && (
          <div className="flex flex-col gap-3">
            <SectionLabel>Participation</SectionLabel>
            {PARTICIPATION_OPTIONS.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`participation-${option.value}`}
                  checked={filters.participation === option.value}
                  onCheckedChange={() =>
                    onFiltersChange({ ...filters, participation: option.value })
                  }
                />
                <Label htmlFor={`participation-${option.value}`}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        )}

        {/* Weapon Type */}
        <div className="flex flex-col gap-3 @container/weapon-toggle">
          <SectionLabel>Weapon Type</SectionLabel>
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="grid w-full grid-cols-2 gap-2 @xs/weapon-toggle:grid-cols-4"
            value={filters.weapons}
            onValueChange={(value: string[]) =>
              onFiltersChange({
                ...filters,
                weapons: value as Weapon[],
              })
            }
          >
            {WEAPON_OPTIONS.map((weapon) => (
              <ToggleGroupItem
                key={weapon}
                value={weapon}
                className="data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {weapon.toUpperCase()}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Event Type */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Event Type</SectionLabel>
          {EVENT_TYPE_OPTIONS.map((eventType) => (
            <div key={eventType} className="flex items-center gap-2">
              <Checkbox
                id={`event-type-${eventType}`}
                checked={filters.eventTypes.includes(eventType)}
                onCheckedChange={() => toggleEventType(eventType)}
              />
              <Label htmlFor={`event-type-${eventType}`}>{eventType}</Label>
            </div>
          ))}
        </div>

        {/* Skill Level */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Skill Level</SectionLabel>
          {SKILL_LEVEL_OPTIONS.map((skillLevel) => (
            <div key={skillLevel} className="flex items-center gap-2">
              <Checkbox
                id={`skill-level-${skillLevel}`}
                className="rounded-full"
                checked={filters.skillLevel === skillLevel}
                onCheckedChange={() =>
                  onFiltersChange({
                    ...filters,
                    skillLevel:
                      filters.skillLevel === skillLevel
                        ? null
                        : (skillLevel as SkillLevel),
                  })
                }
              />
              <Label htmlFor={`skill-level-${skillLevel}`}>{skillLevel}</Label>
            </div>
          ))}
        </div>

        {/* Date */}
        <Calendar
          mode="range"
          selected={filters.dateRange}
          onSelect={(dateRange) => onFiltersChange({ ...filters, dateRange })}
          month={month}
          onMonthChange={setMonth}
          className="w-full p-0"
        />

        <Button
          variant="outline"
          className="w-full uppercase tracking-wide"
          onClick={resetFilters}
        >
          Clear All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
export default ActivityDashboardSidebar;

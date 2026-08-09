"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import type { Activity } from "@/lib/types";
import { useActivities } from "@/lib/hooks/useActivities";
import { geocodeAddress } from "@/lib/api/geocoding";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import {
  activitySchema,
  type ActivitySchema,
} from "@/lib/schemas/activitySchema";
import {
  EVENT_TYPE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  WEAPON_OPTIONS,
} from "@/lib/constants/activityOptions";
import { getKnownVenueCoordinates } from "@/lib/constants/knownVenues";
import { FormTextField } from "./fields/FormTextField";
import { FormSelectField } from "./fields/FormSelectField";
import { ActivityDateField } from "./fields/ActivityDateField";

function getDefaultValues(activity?: Activity): ActivitySchema {
  return {
    title: activity?.title ?? "",
    date: activity?.date ? new Date(activity.date) : new Date(),
    startTime: activity?.startTime ?? "",
    endTime: activity?.endTime ?? "",
    description: activity?.description ?? "",
    weapon: activity?.weapon ?? "Mixed",
    skillLevel: activity?.skillLevel ?? "Beginner",
    type: activity?.type ?? "Training",
    city: activity?.city ?? "",
    venue: activity?.venue ?? "",
    price: activity?.price ?? 0,
  };
}

export function ActivityForm() {
  const { id } = useParams();
  const { activity, isLoadingActivity } = useActivities(id);

  if (isLoadingActivity) {
    return "Loading activity...";
  }

  // Keying on the activity forces a fresh mount (and a fresh useForm call) once the
  // real activity data has loaded, so defaultValues are computed from the actual
  // record instead of racing a form.reset() effect on a stale, hardcoded default.
  return <ActivityFormCard key={id ?? "create"} id={id} activity={activity} />;
}

function ActivityFormCard({
  id,
  activity,
}: {
  id?: string;
  activity?: Activity;
}) {
  const { updateActivity, createActivity } = useActivities(id);
  const navigate = useNavigate();
  const [isGeocoding, setIsGeocoding] = useState(false);

  const form = useForm<ActivitySchema, unknown, ActivitySchema>({
    resolver: zodResolver(activitySchema) as Resolver<ActivitySchema>,
    defaultValues: getDefaultValues(activity),
  });

  async function onSubmit(data: ActivitySchema) {
    let latitude = activity?.latitude ?? null;
    let longitude = activity?.longitude ?? null;

    const knownCoordinates = getKnownVenueCoordinates(data.venue);
    if (knownCoordinates) {
      latitude = knownCoordinates.latitude;
      longitude = knownCoordinates.longitude;
    } else {
      setIsGeocoding(true);
      try {
        const geocoded = await geocodeAddress(`${data.venue}, ${data.city}`);
        if (geocoded) {
          latitude = geocoded.latitude;
          longitude = geocoded.longitude;
        } else {
          toast.error(
            "Couldn't find that venue on the map. You can edit the event later to fix its location.",
          );
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
        toast.error(
          "Couldn't look up the venue location. You can edit the event later to fix its location.",
        );
      } finally {
        setIsGeocoding(false);
      }
    }

    const activityData: Activity = {
      id: activity?.id ?? crypto.randomUUID(),
      title: data.title,
      date: data.date.toISOString(),
      startTime: data.startTime,
      endTime: data.endTime,
      description: data.description,
      weapon: data.weapon,
      skillLevel: data.skillLevel,
      type: data.type,
      isCancelled: activity?.isCancelled ?? false,
      city: data.city,
      venue: data.venue,
      latitude,
      longitude,
      price: data.price,
    };

    if (id) {
      await updateActivity.mutateAsync(activityData);
      navigate(`/activities/${id}`);
    } else {
      createActivity.mutate(activityData, {
        onSuccess: (id) => {
          navigate(`/activities/${id}`);
        },
      });
    }
  }

  return (
    <Card className="mx-auto w-full max-w-5xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold">
          {activity ? "Edit an Event" : "Create an Event"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form id="form-activity" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormTextField
              name="title"
              control={form.control}
              id="form-title"
              label="Club Activity Title"
              placeholder="Club activity title"
              className="lg:col-span-2"
            />

            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="lg:col-span-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="form-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-description"
                      placeholder="Information club members need to know."
                      rows={6}
                      className="min-h-40 resize-y"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value?.length ?? 0}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <ActivityDateField
              name="date"
              control={form.control}
              id="form-date"
              label="Date"
              defaultDate={activity?.date ? new Date(activity.date) : undefined}
            />

            <FormTextField
              name="startTime"
              control={form.control}
              id="form-startTime"
              label="Start Time"
              type="time"
              placeholder="Start time"
            />

            <FormTextField
              name="endTime"
              control={form.control}
              id="form-endTime"
              label="End Time"
              type="time"
              placeholder="End time"
            />

            <FormSelectField
              name="weapon"
              control={form.control}
              id="form-weapon"
              label="Weapon"
              placeholder="Select a weapon"
              options={WEAPON_OPTIONS}
            />

            <FormSelectField
              name="skillLevel"
              control={form.control}
              id="form-skillLevel"
              label="Skill Level"
              placeholder="Select skill level"
              options={SKILL_LEVEL_OPTIONS}
            />

            <FormSelectField
              name="type"
              control={form.control}
              id="form-type"
              label="Club Activity Type"
              placeholder="Select club activity type"
              options={EVENT_TYPE_OPTIONS}
            />

            <FormTextField
              name="city"
              control={form.control}
              id="form-city"
              label="City"
              placeholder="City"
            />

            <FormTextField
              name="venue"
              control={form.control}
              id="form-venue"
              label="Venue"
              placeholder="Venue"
              className="lg:col-span-2"
            />

            <FormTextField
              name="price"
              control={form.control}
              id="form-price"
              label="Price"
              placeholder="0"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          id="form-close"
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => navigate("/activities")}
        >
          Close
        </Button>
        <Button
          id="form-submit"
          type="submit"
          form="form-activity"
          className="w-full sm:w-auto"
          disabled={
            isGeocoding || updateActivity.isPending || createActivity.isPending
          }
        >
          {isGeocoding ? "Locating venue..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}

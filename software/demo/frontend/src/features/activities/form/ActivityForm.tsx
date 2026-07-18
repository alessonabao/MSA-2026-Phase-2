"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters.")
      .max(100, "Title must be at most 100 characters."),
    date: z.string().min(1, "Date is required."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters.")
      .max(500, "Description must be at most 500 characters."),
    weapon: z.enum(["Foil", "Épée", "Sabre", "Mixed"] as const, {
      error: "Please select a valid weapon.",
    }),
    skillLevel: z.enum(["Beginner", "Intermediate", "Advanced"] as const, {
      error: "Please select a valid skill level.",
    }),
    type: z.enum(["Competition", "Training", "Social"] as const, {
      error: "Please select a valid activity type.",
    }),
    city: z
      .string()
      .min(2, "City must be at least 2 characters.")
      .max(100, "City must be at most 100 characters."),
    venue: z
      .string()
      .min(5, "Venue must be at least 5 characters.")
      .max(200, "Venue must be at most 200 characters."),
    price: z.coerce
      .number({ error: "Price must be a number." })
      .min(0, "Price cannot be negative.")
      .max(10000, "Price must be at most $10,000.")
      .transform((val) => Number(val)),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time.",
    path: ["endTime"],
  });

const weaponItems = [
  { label: "Foil", value: "Foil" },
  { label: "Épée", value: "Épée" },
  { label: "Sabre", value: "Sabre" },
  { label: "Mixed", value: "Mixed" },
];

const skillLevelItems = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const typeItems = [
  { label: "Competition", value: "Competition" },
  { label: "Training", value: "Training" },
  { label: "Social", value: "Social" },
];

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function ActivityForm() {
  // date
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateMonth, setDateMonth] = useState<Date | undefined>(date);
  const [dateValue, setDateValue] = useState(formatDate(date));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Submitted form: ", data);
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create a club activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Club Activity Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Club activity title"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Description */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Information club members need to know."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/100 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Date */}
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Date</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="date-required"
                      value={dateValue}
                      placeholder="Select date"
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        setDateValue(e.target.value);
                        if (isValidDate(date)) {
                          setDate(date);
                          setDateMonth(date);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          setDateOpen(true);
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger>
                          <InputGroupButton
                            id="date-picker"
                            variant="ghost"
                            size="icon-xs"
                            aria-label="Select date"
                          >
                            <CalendarIcon />
                            <span className="sr-only">Select date</span>
                          </InputGroupButton>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto overflow-hidden p-0"
                          align="end"
                          alignOffset={-8}
                          sideOffset={10}
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            month={dateMonth}
                            onMonthChange={setDateMonth}
                            onSelect={(date) => {
                              setDate(date);
                              setDateValue(formatDate(date));
                              setDateOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Start Time */}
            <Controller
              name="startTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Start Time
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-startTime"
                    type="time"
                    aria-invalid={fieldState.invalid}
                    placeholder="Start time"
                    autoComplete="off"
                    defaultValue="18:30"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* End Time */}
            <Controller
              name="endTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    End Time
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-endTime"
                    type="time"
                    aria-invalid={fieldState.invalid}
                    placeholder="End time"
                    autoComplete="off"
                    defaultValue="21:00"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Weapon */}
            <Controller
              name="weapon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="activity-weapon">Weapon</FieldLabel>
                  <Select onValueChange={(val) => console.log(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a weapon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Weapon</SelectLabel>
                        {weaponItems.map((weapon) => (
                          <SelectItem key={weapon.value} value={weapon.value}>
                            {weapon.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Skill Level */}
            <Controller
              name="weapon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="activity-skillLevel">
                    Skill Level
                  </FieldLabel>
                  <Select onValueChange={(val) => console.log(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Skill Level</SelectLabel>
                        {skillLevelItems.map((skillLevel) => (
                          <SelectItem
                            key={skillLevel.value}
                            value={skillLevel.value}
                          >
                            {skillLevel.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Type: Club activity type */}
            <Controller
              name="weapon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="activity-type">
                    Club Activity Type
                  </FieldLabel>
                  <Select onValueChange={(val) => console.log(val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select club activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Skill Level</SelectLabel>
                        {typeItems.map((typeActivity) => (
                          <SelectItem
                            key={typeActivity.value}
                            value={typeActivity.value}
                          >
                            {typeActivity.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* City */}
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">City</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-city"
                    aria-invalid={fieldState.invalid}
                    placeholder="City"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Venue */}
            <Controller
              name="venue"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Venue</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-venue"
                    aria-invalid={fieldState.invalid}
                    placeholder="Venue"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* Price */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Price</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-price"
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

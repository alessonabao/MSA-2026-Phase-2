"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
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
    date: z.coerce
      .date()
      .min(new Date(), { message: "Date cannot be in the past" })
      .max(new Date("2030-01-01"), {
        message: "Date is too far in the future",
      })
      .transform((val) => new Date(val)),
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

  const form = useForm<
    z.output<typeof formSchema>,
    unknown,
    z.output<typeof formSchema>
  >({
    resolver: zodResolver(formSchema) as Resolver<z.output<typeof formSchema>>,
    defaultValues: {
      title: "",
      date: new Date(),
      startTime: "18:30",
      endTime: "21:00",
      description: "",
      weapon: "Mixed",
      skillLevel: "Beginner",
      type: "Training",
      city: "",
      venue: "",
      price: 0,
    },
  });

  function onSubmit(data: z.output<typeof formSchema>) {
    console.log("Submitted form: ", data);
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create a club activity</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-activity" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-title">
                    Club Activity Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-title"
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
                  <FieldLabel htmlFor="form-description">
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-description"
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
                  <FieldLabel htmlFor="form-date">Date</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="form-date"
                      value={dateValue}
                      placeholder="Select date"
                      onChange={(e) => {
                        const parsedDate = new Date(e.target.value);
                        setDateValue(e.target.value);
                        if (isValidDate(parsedDate)) {
                          setDate(parsedDate);
                          setDateMonth(parsedDate);
                          field.onChange(parsedDate);
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
                        <PopoverTrigger asChild>
                          <InputGroupButton
                            id="date-picker-btn"
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
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              setDateValue(formatDate(selectedDate));
                              field.onChange(selectedDate);
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
                  <FieldLabel htmlFor="form-startTime">Start Time</FieldLabel>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    id="form-startTime"
                    type="time"
                    aria-invalid={fieldState.invalid}
                    placeholder="Start time"
                    autoComplete="off"
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
                  <FieldLabel htmlFor="form-endTime">End Time</FieldLabel>
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    id="form-endTime"
                    type="time"
                    aria-invalid={fieldState.invalid}
                    placeholder="End time"
                    autoComplete="off"
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
                  <FieldLabel htmlFor="form-weapon">Weapon</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="form-weapon" className="w-full">
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
              name="skillLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-skillLevel">Skill Level</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="form-skillLevel" className="w-full">
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
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-type">
                    Club Activity Type
                  </FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="form-type" className="w-full">
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
                  <FieldLabel htmlFor="form-city">City</FieldLabel>
                  <Input
                    {...field}
                    id="form-city"
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
                  <FieldLabel htmlFor="form-venue">Venue</FieldLabel>
                  <Input
                    {...field}
                    id="form-venue"
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
                  <FieldLabel htmlFor="form-price">Price</FieldLabel>
                  <Input
                    {...field}
                    id="form-price"
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
          <Button
            id="form-reset"
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button id="form-submit" type="submit" form="form-activity">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

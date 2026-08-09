import { useState } from "react";
import { Controller, type Control, type FieldPath } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { ActivitySchema } from "@/lib/schemas/activitySchema";

function formatDateForInput(date: Date | undefined) {
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

type Props = {
  name: FieldPath<ActivitySchema>;
  control: Control<ActivitySchema>;
  id: string;
  label: string;
  defaultDate?: Date;
};

export function ActivityDateField({
  name,
  control,
  id,
  label,
  defaultDate,
}: Props) {
  const [dateOpen, setDateOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(defaultDate ?? new Date());
  const [dateMonth, setDateMonth] = useState<Date | undefined>(date);
  const [dateValue, setDateValue] = useState(formatDateForInput(date));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={id}
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
                      setDateValue(formatDateForInput(selectedDate));
                      field.onChange(selectedDate);
                      setDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

import { Link } from "react-router";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Field, FieldError } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  comment: z
    .string()
    .min(2, { message: "Comment must be at least 2 characters." })
    .max(160, { message: "Comment must not be longer than 160 characters." }),
});

const comments = [
  {
    id: 1,
    name: "Alesson Abao",
    isOfficial: false,
    time: "2h ago",
    message:
      "Will there be equipment sales on site? I need to pick up a new foil blade before the pools start.",
  },
  {
    id: 2,
    name: "En Garde Staff",
    isOfficial: true,
    time: "1h ago",
    message:
      "Hi Alex! Yes, Leon Paul will have a small pop-up booth for basic maintenance and blades.",
  },
];

export default function ActivityDetailsForum() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form Submitted Data:", data);
    // Handle your API call or server action here
    form.reset();
  }

  return (
    <div>
      <h2 className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
        Discussion
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 flex gap-4">
        <Avatar>
          <AvatarImage src="/images/profile.jpeg" alt="Your avatar" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Controller
            name="comment"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Textarea
                  {...field}
                  placeholder="Ask a question or leave a comment..."
                  className="resize-y"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="mt-2 flex justify-end">
            <Button type="submit">Post</Button>
          </div>
        </div>
      </form>

      <Separator className="my-6" />

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-2 border-border pl-4">
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${comment.name}`}
                className="text-sm font-bold no-underline hover:underline"
              >
                {comment.name}
              </Link>
              {comment.isOfficial && <Badge>Official</Badge>}
              <span className="text-xs text-muted-foreground">
                {comment.time}
              </span>
            </div>

            <p className="mt-1 text-sm">{comment.message}</p>

            <button
              type="button"
              className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase hover:underline"
            >
              Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

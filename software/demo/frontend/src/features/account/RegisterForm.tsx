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
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAccount } from "@/lib/hooks/useAccount";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { NavLink } from "react-router";
import { toast } from "sonner";

function RegisterForm() {
  const { registerUser } = useAccount();

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser.mutateAsync(data);
    } catch (error) {
      let message =
        "Something went wrong while creating your account. Please try again.";
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          message = "That email is already registered.";
        } else if (!error.response) {
          message = "Unable to reach the server. Please check your connection.";
        }
      }
      toast.error(message);
    }
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Join Auckland&apos;s fencing community.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form id="form-register" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Full Name */}
              <Controller
                name="profileName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    className="lg:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="register-profile-name">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-profile-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Portia Knight"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    className="lg:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="register-email">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="upi@aucklanduni.ac.nz"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Password */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {/* Confirm Password */}
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="register-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="register-confirm-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Password"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <FieldSeparator className="lg:col-span-2" />
              <div className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-1.5 lg:col-span-2">
                <p className="text-muted-foreground">
                  Already have an account?
                </p>
                <NavLink
                  to="/login"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Log in
                </NavLink>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            id="form-submit"
            type="submit"
            disabled={!isValid || isSubmitting}
            form="form-register"
            className="w-full"
          >
            Create Account
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
export default RegisterForm;

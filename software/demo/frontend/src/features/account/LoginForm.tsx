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
import { loginSchema, type LoginSchema } from "@/lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router";

function LoginForm() {
  const { loginUser } = useAccount();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    await loginUser.mutateAsync(data);
    navigate("/activities");
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access club events and beginner resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form id="form-activity" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Email */}
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    className="lg:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="login-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Email"
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
                  <Field
                    className="lg:col-span-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="login-password"
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
                <p className="text-muted-foreground">Not a member yet?</p>
                <NavLink
                  to="/signup"
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Sign Up
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
            form="form-activity"
            className="w-full"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
export default LoginForm;

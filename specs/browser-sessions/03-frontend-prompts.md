# Frontend Development Prompts

AI tool used: Claude (claude.ai)

---

## TypeScript types for ClubActivity

**Prompt:**
> Can you create a TypeScript type for my ClubActivity frontend? I want it to use union types for weapon, skill level, and type fields.

**AI response summary:**
Claude created `index.d.ts` with exported union types and the `Activity` interface. `TimeOnly` and `DateTime` from the backend both serialise to strings over the API, so they are typed as `string` on the frontend. Union types for `Weapon`, `SkillLevel`, and `ActivityType` give autocomplete and catch typos at compile time rather than at runtime.

---

## NavBar component

**Prompt:**
> I want to style my header to have events, resources, and profile in the centre. Also, is it better to create a NavBar component instead of having the header in App.tsx?

**AI response summary:**
Claude confirmed extracting NavBar is better practice — it makes the component independently testable for Storybook (an advanced requirement), keeps App.tsx clean, and makes auth state management easier as the app grows. The centring technique uses `grid grid-cols-3` on the header rather than `absolute left-1/2 -translate-x-1/2` — more reliable when the logo and action areas have different widths. Active link styling uses NavLink's `className` function prop instead of a CSS `.active` class, and hardcoded colours were replaced with theme tokens (`border-primary`) for dark mode compatibility.

---

## ActivityForm with React Hook Form and Zod

**Prompt:**
> Create a React Hook Form with Zod validation for my ClubActivity. I want a formSchema = z.object of my activity form.

**AI response summary:**
Claude built the schema with Zod v4 syntax. Key issue encountered: `z.coerce.date()` and `z.coerce.number()` in Zod v4 infer output as `unknown` instead of `Date` and `number`. Fix required adding `.transform((val) => new Date(val))` and `.transform((val) => Number(val))` and using `z.output<typeof formSchema>` instead of `z.infer` for `useForm` type parameter. The `refine()` for end time validation wraps in `ZodEffects` which breaks resolver inference — fixed by casting: `zodResolver(formSchema) as Resolver<z.output<typeof formSchema>>`.

---

## Date picker with Popover and Calendar

**Prompt:**
> I want the date to be like a popover calendar picker. I also want startTime and endTime to use the time input with the browser's native time picker UI hidden.

**AI response summary:**
Claude implemented the date field using shadcn `Popover` + `Calendar` with an `InputGroupInput` for manual text entry and a calendar icon button trigger. Key fix: `useState` inside a render prop is against React's rules of hooks — extracted to a separate `DatePickerField` component. Time inputs use `appearance-none` with `[&::-webkit-calendar-picker-indicator]:hidden` to hide the browser's native clock icon while keeping the native time picker functional. `startTime`/`endTime` typed as `z.string()` not `z.coerce.date()` since `<input type="time">` returns `"HH:mm"` strings.

---

## Infinite re-render fix

**Prompt:**
> Maximum update depth exceeded error in ActivityForm.

**AI response summary:**
Claude identified the `useEffect` in `ActivityForm` had `form` in its dependency array. The `form` object from `useForm` is not stable across renders — including it causes every `form.reset()` call to trigger a re-render, which triggers the effect again infinitely. Fix: remove `form` from the dependency array and use an empty `[]` dependency array since the effect only needs to run once on mount to populate initial values.

---

## Resources page design

**Prompt:**
> I want to redesign my current Resources page to have better formatting almost similar to a dark editorial design I've shown you. I want to keep video references.

**AI response summary:**
Claude rebuilt the Resources page with a dark editorial layout (`bg-[#0a0a0a]`) matching the design reference: "NEWCOMER'S GUIDE" eyebrow label in small caps, large bold heading, weapon sections alternating left/right video placement for visual rhythm, footwork as a three-column card grid, equipment as a two-column split with icon grid and video, and a numbered counter (01/05 through 05/05) in each section header matching the reference's pagination detail.

---

## VideoCarousel reusable component

**Prompt:**
> Is there a way I could make the footwork carousel a reusable component I could use for the resources page?

**AI response summary:**
Claude refactored the carousel into a generic `VideoCarousel` component accepting `heading`, `items: CarouselItem[]`, and `itemsPerPage` props. The `CarouselItem` type is exported so consumers can define their own data arrays. The component lives in `src/features/resources/` since it's only used there. Usage in `Resources.tsx` shows two carousel instances — one for footwork (4 items, 2 per page) and one for weapons (3 items, 2 per page) — both importing from the same file using a relative `"./VideoCarousel"` path.

---

## Error page

**Prompt:**
> Create an error page component for my project with a button that redirects to the home page.

**AI response summary:**
Claude created `ErrorPage.tsx` using `useRouteError` and `isRouteErrorResponse` from React Router to detect the error type. The component renders different titles and messages for 404 (Page Not Found), 403 (Access Denied), 500 (Server Error), and generic JS runtime errors. Two buttons: "Back to Home" (`navigate("/")`) and "Go Back" (`navigate(-1)`). Added to the router as `errorElement` on the root route and as a `path="*"` catch-all.

---

## Router structure

**Prompt:**
> How do I make sure that the activity form is under /events/?

**AI response summary:**
Claude replaced `path: ""` with `index: true` on nested routes and restructured events as a parent with children. Using `path: ""` alongside nested children causes React Router to match the same route repeatedly, triggering infinite update loops. The correct pattern uses `index: true` for default child routes:
```tsx
{ path: "events", children: [
  { index: true, element: <Activities /> },
  { path: "create", element: <ActivityForm /> },
]}
```

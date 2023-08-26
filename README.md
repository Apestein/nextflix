## Open source project using bleeding-edge stack. Drizzle ORM + Neon postgres + Clerk auth + Shadcn/ui + everything new in Next.js 13 (server components, server actions, streaming ui, parallel routes, intercepting routes).

### Full tech stack
- Next.js 13
- CreateT3App Bootrapped
- Neon (postgres)
- Drizzle ORM
- Tailwind + Shadcn/ui
- Clerk
- SWR
- Lucide Icons
- Zod Validation
- Stripe

### Project Description
Netflix clone, project inspired by [@sadmann17](https://twitter.com/sadmann17). Bootrapped with CreateT3App. Project uses 100% server actions, zero api endpoints aside for webhooks. [next-safe-action](https://github.com/TheEdoRan/next-safe-action) library for typesafe server actions. Each account can have up to 4 profiles. Each profiles have it's own avatar and list of saved shows. Feature includes ability to search show catalog, SaaS subscription service with Stripe, optimistic update, and infinite scrolling.

### Overall Thoughts
Parallel and intercepting routes currently very broken, not worth using. But their usefullness would be immese if they actually worked correctly. Being able to show a modal that is fetched with server components is huge. I couldn't find a way to use server component with my modal so it had to be fetched with client component. Streaming ui and suspense is great. It really makes it easy to handle loading states. This is one of the most impactful things about app dir vs page dir. I saved the most important topic for last. When I first started using server actions I really didn't understand the point. They kind of felt like another way to write api endpoints and just felt like a worst version of tRPC. The Next.js docs will push you to use the server component version of server actions using forms but trust me, don't use server actions with forms. If you do, you are giving up the best feature of server actions which is the tRPC like typesafety. To get the best DX out of server actions, I recommend using [next-safe-actions](https://github.com/TheEdoRan/next-safe-action/tree/main/packages/next-safe-action), this lib is a game changer. It made server actions felt just like tRPC and overall was just an amazing DX. Important note, I was using [Zact](https://github.com/pingdotgg/zact) at first but it was much too limited, just use next-safe-actions instead. I think it's still too early for server actions to replace tRPC but the nice thing is that it requires zero setup. Setting tRPC up for app dir would be a headache right now. Also note, [revalidatePath/Tag currently only work with server actions](https://github.com/pingdotgg/zact) and you will definitely need them.

### Project Setup
To bootstrap with CreateT3App, you just need to delete page dir and create app dir. And VERY important, in next.config.mjs you must delete "i18n" property.

### Project Structure
Some people like to break everything down into neat little components and organize them into different files. I prefer big files, nothing gets extracted until it gets used in at least 2 different places. 
If your site is complex you will probably need many different layout. Your root layout.tsx file should contain only the things shared by your entire app. For parts of your site that need different layout use [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups). 
![Screenshot (74)](https://github.com/Apestein/nextflix/assets/107362680/44bffd04-e537-49ca-a945-1b1185a4b64f)

### Tricky Things To Consider (I will be going over things I found tricky or difficult in this section)

#### 1. You will no doubt run into problems with Next.js aggressive caching. To invalidate router cache, you must use [RevalidatePath/Tage in server action](https://nextjs.org/docs/app/building-your-application/caching#invalidation-1). However, Revalidate/Tag also causes the current page to refresh. I don't know why Next.js decided to do this but get around this I use this [LinkButton](https://github.com/Apestein/nextflix/blob/main/src/components/link-button.tsx) component. See the problem below when.
[scrnli_8_22_2023_12-30-04 PM2.webm](https://github.com/Apestein/nextflix/assets/107362680/da7dd256-0a91-4ce5-99c6-698bc37d8013)


#### 2. When a new user creates an account or signs in with Clerk's oauth I needed to create an account and profile in my database. At first, I was using Clerk's webhook to create them but the problem was users would get redirected to the landing page before the webhook could add the account and profile to the database. As a result, when users first creates the account. The UserButton component that displayed their avatar and profile infomation was missing. To get around this, I had a [CustomUserComponent](https://github.com/Apestein/nextflix/blob/main/src/app/(main)/layout.tsx) check if the user exist in the database or not (if not, add).
```ts
async function CustomeUserButton() {
  const { userId } = auth()
  if (!userId) return
  const existingAccount = await getAccountWithActiveProfile()
  const account = existingAccount ?? (await createAccountAndProfile())
  ...
}
```
Additionally, you should wrap the component in suspense to not block the UI and prevent unresponsiveness. 
```ts
<Suspense fallback={<Skeleton className="h-8 w-8" />}>
  <CustomeUserButton />
</Suspense>
```
#### 3. I had an object that I needed to extract a tuple from to validate with zod. [Here is how](https://github.com/Apestein/nextflix/blob/main/src/lib/configs.ts).
```ts
export const createCheckoutSession = authAction(
  z.object({
    stripeProductId: z.string(),
    planName: z.enum(planTuple),
  }),
}
```
![Screenshot (78)](https://github.com/Apestein/nextflix/assets/107362680/98e2f8f8-3b44-46d7-baa6-abe95d8463fa)

#### 4. Infinite scrolling can be tricky to implement yourself. Typically, I would use React Query/SWR to do this but I wanted to implement it with [server actions](https://github.com/Apestein/nextflix/blob/main/src/actions/index.ts) this time. 
```ts
// actions/index.ts 
export const getMyShowsInfinite = authAction(
  z.object({
    index: z.number().min(0),
    limit: z.number().min(2).max(50),
  }),
  async (input) => {
    const account = await getAccountWithActiveProfile()
    const shows = await db.query.myShows.findMany({
      where: eq(myShows.profileId, account.activeProfileId),
      limit: input.limit,
      offset: input.index * input.limit,
    })
    return shows
  },
)
```
Then, I use this modified [infinite scroll component](https://github.com/Apestein/better-react-infinite-scroll) that I created. See the implementation [here](https://github.com/Apestein/nextflix/blob/main/src/app/(main)/my-list/infinite-scroller.tsx). Important thing to understand is inside IntersectionObserver callback function, you must use refs instead of state. That is because of scoping, the callback is only created once and all the variables inside are snapshotted. To get around this you need to use refs. There maybe other ways, I'm just listing what I know.
```ts
const observer = new IntersectionObserver((entries) => {
  if (!hasNextPageRef.current) return; // <= must use ref, don't use state
})
```

[scrnli_8_22_2023_12-42-31 PM3.webm](https://github.com/Apestein/nextflix/assets/107362680/e9ceae54-1ea0-4c89-97c7-0d87d12bd135)


#### 5. For Stripe intergration. Reference these 2 repos and mine also of course. Be careful with webhooks, use the Stripe CLI to forward events to your local environment when testing.
   - [Official Next.js example using server actions](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript)
   - [Taxonomy](https://github.com/shadcn-ui/taxonomy)

#### 6. Optimistic update with server actions can be tricky. Using next-safe-action's useOptimisticAction hook helps here. [Here is how I did it](https://github.com/Apestein/nextflix/blob/main/src/components/show-card.tsx). I decided to use server action to query initial state just to test it, but for client side querying it's probably better to use React Query/SWR.
[scrnli_8_22_2023_12-17-36 PM.webm](https://github.com/Apestein/nextflix/assets/107362680/00f9690a-8698-498a-b639-5e45b5e5518c)

#### 7. To prevent the search function from firing with every keystroke. Use the [use-debounce package](https://www.npmjs.com/package/use-debounce). [See my implementation here](https://github.com/Apestein/nextflix/blob/main/src/app/(main)/search/search-input.tsx). All data fetching can be done with server component by using router.push()/replace(). Pretty crazy pattern if you ask me🤯.  
[scrnli_8_22_2023_12-51-37 PM4.webm](https://github.com/Apestein/nextflix/assets/107362680/3dda2e70-97f5-4d88-beca-1cfda53fc344)

#### 8. Very frustrating problem I ran into was the scrollbar causing layout shift. When users navigate from a page with scrollbar to a page without scrollbar there would be an annoying layout shift. 
https://github.com/Apestein/nextflix/assets/107362680/4136a245-e38f-404a-b66e-2a9c4bc1b266

The solution is to use [scrollbar-gutter css property](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter). However, the documentation is terrible and I couldn't get it to work after many hours of debugging. I ended up just googling "scrollbar-gutter not working" and found this [stackoverflow answer](https://stackoverflow.com/questions/75732399/why-doesnt-scrollbar-gutter-stable-work-on-the-body-element) lol. Basically, I just need to place scrollbar-gutter:stable on the [HTML element](https://github.com/Apestein/nextflix/blob/main/src/app/layout.tsx)🤦‍♂️. However this introduced a new bug when using "scrollbar-gutter" with modals, specifically Shadcn/ui & Radix modals. Opening a modal causes layout shift. 

[scrnli_8_25_2023_5-58-40 PM5.webm](https://github.com/Apestein/nextflix/assets/107362680/9e5e7f93-8d1a-493f-8eba-c6dc2b283805)

Moreover, since I must set "scrollbar-gutter" on the HTML element. This meant that my whole application will have a gutter (small padding on the right) on every page, we wouldn't want a gutter on our auth pages for example. After some research, here is the solution that I came up with:
```ts
//app/layout.tsx
<html
  lang="en"
  suppressHydrationWarning
  className="[&:not(:has([role='dialog'])):has([data-layout='main'])]:[scrollbar-gutter:stable]"
  //Basically, this means only set "scrollbar-gutter:stable" when current page has both element with attribute NOT [role="dialog"] (ie. when modal is NOT open) and element with atrribute [data-layout=main] (ie. when we are in page of "(main)" route group). Wow, who knew CSS could be so powerful🤯
>...</html>
```
```ts
//app/(main)/layout.tsx
<div
  className="container flex min-h-screen flex-col px-4 md:px-8"
  data-layout="main" //<= add this
>
  <Header />
  {children}
  <Footer />
</div>
```
Though I must admit, this feels very hacky. Feel free to recommended a better solution.

#### Feel free to ask me questions at [@Apestein_Dev](https://twitter.com/Apestein_Dev).

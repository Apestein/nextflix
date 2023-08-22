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
Netflix clone, project inspired by [@sadmann17](https://twitter.com/sadmann17). Bootrapped with CreateT3App. Project uses 100% server actions, including for client side querying. [next-safe-action](https://github.com/TheEdoRan/next-safe-action) library for typesafe server actions. Each account can have up to 4 profiles. Each profiles have it's own avatar and list of saved shows. Feature includes ability to search show catalog and SaaS subscription service with Stripe.

### Overall Thoughts
Parallel and intercepting routes currently very broken, not worth using. But their usefullness would be immese if they actually worked correctly. Being able to show a modal that is fetched with server components is huge. I couldn't find a way to use server component with my modal so it had to be fetched with client component. Streaming ui and suspense is great. It really makes it easy to handle loading states. This is one of the most impactful things about app dir vs page dir. I saved the most important topic for last. When I first started using server actions I really didn't understand the point. They kind of felt like another way to write api endpoints and just felt like a worst version of tRPC. The Next.js docs will push you to use the server component version of server actions using forms and actions but trust me, don't use server actions with forms. If you do, you are giving up the best feature of server actions which is the tRPC like typesafety. To get the best DX out of server actions, I recommend using [next-safe-actions](https://github.com/TheEdoRan/next-safe-action/tree/main/packages/next-safe-action), this lib is a game changer. It made server actions felt just like trpc and overall was just an amazing DX. Important note, I was using [Zact](https://github.com/pingdotgg/zact) at first but it was much too limited, just use next-safe-actions instead. I think it's still too early for server actions to replace tRPC but the nice thing is that it requires zero setup. Setting tRPC up for app dir would be a headache right now. Also note, [revalidatePath/Tag currently only work with server actions](https://github.com/pingdotgg/zact) and you will definitely need them.

### Project Setup
To bootstrap with CreateT3App, you just need to delete page dir and create app dir. And VERY important, in next.config.mjs you must delete "i18n" property.

### Project Structure
Some people like to break everything down into neat little components and organize them into different files. I prefer big files, nothing gets extracted until it gets used in at least 2 different places. 
If your site is complex you will probably need many different layout. Your root layout.tsx file should contain only the things shared by your entire app. For parts of your site that need different layout use [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups). 
![Screenshot (74)](https://github.com/Apestein/nextflix/assets/107362680/44bffd04-e537-49ca-a945-1b1185a4b64f)

### Tricky Things To Consider (I will be going over things I found tricky or difficult in this section)

#### 1. Revalidate/Tag causes the current page to refresh. I don't know why Next.js decided to do this but get around this I use this [LinkButton](https://github.com/Apestein/nextflix/blob/main/src/components/link-button.tsx) component.
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
#### 3. I had an object that I needed to extra a tuple from to validate with zod.
```ts
export const createCheckoutSession = authAction(
  z.object({
    stripeProductId: z.string(),
    planName: z.enum(planTuple),
  }),
}
```
![Screenshot (78)](https://github.com/Apestein/nextflix/assets/107362680/98e2f8f8-3b44-46d7-baa6-abe95d8463fa)

#### 4. Infinite scrolling can be tricky to implement yourself. Typically, I would use React Query/SWR to do this but I wanted to implement it with server actions this time.
```ts
//server action
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
Then, I use this modified [infinite scroll component](https://github.com/Apestein/better-react-infinite-scroll) that I created. See the implementation [here](https://github.com/Apestein/nextflix/blob/main/src/app/(main)/my-list/infinite-scroller.tsx).

#### 5. For Stripe intergration. Look at these 2 repo and mine also of course.
   - [Official Next.js example using server actions](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript)
   - [Taxonomy](https://github.com/shadcn-ui/taxonomy)

#### Feel free to ask me questions at [@Apestein_Dev](https://twitter.com/Apestein_Dev).

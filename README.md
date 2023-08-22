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
Parallel and intercepting routes currently very broken, not worth using. But their usefullness would be immese if they actually worked correctly. Being able to show a modal that is fetched with server components is huge. I couldn't find a way to use server component with my modal so it had to be fetched with client component. Streaming ui and suspense is great. It really makes it easy to handle loading states. This is one of the most impactful things about app dir vs page dir. I saved the most important topic for last. When I first started using server actions I really didn't understand the point. They kind of felt like another way to write api endpoints and just felt like a worst version of tRPC. The Next.js docs will push you to use the server component version of server actions using forms and actions but trust me, don't use server actions with forms. If you do, you are giving up the best feature of server actions which is the tRPC like typesafety. To get the best DX out of server actions, I recommend using [next-safe-actions](https://github.com/TheEdoRan/next-safe-action/tree/main/packages/next-safe-action), this lib is a game changer. It made server actions felt just like trpc and overall was just an amazing DX. Important note, I was using [Zact](https://github.com/pingdotgg/zact) at first but it was much too limited, just use next-safe-actions instead. I think server actions are still to green to replace trpc but the nice thing is that it requires zero setup. Setting tRPC up for app dir would be a headache right now. Also note, [revalidatePath/Tag currently only work with server actions](https://github.com/pingdotgg/zact) and you will definitely need them. 

### Project Setup
To bootstrap with CreateT3App, you just need to delete page dir and create app dir. And VERY important, in next.config.mjs you must delete "i18n" property.

### Project Structure
Some people like to break everything down into neat little components and organize them into different files. I prefer big files, nothing gets extracted until it gets used in at least 2 different places. 
If your site is complex you will probably need many different layout. Your root layout.tsx file should contain only the things shared by your entire app. For parts of your site that need different layout use [route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups). 
![Screenshot (74)](https://github.com/Apestein/nextflix/assets/107362680/44bffd04-e537-49ca-a945-1b1185a4b64f)

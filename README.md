## Trying out bleeding-edge stack. Drizzle (ORM) + Neon (postgres) + shadcn/ui + everything new in Next.js 13 (server components, server actions, streaming ui, parallel routes, intercepting routes).

### Note: Parallel and intercepting routes currently very broken, not worth using.

### Full tech stack
- Next.js 13
- CreateT3App Bootrapped
- Neon (postgres)
- Drizzle ORM
- Shadcn/ui
- SWR
- Lucide Icons
- Zod Validation
- Typescript-eslint library

### Planned features: 
- ~~Payment subscription service with Stripe~~  
- ~~Search show catalog~~
- Safety pin for each profile.

Project Description: Netflix clone. Project is 100% typesafe (zero any) due to typescript-eslint library, extremely strict typescript . Bootrapped with CreateT3App. Zact library for typesafe server actions, modified to allow for querying also. Each account can have up to 4 profiles. Each profiles have it's own avatar and list of saved shows. Search show catalog and SaaS subscription service with Stripe completed. 

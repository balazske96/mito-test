# Mito Test

## Introduction

Go easy on me — this was my first time using Vue and Nuxt.js! I’m sure I didn’t nail all the best
practices or conventions, and there are probably things I could’ve done better. Still, I tried to stick to the
requirements as closely as possible. I might’ve missed a few details, and due to limited time, some features — like
validation and request handling — are still missing. Hopefully, the effort and overall result still come through.

## My Approach

### Project Structure

I set up the project as a monorepo using `npm`. The `apps` folder holds the main applications, and the `packages` folder
is for shared libraries. I chose `npm` for simplicity and compatibility, but in a real-world project, I’d probably go
with `pnpm` or `yarn` for better performance and features.  
At the end, I also added Turborepo to make the setup more Vercel-friendly.

### Coding

Since I was under time pressure and still learning Nuxt, I leaned on GitHub Copilot quite a bit — hope that’s okay!  
Because of the rush, there might be some leftover comments, unused code, or even a few bugs. In a real-world project,
I’d spend more time cleaning things up and ensuring everything’s polished.  
Also, I mostly skipped using environment variables unless absolutely necessary — just to keep things simple for this
test. Normally, I'd definitely use them for handling secrets and config values.  
Oh, and I played around with SVGs — used them both as images and as components, just for fun.

### Styling

I kept the styling scoped to each component. Normally, I’d probably go with a more structured approach like atomic
design or a design system.  
Since it’s a monorepo, we could also extract components into a shared package to make them easier to reuse across apps.

### TODOs

You’ll see some `TODO` comments in the code — those are things I’d work on next if this were a production-level app.  
If you’re using IntelliJ, you can easily search for all of them. I’m pretty sure there’s a VS Code extension for that
too.

## How to Run the Project

I used Node.js `22.14` and npm `10.9.2`, so please try to use the same versions to avoid compatibility issues.

1. Clone the repo.
2. Run `npm install` in the root directory (since it’s a monorepo).
3. Start the apps with `npm run dev` from the root.
4. To test the API, run `./run-tests.sh` from the root.

## Live Demos

- Frontend: [https://mito-test-frontend.vercel.app](https://mito-test-frontend.vercel.app)
- API: [https://mito-test.onrender.com/api-docs/](https://mito-test.onrender.com/api-docs/)

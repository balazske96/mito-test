# Mito Test

## My approach:

### Project structure:

I initialized the project with a monorepo structure using `npm`. The `apps` folder contains the main applications, and
the `packages` folder contains shared libraries. I used `npm` as the package manager for simplicity and compatibility
but in a real scenario, I would consider using `pnpm` or `yarn` for better performance and features.

### Coding:

Because of the tight deadline and the fact that I was unfamiliar with Nuxt, I used GitHub Copilot as much as I can.
Because of that I probably left some unused code, comments or maybe even some bugs. In a real-world scenario, I would
have taken more time to ensure the code quality and remove any unnecessary parts. Also because it's a test I did not use
environment variables, only if I had to. In a real-world application, I would have used them to manage secrets and configurations.

__Styling:__
I limited the styling to the component level. Under typical conditions, I would likely have approached even that using a design system methodology, such as atomic design. And since we’re using a monorepo, I probably would have extracted the components into a separate package to improve reusability.

__TODOS:__
At some places I indicated with a "TODO" what would be my next step toward a production ready solution. You can search for this 

### Applications:

For back-end I used a simple Express.js application that serves as an API for the front-end. The front-end is the
required Nuxt.js application with Tailwindcss.

### How to start the project:

1. Clone the repository.
2. Since it's a monorepo structure, you can run `npm install` in the root directory
3. To start the applications, simply run `npm run dev` in the root directory as well.
4. You can test the API by running the ```./run-tests.sh``` in the root directory.
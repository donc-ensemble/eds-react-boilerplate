# EDS React Boilerplate
Starter project for Adobe Helix.

Development with Typescript, Preact (with the React compatibility layer), AntDesign, and Zustand.

UI development with Storybook.

Build powered by Webpack and Babel.

Code quality powered by ESLint, Prettier, Jest, and @testing-library/react.

## Environments
- Preview: https://main--{repo}--{owner}.aem.page/
- Live: https://main--{repo}--{owner}.aem.live/

## Installation

In the root directory, run:

```sh
npm install
```

to set up common packages.

In the `react` subdirectory, run:

```sh
npm install
```

to install the React-specific dependencies and development tools.

## Code quality

Run

```sh
npm run lint:fix
npm run format:fix
npm run test
```

to fix linting and formatting issues, and to run tests.

**Note:** The pre-commit hooks and CI/CD pipelines will run these commands automatically. If there
are issues with the code style, the commit will be rejected.

## Local development

1. Create a new repository based on the `eds-react-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
3. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
4. Start AEM Proxy: In the root directory, run `aem up` (opens your browser at `http://localhost:3000`)
5. Start the development server: In the `react` subdirectory, run `npm run watch`.
# eds-react-boilerplate

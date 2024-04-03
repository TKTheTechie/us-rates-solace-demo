# rates-ui-and-simulator

A market data client that acts as a blotter to consume Rates Market Data. In addition, there is also a simulator that simulates market data events.



## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.


## Accessing the simulator and the UI

The simulator can be accessed by hitting the endpoint http://[host:port]/ and the simulator can be accessed http://[host:port]/simulator 
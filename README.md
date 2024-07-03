# `@zenchain/zazen`

This [Metamask snap](https://metamask.io/snaps/), Zazen, is intended to store validator cloud access keys in an encrypted, secure manner within Metamask. In the future, it may be used to store other types of data. This snap was forked from the [MetaMask manage-state example snap](https://github.com/MetaMask/snaps/tree/main/packages/examples/packages/manage-state) at [version 2.2.2](https://github.com/MetaMask/snaps/releases/tag/v39.0.0).

## Snap manifest

> **Note**: Using `snap_manageState` requires the `snap_manageState` permissions. Refer to [the documentation](https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate) for more information.

Along with other permissions, the manifest of this snap includes the `snap_manageState` permission:

```json
{
  "initialPermissions": {
    "snap_manageState": {}
  }
}
```

This permission does not require any additional configuration.

## Snap usage

The state is stored in the snap using the following structure:

```ts
type State = {
  staking: {
    nodeCloudAccessKeys: {
      onFinality: {
        accessKey: string;
        secretKey: string;
      };
    };
  };
};
```

This snap exposes an `onRpcRequest` handler, which supports the following JSON-RPC methods:

- `setState` - Set the state to the provided parameters. This assumes the new state is an object using the above structure. The state is always stored encrypted.
- `getState` - Get the state from the snap. This returns the current state if one is set, or a default state otherwise. The state from the encrypted store is always retrieved.
- `clearState` - Reset the state to the default state. The state from the encrypted store is always cleared.

Encrypted storage requires MetaMask to be unlocked.

For more information, you can refer to [the end-to-end tests](./src/index.test.ts).

## Running the Snap Locally

### Prerequisites

Make sure you have `nvm` (Node Version Manager) installed. If not, you can install it by following the instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).

### Without Docker

1. **Install the correct Node.js version:**

   ```sh
   nvm install
   nvm use
   ```

   This will use the Node.js version specified in the `.nvmrc` file.

2. **Install the dependencies:**

   ```sh
   yarn install
   ```

3. **Build the project:**

   ```sh
   yarn build
   ```

4. **Start the Snap:**

   ```sh
   yarn start
   ```

5. **Run tests:**

   ```sh
   yarn test
   ```

### With Docker

You can also build and run this snap locally using Docker.

1. **Build the Docker image**

   Navigate to the directory containing the `Dockerfile` and run:

   ```sh
   docker build -t zazen-snap .
   ```

2. **Run the Docker container**

   ```sh
   docker run -d -p 8081:8081 zazen-snap
   ```

This command will run the container and map port `8081` of the container to port `8081` of your host machine, allowing you to access the snap locally for testing.

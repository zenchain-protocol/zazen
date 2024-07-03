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
- `getState` - Get the state from the snap. This returns the current state if one is set, or a default state otherwise. The method always retrieves state from the encrypted store.
- `clearState` - Reset the state to the default state. The method always retrieves state from the encrypted store.

Interacting with encrypted storage requires MetaMask to be unlocked.

For more information, you can refer to [the end-to-end tests](./src/index.test.ts).

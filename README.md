# `@zenchain/zazen`

This [Metamask snap](https://metamask.io/snaps/), Zazen, is intended to store validator cloud access keys in an encrypted, secure manner within Metamask. In the future, it may be used to store other types of data. This snap was forked from the [MetaMask manage-state example snap](https://github.com/MetaMask/snaps/tree/main/packages/examples/packages/manage-state) at version 2.2.2.

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
  items: string[];
};
```

This snap exposes an `onRpcRequest` handler, which supports the following JSON-RPC methods:

- `setState` - Set the state to the provided params. This assumes the new state is an object using the above structure, but for simplicity, this is not actually validated within the snap.
- `getState` - Get the state from the snap. This returns the current state if one is set, or a default state otherwise.
- `clearState` - Reset the state to the default state.

Each of the methods also takes an `encrypted` parameter. This parameter can be used to choose between using encrypted or unencrypted storage. Encrypted storage requires MetaMask to be unlocked, unencrypted storage does not.

For more information, you can refer to [the end-to-end tests](./src/index.test.ts).

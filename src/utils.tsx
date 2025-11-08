import { ManageStateOperation } from '@metamask/snaps-sdk';
import { Box, Text, Heading } from "@metamask/snaps-sdk/jsx";

export type State = {
  staking: {
    nodeCloudAccessKeys: {
      onFinality: {
        accessKey: string;
        secretKey: string;
        workspaceId: string;
      };
    };
  };
};

const DEFAULT_STATE: State = {
  staking: {
    nodeCloudAccessKeys: {
      onFinality: {
        accessKey: '',
        secretKey: '',
        workspaceId: '',
      },
    },
  },
};

/**
 * Get the current state of the snap. If the snap does not have state, the
 * {@link DEFAULT_STATE} is returned instead.
 *
 * This uses the `snap_manageState` JSON-RPC method to get the state.
 *
 * @param encrypted - An optional flag to indicate whether to use encrypted storage or not, defaults to true.
 * @returns The current state of the snap.
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export async function getState(encrypted: boolean = true): Promise<State> {
  const state = await snap.request({
    method: 'snap_manageState',
    params: {
      operation: ManageStateOperation.GetState,
      encrypted,
    },
  });

  return (state as State | null) ?? DEFAULT_STATE;
}

/**
 * Set the state of the snap. This will overwrite the current state.
 *
 * This uses the `snap_manageState` JSON-RPC method to set the state. The state
 * is encrypted with the user's secret recovery phrase and stored in the user's
 * browser.
 *
 * @param newState - The new state of the snap.
 * @param encrypted - An optional flag to indicate whether to use encrypted storage or not, defaults to true.
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export async function setState(newState: State, encrypted: boolean = true) {
  const result = await snap.request({
    method:"snap_dialog",
    params: {
      type: "confirmation",
      content:  (
        <Box>
          <Heading>Save your OnFinality keys</Heading>
        <Text>The ZenChain Node Station app would like to save your OnFinality keys in your MetaMask wallet's encrypted storage. Your keys will remain securely encrypted on your device, protected by the security of your MetaMask wallet. Your keys will be used to authenticate with OnFinality, allowing the Node Station app to configure your node and tell you its status. Your keys are never sent to ZenChain or any third party.</Text>
      </Box>
  )
    }
  });
  if (result === true) {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.UpdateState,
        newState,
        encrypted,
      },
    });
  }
}

/**
 * Clear the state of the snap. This will set the state to the
 * {@link DEFAULT_STATE}.
 *
 * This uses the `snap_manageState` JSON-RPC method to clear the state.
 *
 * @param encrypted - An optional flag to indicate whether to use encrypted storage or not, defaults to true.
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export async function clearState(encrypted: boolean = true) {
  const result = await snap.request({
    method:"snap_dialog",
    params: {
      type: "confirmation",
      content:  (
        <Box>
          <Heading>Delete your OnFinality keys</Heading>
        <Text>The ZenChain Node Station app would like to permanently delete your OnFinality keys from your MetaMask wallet's encrypted storage. Although your OnFinality keys are securely encrypted in your wallet, we still recommend deleting them when they will no longer be used by the ZenChain Node Station app.</Text>
        </Box>
  )
}
});
  if (result === true) {
    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: ManageStateOperation.ClearState,
        encrypted,
      },
    });
  }
}

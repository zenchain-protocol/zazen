import {
  MethodNotFoundError,
  type OnRpcRequestHandler,
} from '@metamask/snaps-sdk';

import type { SetStateParams } from './types';
import { getState, setState, clearState } from './utils';

/**
 * Handle incoming JSON-RPC requests from the dapp, sent through the
 * `wallet_invokeSnap` method. This handler handles three methods:
 *
 * - `setState`: Set the state of the snap. This stores the state in the
 * extension's local storage, so it will persist across requests.
 * - `getState`: Get the state of the snap. This retrieves the state from the
 * extension's local storage, or returns the default state if no state has been
 * set.
 * - `clearState`: Clear the state of the snap. This removes the state from the
 * extension's local storage, so the next `getState` request will return the
 * default state.
 *
 * Each of the methods alway use encrypted storage.
 *
 * @param params - The request parameters.
 * @param params.request - The JSON-RPC request object.
 * @returns The JSON-RPC response.
 * @see https://docs.metamask.io/snaps/reference/exports/#onrpcrequest
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#wallet_invokesnap
 * @see https://docs.metamask.io/snaps/reference/rpc-api/#snap_managestate
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'setState': {
      const params = request.params as SetStateParams;
      const currentState = await getState(true);

      const newState = {
        ...currentState,
        staking: {
          ...currentState.staking,
          nodeCloudAccessKeys: {
            ...currentState.staking?.nodeCloudAccessKeys,
            onFinality: {
              accessKey: params.staking.nodeCloudAccessKeys.onFinality.accessKey,
              secretKey: params.staking.nodeCloudAccessKeys.onFinality.secretKey,
            },
          },
        },
      };

      await setState(newState, true);
      return true;
    }

    case 'getState': {
      return await getState(true);
    }

    case 'clearState': {
      await clearState(true);
      return true;
    }

    default:
      throw new MethodNotFoundError({ method: request.method });
  }
};

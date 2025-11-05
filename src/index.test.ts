import { expect } from '@jest/globals';
import {installSnap, SnapConfirmationInterface, SnapInterfaceActions} from '@metamask/snaps-jest';

describe('onRpcRequest', () => {
  it('throws an error if the requested method does not exist', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32601,
      message: 'The method does not exist / is not available.',
      stack: expect.any(String),
      data: {
        method: 'foo',
        cause: null,
      },
    });
  });

  describe('setState', () => {
    it('sets the state to the params', async () => {
      const { request } = await installSnap();

      const params = {
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'fooAccessKey',
                secretKey: 'fooSecretKey',
                workspaceId: 'fooWorkspaceId',
              },
            },
          },
        },
      };

      const response = request(params);
      const ui = await response.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await ui.ok();
      expect(await response).toRespondWith(true);

      const state = await request({
        method: 'getState',
      });

      expect(state).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: 'fooAccessKey',
              secretKey: 'fooSecretKey',
              workspaceId: 'fooWorkspaceId',
            },
          },
        },
      });
    });

    it('does not set the state when the user cancels the confirmation', async () => {
      const { request } = await installSnap();

      const params = {
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'barAccessKey',
                secretKey: 'barSecretKey',
                workspaceId: 'barWorkspaceId',
              },
            },
          },
        },
      };

      const response = request(params);
      const ui = await response.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await ui.cancel();
      await response;

      const state = await request({
        method: 'getState',
      });

      expect(state).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: '',
              secretKey: '',
              workspaceId: '',
            },
          },
        },
      });
    });
  });

  describe('getState', () => {
    it('returns the state if no state has been set', async () => {
      const { request } = await installSnap();

      const response = await request({
        method: 'getState',
      });

      expect(response).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: '',
              secretKey: '',
              workspaceId: '',
            },
          },
        },
      });
    });

    it('returns the state', async () => {
      const { request } = await installSnap();

      const setStateParams = {
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'fooAccessKey',
                secretKey: 'fooSecretKey',
                workspaceId: 'fooWorkspaceId',
              },
            },
          },
        },
      };

      const setStateResponse = request(setStateParams);
      const setStateUi = await setStateResponse.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await setStateUi.ok();
      await setStateResponse;

      const response = await request({
        method: 'getState',
      });

      expect(response).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: 'fooAccessKey',
              secretKey: 'fooSecretKey',
              workspaceId: 'fooWorkspaceId',
            },
          },
        },
      });
    });
  });

  describe('clearState', () => {
    it('clears the state', async () => {
      const { request } = await installSnap();

      const setStateResponse = request({
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'fooAccessKey',
                secretKey: 'fooSecretKey',
                workspaceId: 'fooWorkspaceId',
              },
            },
          },
        },
      });
      const setStateUi = await setStateResponse.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await setStateUi.ok();
      await setStateResponse;

      const clearResponse = request({
        method: 'clearState',
      });
      const clearUi = await clearResponse.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await clearUi.ok();
      expect(await clearResponse).toRespondWith(true);

      expect(
        await request({
          method: 'getState',
        }),
      ).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: '',
              secretKey: '',
              workspaceId: '',
            },
          },
        },
      });
    });

    it('does not clear the state when the user cancels the confirmation', async () => {
      const { request } = await installSnap();

      const setStateResponse = request({
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'bazAccessKey',
                secretKey: 'bazSecretKey',
                workspaceId: 'bazWorkspaceId',
              },
            },
          },
        },
      });
      const setStateUi = await setStateResponse.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await setStateUi.ok();
      await setStateResponse;

      const clearResponse = request({
        method: 'clearState',
      });
      const clearUi = await clearResponse.getInterface() as (SnapConfirmationInterface & SnapInterfaceActions);
      await clearUi.cancel();
      await clearResponse;

      const state = await request({
        method: 'getState',
      });

      expect(state).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: 'bazAccessKey',
              secretKey: 'bazSecretKey',
              workspaceId: 'bazWorkspaceId',
            },
          },
        },
      });
    });
  });
});

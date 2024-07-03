import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';

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
              },
            },
          },
        },
      };

      expect(await request(params)).toRespondWith(true);

      const state = await request({
        method: 'getState',
      });

      expect(state).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: 'fooAccessKey',
              secretKey: 'fooSecretKey',
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
              },
            },
          },
        },
      };

      await request(setStateParams);

      const response = await request({
        method: 'getState',
      });

      expect(response).toRespondWith({
        staking: {
          nodeCloudAccessKeys: {
            onFinality: {
              accessKey: 'fooAccessKey',
              secretKey: 'fooSecretKey',
            },
          },
        },
      });
    });
  });

  describe('clearState', () => {
    it('clears the state', async () => {
      const { request } = await installSnap();

      await request({
        method: 'setState',
        params: {
          staking: {
            nodeCloudAccessKeys: {
              onFinality: {
                accessKey: 'fooAccessKey',
                secretKey: 'fooSecretKey',
              },
            },
          },
        },
      });

      expect(
        await request({
          method: 'clearState',
        }),
      ).toRespondWith(true);

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
            },
          },
        },
      });
    });
  });
});

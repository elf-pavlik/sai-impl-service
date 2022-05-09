import { AgentsHandler, HttpSolidContext, SessionManager } from "../../src";
import { jest } from '@jest/globals';

import 'dotenv/config';

jest.mock('../../src/sai-session-storage', () => {
  const originalModule = jest.requireActual('../../src/sai-session-storage') as object;

  return {
    ...originalModule,
    SessionManager: jest.fn(() => {
      return {
        getFromUuid: jest.fn()
      }
    })
  }
})

import { AuthorizationAgent } from '@janeirodigital/interop-authorization-agent';
import { INTEROP } from '@janeirodigital/interop-namespaces';
import { InMemoryStorage } from "@inrupt/solid-client-authn-node";
import { HttpHandlerRequest } from "@digita-ai/handlersjs-http";

const uuid = '75340942-4225-42e0-b897-5f36278166de';

const manager = jest.mocked(new SessionManager(new InMemoryStorage()))
let agentsHandler: AgentsHandler


beforeEach(() => {
  manager.getFromUuid.mockReset();
  agentsHandler = new AgentsHandler(manager)
})

describe('unauthenticated request', () => {
  test('should contain valid Client ID Document', (done) => {
    const request = {
      headers: {},
      parameters: { uuid }
    } as unknown as HttpHandlerRequest
    const ctx = { request } as HttpSolidContext;

    agentsHandler.handle(ctx).subscribe(response => {
      expect(response.body.client_id).toContain(uuid);
      expect(response.body.redirect_uris).toContain(process.env.REDIRECT_URL);
      expect(response.body.grant_types).toEqual(expect.arrayContaining(['authorization_code', 'refresh_token']));
      done()
    })
  });
});

describe('authenticated request', () => {
  const webId = 'https://user.example/'
  const clientId = 'https://client.example/'

  test('application registration discovery', (done) => {
    const applicationRegistrationIri = 'https://some.example/application-registration'

    manager.getFromUuid.mockImplementation(async (id) => {
      expect(id).toBe(uuid)
      return {
        webId,
        findApplicationRegistration: async (applicationId) => {
          expect(applicationId).toBe(clientId)
          return { iri: applicationRegistrationIri}
        }
      } as AuthorizationAgent
    })

    const request = {
      parameters: { uuid }
    } as unknown as HttpHandlerRequest
    const authn = {
      webId,
      clientId
    }
    const ctx = { request, authn } as HttpSolidContext;

    agentsHandler.handle(ctx).subscribe(response => {
      expect(response.headers.Link).toBe(`<${clientId}>; anchor="${applicationRegistrationIri}"; rel="${INTEROP.registeredAgent.value}"`)
      done()
    })
  });

  test('social agent registration discovery', (done) => {
    const differentWebId = 'https://different-user.example/'
    const socialAgentRegistrationIri = 'https://some.example/application-registration'

    manager.getFromUuid.mockImplementation(async (id) => {
      expect(id).toBe(uuid)
      return {
        webId,
        findSocialAgentRegistration: async (webid) => {
          expect(webid).toBe(differentWebId)
          return { iri: socialAgentRegistrationIri}
        }
      } as AuthorizationAgent
    })

    const request = {
      parameters: { uuid }
    } as unknown as HttpHandlerRequest
    const authn = {
      webId: differentWebId,
      clientId
    }
    const ctx = { request, authn } as HttpSolidContext;

    agentsHandler.handle(ctx).subscribe(response => {
      expect(response.headers.Link).toBe(`<${clientId}>; anchor="${socialAgentRegistrationIri}"; rel="${INTEROP.registeredAgent.value}"`)
      done()
    })
  });

  test('should respond 401 when applicationId from token is undefined', (done) => {
    const request = {
      parameters: { uuid }
    } as unknown as HttpHandlerRequest
    const authn = { webId }
    const ctx = { request, authn } as HttpSolidContext;
    agentsHandler.handle(ctx).subscribe(response => {
      expect(response.status).toBe(401)
      done()
    })
  });
});

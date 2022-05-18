import { from, map, Observable, of } from "rxjs";
import { HttpHandler, HttpHandlerResponse } from "@digita-ai/handlersjs-http";
import { getSessionFromStorage } from "@inrupt/solid-client-authn-node";
import { SessionManager } from "../session-manager";
import { HttpSolidContext } from "../models/http-solid-context";
import { frontendUrl, uuid2agentUrl, agentRedirectUrl } from "../url-templates";

export class LoginRedirectHandler extends HttpHandler {
  constructor(
    private sessionManager: SessionManager
  ) {
    super();
    console.log("LoginRedirectHandler::constructor");
  }
  handle(context: HttpSolidContext): Observable<HttpHandlerResponse> {
    console.log("LoginRedirectHandler::handle");
    return from(this.handleAsync(context))

  }

  private async handleAsync(context: HttpSolidContext): Promise<HttpHandlerResponse> {
    const agentUrl = uuid2agentUrl(context.request.parameters!.uuid)
    const webId = await this.sessionManager.getWebId(agentUrl)

    if (!webId) {
      return { body: {}, status: 404, headers: {} };
    }

    const oidcSession = await getSessionFromStorage(webId, this.sessionManager.storage);

    if (!oidcSession) {
      return { body: {}, status: 500, headers: {} };
    }

    // TODO test if proper url is passed
    await oidcSession.handleIncomingRedirect(agentRedirectUrl(agentUrl) + context.request.url.pathname);

    if (oidcSession.info.isLoggedIn && oidcSession.info.webId) {
      return { body: {}, status: 300, headers: { location: frontendUrl } };
    }

    // TODO unreachable point?
    return { body: {}, status: 500, headers: {} };
  }
}

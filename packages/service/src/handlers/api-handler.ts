import { from, Observable } from "rxjs";
import { BadRequestHttpError, HttpHandler, HttpHandlerResponse } from "@digita-ai/handlersjs-http";
import { getLoggerFor } from '@digita-ai/handlersjs-logging';
import { RequestMessageTypes, ResponseMessageTypes } from "@janeirodigital/sai-api-messages";
import type { IQueue } from "@janeirodigital/sai-server-interfaces";
import {
  getApplications, getDescriptions, recordAuthorization,
  getDataRegistries, getSocialAgents, addSocialAgent, getUnregisteredApplicationProfile
} from '../services';
import type { SaiContext } from "../models/http-solid-context";
import { validateContentType } from "../utils/http-validators";
import { IReciprocalRegistrationsJobData } from "../models/jobs";
import { getResource, shareResource } from "../services/data-instance";

export class ApiHandler extends HttpHandler {
  private logger = getLoggerFor(this, 5, 5);

  constructor(
    private queue: IQueue
  ) {
    super();
    this.logger.info("LoginHandler::constructor");
  }


  async handleAsync (context: SaiContext): Promise<HttpHandlerResponse> {
    validateContentType(context, 'application/json');
    const body = context.request.body
    if (!body) {
      throw new BadRequestHttpError('body is required')
    }
    switch(body.type) {
      case RequestMessageTypes.APPLICATIONS_REQUEST:
        return { body: {
          type: ResponseMessageTypes.APPLICATIONS_RESPONSE,
          payload: await getApplications(context.saiSession)
        }, status: 200, headers: {} }
      case RequestMessageTypes.APPLICATION_PROFILE: {
        const { id } = body;
        return { body: {
          type: ResponseMessageTypes.APPLICATION_PROFILE,
          payload: await getUnregisteredApplicationProfile(context.saiSession, id),
          }, status: 200, headers: {} }
        }
      case RequestMessageTypes.SOCIAL_AGENTS_REQUEST:
        return { body: {
          type: ResponseMessageTypes.SOCIAL_AGENTS_RESPONSE,
          payload: await getSocialAgents(context.saiSession)
         }, status: 200, headers: {} }
      case RequestMessageTypes.ADD_SOCIAL_AGENT_REQUEST: {
        const { webId, label, note } = body
        const socialAgent = await addSocialAgent(context.saiSession, { webId, label, note })
        const jobData: IReciprocalRegistrationsJobData = { webId: context.saiSession.webId, registeredAgent: socialAgent.id}
        await this.queue.add(jobData)
        return { body: {
          type: ResponseMessageTypes.SOCIAL_AGENT_RESPONSE,
          payload: socialAgent
         }, status: 200, headers: {} }
        }
      case RequestMessageTypes.DATA_REGISTRIES_REQUEST:
        return { body: {
          type: ResponseMessageTypes.DATA_REGISTRIES_RESPONSE,
          payload: await getDataRegistries(context.saiSession, body.lang)
         }, status: 200, headers: {} }
      case RequestMessageTypes.DESCRIPTIONS_REQUEST:
        return { body: {
          type: ResponseMessageTypes.DESCRIPTIONS_RESPONSE,
          payload: await getDescriptions(body.applicationId, body.lang, context.saiSession)
        }, status: 200, headers: {} }
      case RequestMessageTypes.APPLICATION_AUTHORIZATION:
        return { body: {
          type: ResponseMessageTypes.APPLICATION_AUTHORIZATION_REGISTERED,
          payload: await recordAuthorization(body.authorization, context.saiSession)
        }, status: 200, headers: {} }
      case RequestMessageTypes.RESOURCE_REQUEST: {
        const { id, lang } = body;
        return { body: {
          type: ResponseMessageTypes.RESOURCE_RESPONSE,
          payload: await getResource(context.saiSession, id, lang)
         }, status: 200, headers: {} }
        }
      case RequestMessageTypes.SHARE_AUTHORIZATION: {
        const { shareAuthorization } = body;
        return { body: {
          type: ResponseMessageTypes.SHARE_AUTHORIZATION_CONFIRMATION,
          payload: await shareResource(context.saiSession, shareAuthorization)
          }, status: 200, headers: {} }
        }
      default:
        throw new BadRequestHttpError()
    }
  }

  handle(context: SaiContext): Observable<HttpHandlerResponse> {
    this.logger.info("ApiHandler::handle");
    return from(this.handleAsync(context))
  }
}

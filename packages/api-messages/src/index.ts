export const RequestMessageTypes = {
  APPLICATIONS_REQUEST: '[APPLICATION PROFILES] Application Profiles Requested',
  SOCIAL_AGENTS_REQUEST: '[SOCIAL AGENTS] Application Profiles Requested',
  RESOURCE_REQUEST: '[RESOURCE] Resource Requested',
  DESCRIPTIONS_REQUEST: '[DESCRIPTIONS] Descriptions Requested',
  DATA_REGISTRIES_REQUEST: '[DATA_REGISTRIES] Data Registries Requested',
  ADD_SOCIAL_AGENT_REQUEST: '[SOCIAL AGENTS] Data Registries Requested',
  APPLICATION_AUTHORIZATION: '[APPLICATION] Authorization submitted',
  APPLICATION_PROFILE: 'ApplicationProfileRequest',
  SHARE_AUTHORIZATION: '[RESOURCE] Share Authorization Requested',
} as const

export const ResponseMessageTypes = {
  APPLICATIONS_RESPONSE: '[APPLICATION PROFILES] Application Profiles Received',
  SOCIAL_AGENTS_RESPONSE: '[SOCIAL AGENTS PROFILES] Application Profiles Received',
  RESOURCE_RESPONSE: '[RESOURCE] Resource Received',
  DESCRIPTIONS_RESPONSE: '[DESCRIPTIONS] Descriptions Received',
  DATA_REGISTRIES_RESPONSE: '[DATA_REGISTRIES] Data Registries Received',
  SOCIAL_AGENT_RESPONSE: '[SOCIAL AGENTS] Social Agent Received',
  APPLICATION_AUTHORIZATION_REGISTERED: '[APPLICATION] Authorization registered',
  APPLICATION_PROFILE: 'ApplicationProfileResponse',
  SHARE_AUTHORIZATION_CONFIRMATION: '[RESOURCE] Share Authorization Confirmed',
} as const

type TResponseMessage = typeof ResponseMessageTypes

type TResponseMessages = keyof TResponseMessage

type VResponseMessages = TResponseMessage[TResponseMessages]

// type ResponseKeys = keyof typeof ResponseMessageTypes

export type ResponseMessage = ApplicationsResponseMessage | SocialAgentsResponseMessage |
  SocialAgentResponseMessage | ResourceResponseMessage | DataRegistriesResponseMessage | DescriptionsResponseMessage |
  ApplicationAuthorizationResponseMessage | ShareAuthorizationResponseMessage

type Payloads = Application[] | SocialAgent[] | SocialAgent | DataRegistry[] | AuthorizationData | AccessAuthorization | Resource | ShareAuthorizationConfirmation

type IResponseMessage<T extends VResponseMessages, P extends Payloads> = {
  type: T,
  payload: P
}

export type ApplicationsResponseMessage = IResponseMessage<typeof ResponseMessageTypes.APPLICATIONS_RESPONSE, Application[]>;
export type SocialAgentsResponseMessage = IResponseMessage<typeof ResponseMessageTypes.SOCIAL_AGENTS_RESPONSE, SocialAgent[]>;
export type SocialAgentResponseMessage = IResponseMessage<typeof ResponseMessageTypes.SOCIAL_AGENT_RESPONSE, SocialAgent>;
export type ResourceResponseMessage = IResponseMessage<typeof ResponseMessageTypes.RESOURCE_RESPONSE, Resource>;
export type DataRegistriesResponseMessage = IResponseMessage<typeof ResponseMessageTypes.DATA_REGISTRIES_RESPONSE, DataRegistry[]>;
export type DescriptionsResponseMessage = IResponseMessage<typeof ResponseMessageTypes.DESCRIPTIONS_RESPONSE, AuthorizationData>;
export type ApplicationAuthorizationResponseMessage = IResponseMessage<typeof ResponseMessageTypes.APPLICATION_AUTHORIZATION_REGISTERED, AccessAuthorization>;
export type ShareAuthorizationResponseMessage = IResponseMessage<typeof ResponseMessageTypes.SHARE_AUTHORIZATION_CONFIRMATION, ShareAuthorizationConfirmation>;


type Responses = ApplicationAuthorizationResponse | SocialAgentsResponse | ResourceResponseMessage | SocialAgentResponse | DataRegistriesResponse | DescriptionsResponse | ApplicationAuthorizationResponse | ShareAuthorizationResponse

export type IRI = string;

export type ShapeTree = {
  id: IRI,
  label: string,
  references?: ShapeTree[]
};

abstract class MessageBase {
  stringify (): string {
    return JSON.stringify(this)
  }
}

export class ApplicationsRequest extends MessageBase {
  public type = RequestMessageTypes.APPLICATIONS_REQUEST
}

function validateType(messageType: VResponseMessages, requiredType: VResponseMessages) {
  if (messageType !== requiredType) {
    throw new Error(`Invalid message type! Expected: ${messageType}, received: ${requiredType}`)
  }
}
export class ApplicationsResponse {
  public type = ResponseMessageTypes.APPLICATIONS_RESPONSE
  public payload: Application[]

  constructor(message: ApplicationsResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class SocialAgentsRequest extends MessageBase {
  public type = RequestMessageTypes.SOCIAL_AGENTS_REQUEST
}

export class SocialAgentsResponse {
  public type = ResponseMessageTypes.SOCIAL_AGENTS_RESPONSE
  public payload: SocialAgent[]

  constructor(message: SocialAgentsResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class AddSocialAgentRequest extends MessageBase {
  public type = RequestMessageTypes.ADD_SOCIAL_AGENT_REQUEST

  constructor(public webId: IRI, public label: string, public note?: string) {
    super()
  }
}

export class SocialAgentResponse {
  public type = ResponseMessageTypes.SOCIAL_AGENT_RESPONSE
  public payload: SocialAgent

  constructor(message: SocialAgentResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class ResourceRequest extends MessageBase {
  public type = RequestMessageTypes.RESOURCE_REQUEST

  constructor(public id: IRI, private lang: string) {
    super()
  }
}

export class ResourceResponse {
  public type = ResponseMessageTypes.RESOURCE_RESPONSE
  public payload: Resource

  constructor(message: ResourceResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class DataRegistriesRequest extends MessageBase {
  public type = RequestMessageTypes.DATA_REGISTRIES_REQUEST

  constructor(private lang: string) {
    super()
  }
}

export class DataRegistriesResponse {
  public type = ResponseMessageTypes.DATA_REGISTRIES_RESPONSE
  public payload: DataRegistry[]

  constructor(message: DataRegistriesResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class DescriptionsRequest extends MessageBase {
  public type = RequestMessageTypes.DESCRIPTIONS_REQUEST

  constructor(private applicationId: IRI, private lang: string) {
    super()
  }
}

export class DescriptionsResponse {
  public type = ResponseMessageTypes.DESCRIPTIONS_RESPONSE
  public payload: AuthorizationData

  constructor(message: DescriptionsResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class ApplicationAuthorizationRequest extends MessageBase {
  public type = RequestMessageTypes.APPLICATION_AUTHORIZATION

  constructor(private authorization: Authorization) {
    super()
  }
}

export class ApplicationAuthorizationResponse {

  public type = ResponseMessageTypes.APPLICATION_AUTHORIZATION_REGISTERED
  public payload: AccessAuthorization

  constructor(message: ApplicationAuthorizationResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}

export class ShareAuthorizationRequest extends MessageBase {
  public type = RequestMessageTypes.SHARE_AUTHORIZATION

  constructor(private shareAuthorization: ShareAuthorization) {
    super()
  }
}

export class ShareAuthorizationResponse {

  public type = ResponseMessageTypes.SHARE_AUTHORIZATION_CONFIRMATION
  public payload: ShareAuthorizationConfirmation

  constructor(message: ShareAuthorizationResponseMessage) {
    validateType(message.type, this.type);
    this.payload = message.payload
  }
}


export type Request = ApplicationsRequest | SocialAgentsRequest | AddSocialAgentRequest | ResourceRequest |
  DataRegistriesRequest | DescriptionsRequest | ApplicationAuthorizationRequest | ShareAuthorizationRequest

export interface UniqueId {
  id: IRI;
}

export interface Application extends UniqueId {
  name: string;
  logo?: IRI;
  authorizationDate: string; // interop:registeredAt
  lastUpdateDate?: string;    // interop:updatedAt
  accessNeedGroup: IRI    // interop:hasAccessNeedGroup
}

export interface SocialAgent extends UniqueId {
  label: string;
  note?: string;
  authorizationDate: string; // interop:registeredAt
  lastUpdateDate?: string;    // interop:updatedAt
}

export interface DataRegistration extends UniqueId {
  shapeTree: IRI;
  dataRegistry: IRI;
  count: number;
  label?: string; // TODO label should be ensured
}

export interface DataRegistry extends UniqueId {
  registrations: DataRegistration[]
}

export interface Description extends UniqueId {
  label: string;
  description?: string;
  needId: IRI;
};


export interface AccessNeedGroup extends UniqueId {
  label: string;
  description?: string;
  required?: boolean;
  needs: AccessNeed[];
}

export interface AccessNeed extends UniqueId {
  label: string;
  description?: string;
  required?: boolean;
  // IRIs for the access modes
  access: Array<IRI>;
  shapeTree: ShapeTree;
  children?: AccessNeed[]
  parent?: IRI
}

export interface AuthorizationData extends UniqueId {
  accessNeedGroup: AccessNeedGroup
}

export interface DataAuthorization {
  accessNeed: IRI,
  scope: string,
  dataOwner?: IRI,
  dataRegistration?: IRI,
  dataInstances?: IRI[]
}

export interface BaseAuthorization {
  grantee: IRI;
  accessNeedGroup: IRI;
}
export interface GrantedAuthorization extends BaseAuthorization {
  dataAuthorizations: DataAuthorization[]
  granted: true;
}

export interface DeniedAuthorization extends BaseAuthorization {
  granted: false
  dataAuthorizations?: never;
}

export type Authorization = GrantedAuthorization | DeniedAuthorization

export interface AccessAuthorization extends UniqueId, GrantedAuthorization {
  callbackEndpoint?: IRI;
}
export type ChildResource = {
  shapeTree: {
      id: string;
      label: string;
      count: number;
  }
}
export type Resource = {
  id: IRI;
  label?: string;
  shapeTree: ShapeTree;
  children: ChildResource[];
};

export type ShareAuthorization = {
  resource: IRI;
  applicationId: IRI;
  agents: IRI[];
  children: IRI[];
}

export interface ShareAuthorizationConfirmation {
  callbackEndpoint: IRI;
}

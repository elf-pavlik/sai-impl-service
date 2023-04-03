import { AuthorizationAgent } from "@janeirodigital/interop-authorization-agent";
import { Resource, ShareAuthorization, ShareAuthorizationConfirmation } from "@janeirodigital/sai-api-messages";

export const getResource = async (saiSession: AuthorizationAgent, iri: string, lang: string): Promise<Resource | undefined> => {
    const resource = await saiSession.factory.readable.dataInstance(iri, lang)
    if (!resource) throw new Error(`Resource not found: ${iri}`)
    return {
        id: resource.iri,
        label: resource.label,
        shapeTree: {
            id: resource.shapeTree.iri,
            label: resource.shapeTree.label
        },
        accessGrantedTo: (await saiSession.findSocialAgentsWithAccess(resource.iri)).map(({agent}) => agent),
        children: resource.children.map(child => ({
            shapeTree: {
                id: child.shapeTree.iri,
                label: child.shapeTree.label
            },
            count: child.count
        }))
    }
};

export const shareResource = async (saiSession: AuthorizationAgent, shareAuthorization: ShareAuthorization): Promise<ShareAuthorizationConfirmation | undefined> => {
    await saiSession.shareDataInstance(shareAuthorization)
    const clientIdDocument = await saiSession.factory.readable.clientIdDocument(shareAuthorization.applicationId);
    return {
        callbackEndpoint: clientIdDocument.callbackEndpoint!
    }
};

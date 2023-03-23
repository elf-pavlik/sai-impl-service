import { AuthorizationAgent } from "@janeirodigital/interop-authorization-agent";
import { Resource, ShareAuthorization, ShareAuthorizationConfirmation } from "@janeirodigital/sai-api-messages";

export const getResource = async (saiSession: AuthorizationAgent, iri: string, lang: string): Promise<Resource | undefined> => {
    const resource = await saiSession.factory.readable.dataInstance(iri, lang)
    if (!resource) throw new Error(`Resource not found: ${iri}`)
    return {
        id: resource.iri,
        label: resource.label,
        shapeTree: {
            id: resource.dataRegistration!.shapeTree!.iri,
            label: resource.dataRegistration!.shapeTree!.descriptions[lang]!.label,
        },
        accessGrantedTo: (await saiSession.findSocialAgentsWithAccess(resource.iri)).map(({agent}) => agent),
        children: await Promise.all(
            resource.dataRegistration!.shapeTree!.references.map(async reference => ({
                count: resource.getObjectsArray(reference.viaPredicate).length,
                shapeTree: {
                    id: reference.shapeTree,
                    label: (await saiSession.factory.readable.shapeTree(reference.shapeTree, lang)).descriptions[lang]!.label,
                }
            }))
        )
    }
};

export const shareResource = async (saiSession: AuthorizationAgent, shareAuthorization: ShareAuthorization): Promise<ShareAuthorizationConfirmation | undefined> => {
    await saiSession.shareDataInstance(shareAuthorization)
    const clientIdDocument = await saiSession.factory.readable.clientIdDocument(shareAuthorization.applicationId);
    return {
        callbackEndpoint: clientIdDocument.callbackEndpoint!
    }
};

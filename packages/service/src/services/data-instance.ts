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
        children: await Promise.all(
            resource.dataRegistration!.shapeTree!.references.map(async reference => ({
                shapeTree: {
                    id: reference.shapeTree,
                    label: (await saiSession.factory.readable.shapeTree(reference.shapeTree, lang)).descriptions[lang]!.label,
                    count: resource.getObjectsArray(reference.viaPredicate).length
                }
            }))
        )
    }
};

export const shareResource = async (saiSession: AuthorizationAgent, shareAuthorization: ShareAuthorization): Promise<ShareAuthorizationConfirmation | undefined> => {
    const clientIdDocument = await saiSession.factory.readable.clientIdDocument(shareAuthorization.applicationId);
    return {
        callbackEndpoint: clientIdDocument.callbackEndpoint!
    }
};

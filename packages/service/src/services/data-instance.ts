import { AuthorizationAgent } from "@janeirodigital/interop-authorization-agent";
import { Resource } from "@janeirodigital/sai-api-messages";
import { RDFS } from "@janeirodigital/interop-namespaces";


export const getResource = async (saiSession: AuthorizationAgent, iri: string): Promise<Resource | undefined> => {
    const resource = await saiSession.factory.readable.resource(iri)
    if (!resource) throw new Error(`Resource not found: ${iri}`)
    return {
        id: resource.iri,
        // TODO: generalize based on shape tree information about label property
        label: resource.getObject(RDFS.label)?.value
    }
};

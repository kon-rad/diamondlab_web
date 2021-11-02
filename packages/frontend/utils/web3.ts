import { ExternalProvider, getNetwork, JsonRpcFetchFunc } from "@ethersproject/providers"

export function getProvider(provider: ExternalProvider | JsonRpcFetchFunc) {
    return new Web3Provider(provider)
}
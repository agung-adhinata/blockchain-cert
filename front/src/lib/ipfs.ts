import { PinataSDK } from 'pinata-web3';


export const ipfs =  new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
    pinataGatewayKey: import.meta.env.VITE_PINATA_GATEWAY_KEY,
});
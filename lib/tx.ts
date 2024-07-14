import {ethers} from 'ethers';
import constants from '../constants';

export const sendTx = (proof: string, pubKeyHash: string, value: number) => {
  console.log('proof: ', proof);

  const NGROK_URL = 'https://cd0e-213-214-42-42.ngrok-free.app';

  const request = {
    account: constants.safeAddresses.ethereum.sepolia,
    signer: pubKeyHash,
    proof: proof,
    txData: {
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      value: ethers.utils.parseEther(value.toString()).toHexString(),
      data: '0x00',
    },
  };

  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request),
  };

  fetch(NGROK_URL + '/sign', requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok');
    })
    .then(data => console.log(data));
};

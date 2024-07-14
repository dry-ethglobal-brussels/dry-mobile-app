import {BigNumber, ethers} from 'ethers';
import constants from '../constants';
import {useEffect, useState} from 'react';
import numeral from 'numeral';

export function getProvider(chainName: string, network: string) {
  const {rpc, chainId} = ((constants.chains as any)[chainName] as any)[
    network
  ] as {
    rpc: string;
    chainId: number;
  };
  return new ethers.providers.JsonRpcProvider(rpc, {
    name: chainName,
    chainId,
  });
}

export function getBalance(
  chainName: string,
  network: string,
  address: string,
) {
  const provider = getProvider(chainName, network);
  return provider.getBalance(address);
}

export function getFormattedBalance(
  chainName: string,
  network: string,
  address: string,
) {
  return getBalance(chainName, network, address).then(balance =>
    ethers.utils.formatEther(balance),
  );
}

export function getEthUsdPrice() {
  const provider = getProvider('ethereum', 'sepolia');
  return provider.getEtherPrice();
}

// ==== HOOKS ====

export function useBalance(address: string) {
  const [balance, setBalance] = useState<ethers.BigNumber>(BigNumber.from(0));
  useEffect(() => {
    setBalance(BigNumber.from(0));
    for (const [chainName, networks] of Object.entries(constants.chains)) {
      for (const network of Object.keys(networks)) {
        getBalance(chainName, network, address)
          .then(balance => {
            setBalance(prev => prev.add(balance));
          })
          .catch(err => {});
      }
    }
  }, [address]);
  return balance;
}

export function useFormattedBalance(address: string) {
  const balance = useBalance(address);
  return balance ? ethers.utils.formatEther(balance) : '';
}

export function useEthUsdPrice() {
  const [price, setPrice] = useState<number>();
  useEffect(() => {
    getEthUsdPrice()
      .then(price => {
        console.log('price', price);
        setPrice(price);
      })
      .catch(err => {});
  }, []);
  return price;
}

export function useFormattedBalanceUsd(address: string) {
  const balance = useBalance(address);
  const price = useEthUsdPrice();
  return balance && price
    ? numeral(BigInt(ethers.utils.formatEther(balance)) * BigInt(price)).format(
        '0,0.00',
      )
    : '';
}

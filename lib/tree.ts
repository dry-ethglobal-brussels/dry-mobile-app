import {pad} from 'viem';

import AsyncStorage from '@react-native-async-storage/async-storage';
import IMT from './imt';
import {keccak256, sha256, AbiCoder} from 'ethers/lib/utils';
import {p256} from '@noble/curves/p256';
import {signMessage} from './secure-enclave';
import {generateProof} from './noir';
import circuit from '../circuits/dry/target/circuit.json';
import json2toml from 'json2toml';

const abiCoder = new AbiCoder();

export function hexToBytes(hex: string): number[] {
  let formattedHex = hex;
  if (formattedHex.startsWith('0x')) {
    formattedHex = formattedHex.slice(2);
  }
  return formattedHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
}
export function bytesToHex(bytes: number[]): string {
  return bytes.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

const privateKeys: Uint8Array[] = [
  new Uint8Array([
    50, 194, 13, 104, 255, 160, 58, 79, 28, 157, 100, 23, 82, 92, 84, 106, 142,
    76, 231, 85, 67, 68, 18, 110, 92, 229, 41, 182, 130, 171, 22, 173,
  ]),
  new Uint8Array([
    117, 35, 123, 26, 211, 211, 133, 161, 0, 223, 173, 178, 203, 6, 63, 51, 90,
    57, 214, 180, 239, 227, 187, 85, 185, 221, 76, 241, 11, 57, 57, 123,
  ]),
  new Uint8Array([
    61, 198, 24, 52, 125, 60, 144, 66, 247, 86, 215, 26, 28, 84, 40, 196, 17,
    25, 252, 245, 246, 187, 102, 96, 24, 132, 145, 241, 170, 46, 172, 238,
  ]),
];

export function bytesToBigInt(bytes: number[]): bigint {
  return BigInt(
    `0x${bytes.map(b => b.toString(16).padStart(2, '0')).join('')}`,
  );
}

export function bigIntToBytes(int: bigint): number[] {
  const hex = int.toString(16);
  return hex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
}

export const getExecHash = async (
  account: string,
  to: string,
  value: string,
  data: string,
  chainId: string,
): Promise<string> => {
  return keccak256(
    abiCoder.encode(
      ['address', 'address', 'uint', 'bytes', 'uint256'],
      [account, to, value, data, chainId],
    ),
  );
};

const getSigner = async (index: number) => {
  // let privateKey = secp256r1.utils.randomPrivateKey();
  let privateKey = privateKeys[index];
  let publicKey = p256.getPublicKey(privateKey, false);
  let x = publicKey.slice(1).slice(0, 32);
  let y = publicKey.slice(1).slice(32);

  const message = await getExecHash(
    '0x4d8152386Ce4aC935d8Cfed93Ae06077025eAd9E',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x2540be400',
    '0x00',
    '11155111',
  );
  let msgHash = sha256(message);
  let malleableSignature = p256.sign(msgHash.slice(2), privateKey);

  const bSig = hexToBytes(`0x${malleableSignature.toCompactHex()}`);
  if (bSig.length !== 64) {
    throw new Error('Invalid signature length');
  }
  const bR = bSig.slice(0, 32);
  const bS = bSig.slice(32);

  // Avoid malleability. Ensure low S (<= N/2 where N is the curve order)
  const r = bytesToBigInt(Array.from(bR));
  let s = bytesToBigInt(Array.from(bS));
  const n = BigInt(
    '0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551',
  );
  if (s > n / 2n) {
    s = n - s;
  }

  const signature = p256.Signature.fromCompact(
    Uint8Array.from([...bigIntToBytes(r), ...bigIntToBytes(s)]),
  );
  return {
    toml: {
      x: [...x],
      y: [...y],
      msgHash: [...hexToBytes(msgHash)],
      signature: [...signature.toCompactRawBytes()],
    },
    recover: p256.verify(signature, msgHash.slice(2), publicKey),
    nullifier: sha256(publicKey.slice(1)),
  };
};

const hash = (childNodes: bigint[]) => {
  const arr: `0x${string}` = pad(
    `0x${childNodes.map(c => c.toString(16).replace('0x', '')).join('')}`,
    {dir: 'right', size: 64},
  );
  return sha256(arr);
};

export async function getProof() {
  const tree = new IMT(hash, 3, BigInt('0x00'));

  let {toml, nullifier} = await getSigner(0);
  tree.insert(nullifier);

  ({toml, nullifier} = await getSigner(1));
  tree.insert(nullifier);

  ({toml, nullifier} = await getSigner(2));
  tree.insert(nullifier);

  const mtProof = tree.createProof(2);
  let indices = 2;
  console.log('indices', indices);
  let root = [...hexToBytes(mtProof.root)];
  let paths = mtProof.siblings.map(sibling => [
    ...pad(hexToBytes(`0x${BigInt(sibling).toString(16)}`)),
  ]);
  const tomlToWrite = json2toml({...toml, indices, root, paths});

  const {
    fullProof,
    proof: _proof,
    vkey: _vkey,
  } = await generateProof(
    {
      x: toml.x,
      y: toml.y,
      msgHash: toml.msgHash,
      signature: toml.signature,
      indices: indices,
      root,
      paths,
    },
    // We load the circuit at the same time as the proof generation
    // but you can use the preloadCircuit function to load it beforehand
    circuit,
    'plonk',
  );
  return {_proof, pubKeyHash: p256.getPublicKey(privateKeys[2], false)};

  // writeFileSync(resolve('circuit/Prover.toml'), tomlToWrite);

  // console.log('Wrote Prover.toml');
  // console.log('Proving');
  // execSync('cd circuit && nargo prove');
}

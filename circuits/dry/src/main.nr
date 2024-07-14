use dep::std::ecdsa_secp256r1::verify_signature;
use dep::std::hash::poseidon2::Poseidon2::hash;
use dep::std::hash::sha256;

global TREE_SIZE: u64 = 3;

fn hasher(leaves: [[u8; 32]; 2]) -> [u8; 32] {
    let mut leaves_arr : [u8; 64] = [0; 64];
    for i in 0..64 {
        leaves_arr[i] = leaves[0][i];
    }
    for i in 0..32 {
        leaves_arr[i + 32] = leaves[1][i];
    }
    let hashed : [u8; 32] = sha256(leaves_arr);
    // let to_field = array_to_field(hashed);
    hashed
}

struct MerkleTree {
    root: [u8; 32],
    hasher: fn([[u8; 32]; 2]) -> [u8; 32],
}

impl MerkleTree {
    fn default(root: [u8; 32], hasher: fn([[u8; 32]; 2]) -> [u8; 32]) -> Self {
        Self { root, hasher }
    }

    fn root(self, leaf: [u8; 32], indices: Field, siblings: ([[u8; 32]; TREE_SIZE])) -> [u8; 32] {
        let index_bits = indices.to_le_bits(TREE_SIZE as u32);
        let mut node = leaf;
        for i in 0..siblings.len() {
            let sibling = siblings[i];
            let mut left = sibling;
            let mut right = node;
            if index_bits[i] == 0 {
                left = node;
                right = sibling;
            }
            node = (self.hasher)([left, right]);
        }
        node
    }
}

fn main(
    x: [u8; 32],
    y: [u8; 32],
    msgHash: pub [u8; 32],
    signature: [u8; 64], // paths: [Field; TREE_SIZE],
    indices: Field,
    root: pub [u8; 32],
    paths: [[u8; 32]; TREE_SIZE]
) {
    let valid_signature = verify_signature(x, y, signature, msgHash);
    assert(valid_signature);

    let mut pubkey_array : [u8; 64] = [0; 64];
    for i in 0..32 {
        pubkey_array[i] = x[i];
    }
    for i in 0..32 {
        pubkey_array[i + 32] = y[i];
    }

    let leaf = sha256(pubkey_array);
    let mut mt = MerkleTree::default(root, hasher);
    assert(root == mt.root(leaf, indices, paths));
}

// #[test]
// fn test_leaf_0() {
//     let x = [
//         76, 17, 158, 237, 203, 160, 38, 154, 203, 149, 113, 248, 51, 105, 244, 158, 143, 147, 214, 208, 188, 57, 163, 208, 217, 91, 30, 162, 45, 193, 126, 73
//     ];
//     let y = [
//         133, 130, 84, 24, 183, 146, 184, 42, 128, 217, 4, 6, 231, 202, 180, 86, 187, 249, 10, 58, 133, 202, 137, 87, 38, 204, 76, 104, 218, 230, 131, 234
//     ];
//     let hashed = [
//         58, 47, 28, 212, 12, 195, 224, 102, 123, 153, 145, 57, 46, 31, 172, 198, 1, 223, 56, 171, 37, 251, 187, 20, 62, 243, 212, 89, 238, 217, 47, 192
//     ];
//     let signature = [
//         228, 182, 231, 59, 213, 234, 131, 131, 111, 218, 136, 227, 65, 7, 8, 194, 156, 195, 96, 240, 207, 144, 49, 156, 4, 165, 126, 204, 59, 42, 182, 27, 117, 29, 214, 155, 229, 241, 193, 47, 125, 80, 49, 224, 232, 44, 205, 186, 159, 215, 235, 81, 67, 8, 197, 220, 251, 204, 172, 5, 42, 75, 80, 216
//     ];
//     let indices = 2;
//     let root = [
//         190, 201, 237, 135, 149, 86, 192, 236, 201, 206, 230, 136, 98, 52, 247, 66, 177, 119, 237, 9, 159, 201, 25, 182, 44, 152, 201, 162, 91, 227, 185, 53
//     ];
//     let paths = [
//         [
//             0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
//         ], [
//             161, 64, 48, 85, 152, 96, 120, 83, 141, 176, 123, 236, 156, 237, 246, 201, 6, 136, 228, 89, 172, 193, 244, 110, 59, 43, 155, 44, 240, 167, 203, 225
//         ], [
//             4, 169, 209, 181, 95, 199, 170, 225, 149, 252, 234, 65, 74, 110, 243, 37, 191, 11, 89, 90, 218, 76, 238, 211, 210, 20, 231, 96, 0, 7, 123, 129
//         ]
//     ];

//     main(x, y, hashed, signature, indices, root, paths);
// }

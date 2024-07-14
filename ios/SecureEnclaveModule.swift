//
//  SecureEnclaveKeyManager.swift
//  Daimo
//
//  Created by Nalin Bhardwaj.
//  Copyright © 2023 Daimo. All rights reserved.
//
//  SecureEnclaveKeyManager is our interface to the Secure Enclave.
//  It creates keypairs which will never leave the enclave
//  and lets you sign and verify messages with them.

import CryptoKit
import LocalAuthentication
import Foundation

extension String: Error {}

@objc(SecureEnclaveModule)
class SecureEnclaveModule: NSObject {
    let store = GenericPasswordStore()

    internal func createContext(usage: String?, duration: TimeInterval) -> LAContext {
        let context = LAContext()
        context.touchIDAuthenticationAllowableReuseDuration = duration
        context.localizedReason = usage ?? "Unexpected usage"
        return context
    }

    internal func getSigningPrivkeyWithContext(accountName: String, usage: String?, duration: TimeInterval = 0) throws -> SecureEnclave.P256.Signing.PrivateKey {
        let readSigningPrivkey: SecureEnclave.P256.Signing.PrivateKey? = try self.store.readKey(account: accountName)
        
        /** signingPrivKey is an opaque object that represents the actual private key inside the enclave */
        guard let signingPrivkey = readSigningPrivkey else {
            throw "No key found"
        }

        let context = createContext(usage: usage, duration: duration)
        let key = try SecureEnclave.P256.Signing.PrivateKey(dataRepresentation: signingPrivkey.dataRepresentation, authenticationContext: context)
        return key
    }

    internal func createSigningPrivkey(accountName: String) throws {
        var accessError: Unmanaged<CFError>?
        let accessControl = SecAccessControlCreateWithFlags(
            kCFAllocatorDefault,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            [.privateKeyUsage, .userPresence],
            &accessError
        )!
      

        if let error = accessError {
            throw error.takeRetainedValue() as Error
        }
        
        let signingPrivkey = try SecureEnclave.P256.Signing.PrivateKey(accessControl: accessControl)
        
        // Since the key is authed by the enclave and the keychain only stores an encrypted blob
        // representation, we do not auth userPresence for keychain reads. Additionally, it would
        // be bad UX to prompt the user for presence/auth twice (seperately for keychain reads and
        // on Secure Enclave signing).
        try self.store.storeKey(signingPrivkey, account: accountName, requireUserPresence: true)
    }


    @objc(fetchPublicKey:resolve:reject:)
    func fetchPublicKey(_ accountName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let readSigningPrivkey: SecureEnclave.P256.Signing.PrivateKey? = try self.store.readKey(account: accountName)
            guard let signingPrivkey = readSigningPrivkey else {
                reject("NO_KEY_FOUND", "No key found", nil)
                return;
            }
          resolve(["publicKey": signingPrivkey.publicKey.derRepresentation.hexEncodedString()])
        } catch {
            reject("PUBLIC_KEY_FETCH_ERROR", "Error fetching public key", error)
        }
    }

    @objc(createKeyPair:resolve:reject:)
    func createKeyPair(_ accountName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            try createSigningPrivkey(accountName: accountName as String)
            let signingPrivkey = try getSigningPrivkeyWithContext(accountName: accountName as String, usage: "Complete Face ID to register")
            resolve(["publicKey": signingPrivkey.publicKey.derRepresentation.hexEncodedString()])
        } catch {
            reject("KEYPAIR_CREATION_ERROR", "Error creating keypair", error)
        }
    }

    @objc(deleteKeyPair:resolve:reject:)
    func deleteKeyPair(_ accountName: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            try self.store.deleteKey(account: accountName as String)
            resolve(["success": true])
        } catch {
            reject("KEYPAIR_DELETION_ERROR", "Error deleting keypair", error)
        }
    }

    @objc(sign:message:resolve:reject:)
    func sign(_ accountName: String, message: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let message = message.data(using: .utf8)!
          let key = try getSigningPrivkeyWithContext(accountName: accountName as String, usage: "Complete Face ID to sign the message")
            let signature = try key.signature(for: message)
            resolve(["signature": signature.derRepresentation.hexEncodedString()])
        } catch {
            reject("SIGNING_ERROR", "Error signing message", error)
        }
    }
}

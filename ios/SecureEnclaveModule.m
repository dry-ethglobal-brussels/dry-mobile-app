//
//  SecureEnclave.m
//  DryMobileApp
//
//  Created by Theo Madzou on 21/02/2024.
//

#import <Foundation/Foundation.h>
#import <LocalAuthentication/LocalAuthentication.h>
#import <Security/Security.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTConvert.h>

@interface RCT_EXTERN_MODULE(SecureEnclaveModule, NSObject)

// fetchPublicKey
RCT_EXTERN_METHOD(fetchPublicKey:(NSString)accountName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

// createKeyPair
RCT_EXTERN_METHOD(createKeyPair:(NSString)accountName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

// deleteKeyPair
RCT_EXTERN_METHOD(deleteKeyPair:(NSString)accountName
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

// sign
RCT_EXTERN_METHOD(sign:(NSString)accountName
                  message:(NSString)message
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)

- (id)init
{
  if (self = [super init]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(cameraChanged:)
                                             name:@"AVCaptureDeviceDidStartRunn ingNotification"
                                             object:nil];
  }
  return self;
}

// Please add this one
+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

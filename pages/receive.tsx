/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import numeral from 'numeral';
import constants from '../constants';
import IconButton from '../components/IconButton';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
  LogIn,
  LogOut,
} from '@tamagui/lucide-icons';
import QRCode from 'react-native-qrcode-svg';
import {formatAddress} from '../lib';

const SAFE_ADDRESS = constants.safeAddresses.ethereum.sepolia;

export default function Receive() {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <MainLayout
      statusBarStyle="light-content"
      statusBarBackgroundColor="#1F2937">
      <View style={{}}>
        <View
          style={{
            paddingVertical: 20,
            // Dark blue gray
            backgroundColor: '#1F2937',
            alignItems: 'center',
            paddingBottom: 30,
            flexDirection: 'row',
          }}>
          <IconButton
            style={{backgroundColor: 'transparent'}}
            icon={<ArrowLeft color="white" />}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Text
            style={{
              fontSize: 16,
              textTransform: 'uppercase',
              color: 'white',
            }}>
            Receive funds
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: 40,
          paddingHorizontal: 20,
          gap: 20,
          backgroundColor: 'white',
          alignItems: 'center',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: -20,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: constants.primaryColor,
          }}>
          Let people scan your QR Code below
        </Text>
        <QRCode size={200} value={SAFE_ADDRESS} />
        <Text
          style={{
            fontSize: 14,
            color: constants.lightTextColor,
            marginTop: 20,
          }}>
          or copy your address below
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: constants.backgroundColor,
            paddingVertical: 15,
            paddingHorizontal: 25,
            borderRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: constants.lightTextColor,
            }}>
            {formatAddress(SAFE_ADDRESS, true)}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#00000011',
              padding: 10,
              borderRadius: 10,
            }}>
            <Copy
              color={constants.primaryColor}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </MainLayout>
  );
}

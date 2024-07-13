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
import {useNavigation} from '@react-navigation/native';
import numeral from 'numeral';
import constants from '../constants';
import IconButton from '../components/IconButton';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  LogIn,
  LogOut,
} from '@tamagui/lucide-icons';

const NETWORKS = [
  {
    image: require('../assets/images/chains/ethereum.png'),
    name: 'Ethereum',
    subname: 'Sepolia',
  },
  {
    image: require('../assets/images/chains/polygon.png'),
    name: 'Polygon',
    subname: 'Mumbai',
  },
  {
    image: require('../assets/images/chains/scroll.jpeg'),
    name: 'Scroll',
    subname: 'Sepolia',
  },
  {
    image: require('../assets/images/chains/gnosis.png'),
    name: 'Gnosis',
    subname: 'Chiado',
  },
  {
    image: require('../assets/images/chains/linea.png'),
    name: 'Linea',
    subname: 'Sepolia',
  },
];

function Network({
  image,
  name,
  subname,
}: {
  image: ImageSourcePropType;
  name: string;
  subname: string;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Currencies', {
          network: name,
          subnetwork: subname,
        });
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 20,
          backgroundColor: constants.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 20,
          overflow: 'hidden',
        }}>
        <Image
          style={{
            width: 50,
            height: 50,
            resizeMode: 'cover',
          }}
          source={image}
        />
      </View>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: constants.primaryColor,
          }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: constants.lightTextColor,
          }}>
          {subname}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function Networks() {
  const navigation = useNavigation();

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
            Choose a network
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          paddingVertical: 30,
          paddingHorizontal: 20,
          gap: 20,
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: -20,
        }}>
        {NETWORKS.map((network, index) => (
          <Network key={index} {...network} />
        ))}
      </View>
    </MainLayout>
  );
}

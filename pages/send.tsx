/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import {useNavigation, useRoute} from '@react-navigation/native';
import numeral from 'numeral';
import constants from '../constants';
import IconButton from '../components/IconButton';
import {ArrowLeft} from '@tamagui/lucide-icons';
import {signMessage} from '../lib/secure-enclave';

export default function Send() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState<string>();
  const route = useRoute();

  const onConfirm = async () => {
    try {
      if (!amount) {
        Alert.alert('Please enter an amount');
        return;
      }
      const signature = await signMessage(
        JSON.stringify({
          amount,
          currency: (route.params as any)?.currency,
          network: (route.params as any)?.network,
          subnetwork: (route.params as any)?.subnetwork,
        }),
      );
      console.log(signature);
      setTimeout(() => {
        Alert.alert('Transaction initiated!');
      }, 1000);
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

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
            paddingBottom: 30,
          }}>
          <View
            style={{
              alignItems: 'center',
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
              Set the amount to send
            </Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: constants.lightTextColor,
              paddingHorizontal: 20,
              marginBottom: -30,
              textAlign: 'right',
            }}>
            {(route.params as any)?.currency}
          </Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={text => {
              setAmount(text);
            }}
            value={amount?.toString()}
            style={{
              // Slowly reduce the font size with each character
              fontSize: Math.max(
                100 - Math.max(((amount?.length || 0) - 5) * 10, 0),
                20,
              ),
              lineHeight:
                Math.max(
                  100 - Math.max(((amount?.length || 0) - 5) * 10, 0),
                  20,
                ) * 1.2,
              padding: 20,
              marginTop: 5,
              color: 'white',
              flex: 1,
              textAlign: 'right',
            }}
            placeholder="0.00"
            placeholderTextColor={constants.lightTextColor}
          />
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
        <Button onPress={onConfirm}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'white',
            }}>
            Confirm
          </Text>
        </Button>
      </View>
    </MainLayout>
  );
}

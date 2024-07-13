/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {Fragment} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import constants from '../constants';

export default function MainLayout({
  children,
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor = 'white',
  canGoBack = false,
}: {
  children: React.ReactNode;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  canGoBack?: boolean;
}): JSX.Element {
  const navigation = useNavigation();
  return (
    <Fragment>
      <SafeAreaView
        style={{flex: 0, backgroundColor: statusBarBackgroundColor}}
      />
      <SafeAreaView style={{backgroundColor: 'transparent'}}>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarBackgroundColor}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{
            backgroundColor: 'white',
            height: '100%',
          }}>
          <View>
            {canGoBack && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 30,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center', gap: 9}}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Image
                    source={require('../assets/images/icons/arrow-left.png')}
                    resizeMode="contain"
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                  <Text
                    style={{color: '#195AFE', fontSize: 14, fontWeight: '700'}}>
                    Back
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {children}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
}

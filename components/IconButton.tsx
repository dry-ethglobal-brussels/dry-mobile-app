/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {TouchableOpacity} from 'react-native';
import constants from '../constants';

export default function IconButton({
  icon,
  theme = 'main',
  disabled,
  ...props
}: {
  icon: any;
  theme?: 'main' | 'secondary';
  disabled?: boolean;
} & React.ComponentProps<typeof TouchableOpacity>): JSX.Element {
  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      style={{
        width: 50,
        height: 50,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme === 'main' ? 'white' : '#ffffffaa',
        ...(props.style as any),
      }}>
      {icon}
    </TouchableOpacity>
  );
}

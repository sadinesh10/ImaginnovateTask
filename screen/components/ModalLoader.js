import React from 'react';
import {ActivityIndicator, Modal, View} from 'react-native';
import {useTheme} from 'react-native-paper';

export const ModalLoader = props => {
  const {colors} = useTheme();
  const {
    show = false,
    dimLights = 0.6,
  } = props;
  return (
    <Modal transparent={true} animationType="none" visible={show}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `rgba(0,0,0,${dimLights})`,
        }}>
        <View
          style={{
            padding: 13,
            backgroundColor: `white`,
            borderRadius: 13,
          }}>
          <ActivityIndicator animating={show} color="orange" size="large" />
        </View>
      </View>
    </Modal>
  );
};

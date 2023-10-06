import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from 'react-native-vector-icons';

export default function App() {
  const [temPermissao, setTemPermissao] = useState(null);
  const [tipo, setTipo] = useState(Camera.Constants.Type.back);
  const [fotoTirada, setFotoTirada] = useState(null);
  const cameraRef = useRef(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === 'granted');
    })();
  }, []);

  const tiraFoto = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      setFotoTirada(data.uri);
      setAberto(true);
    }
  };

  if (temPermissao === null) {
    return <Text>Tem permissão null</Text>;
  }

  if (temPermissao === false) {
    return <Text>Acesso Negado</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={tipo}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
            }}
            onPress={() => {
              setTipo(
                tipo === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="retweet" size={23} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#121212',
          margin: 20,
          borderRadius: 12,
          height: 50,
        }}
        onPress={tiraFoto}
      >
        <FontAwesome name="camera" size={23} color="#FFF" />
      </TouchableOpacity>

      {fotoTirada && (
        <Modal
          animationType='slide'
          transparent={false}
          visible={aberto}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 20,
            }}
          >
            <TouchableOpacity
              style={{
                margin: 10,
              }}
              onPress={() => {
                setAberto(false);
              }}
            >
              <FontAwesome name="window-close" size={50} color='#FF0000' />
            </TouchableOpacity>
            <Image
              style={{
                width: '100%',
                height: 450,
                borderRadius: 20,
              }}
              source={{ uri: fotoTirada }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

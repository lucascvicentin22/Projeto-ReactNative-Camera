import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from 'react-native-vector-icons';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [temPermissao, setTemPermissao] = useState(null);
  const [tipo, setTipo] = useState(Camera.Constants.Type.back);
  const [fotoTirada, setFotoTirada] = useState(null);
  const cameraRef = useRef(null);
  const [aberto, setAberto] = useState(false);
  const [imagensGaleria, setImagensGaleria] = useState([])

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissao(status === 'granted');
    })();

    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if(status === 'granted'){
        const media = await MediaLibrary.getAssetsAsync({ first : 10 })
        setImagensGaleria(media.assets)
      }
    })()
  }, []);

  const tiraFoto = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      setFotoTirada(data.uri);
      setAberto(true);
    }
  };

  const salvaFoto = async () => {
    MediaLibrary.saveToLibraryAsync(fotoTirada)
    alert('Foto salva com sucesso')
    setAberto(false)
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
            <View style={{ flex : 1, flexDirection : 'row' }}>
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

            <TouchableOpacity style={{margin : 10}} onPress={salvaFoto}>
                  <FontAwesome name='upload' size={50} color='#121212' />
            </TouchableOpacity>
            </View>
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
      <View style={styles.galeriaContainer} >
              <Text style={styles.galeriaTitulo}>Ultimas Fotos</Text>

              <FlatList 
                  data={imagensGaleria}
                  horizontal 
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item } ) => (
                    <Image 
                        source={{uri : item.uri}}
                        style={styles.imagemGaleria}
                    />
                  )}
              />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  galeriaContainer : {
    margin : 10
  },
  galeriaTitulo : {
    fontWeight : 'bold',
    fontSize : 18,
    marginBottom : 10
  },
  imagemGaleria : {
    width : 100,
    height : 100,
    marginRight : 10,
    borderRadius : 5
  }
});
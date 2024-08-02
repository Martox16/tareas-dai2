import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarea, setTarea] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tareas, setTareas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const tareasGuardadas = await AsyncStorage.getItem('tareas');
        if (tareasGuardadas) {
          setTareas(JSON.parse(tareasGuardadas));
        }
      } catch (error) {
    
      }
    };
    cargarTareas();
  }, []);

  useEffect(() => {
    const guardarTareas = async () => {
      try {
        await AsyncStorage.setItem('tareas', JSON.stringify(tareas));
      } catch (error) {
      
      }
    };
    guardarTareas();
  }, [tareas]);

  const agregarTarea = () => {
    const tareaExistente = tareas.find(t => t.texto === tarea);
    if (tareaExistente) {
      Alert.alert('Error', 'Esa tarea ya existe', [
        {
          text: 'Continuar',
        }
        ]);
      return;
    }
    if (tarea.length > 0) {
      setTareas([...tareas, { texto: tarea, descripcion: descripcion, completada: false }]);
      setTarea('');
      setDescripcion('');
      setModalVisible(false);
    }
   
  ;
  };

  const alternarCompletada = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas[index].completada = !nuevasTareas[index].completada;
    setTareas(nuevasTareas);
  };

  const eliminarTarea = (index) => {
    const nuevasTareas = [...tareas];
    nuevasTareas.splice(index, 1);
    setTareas(nuevasTareas);
    
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.textoEncabezado}>Checklist 😍</Text>
      </View>
      <View style={styles.contenedorBienvenida}>
        <Text style={styles.textoBienvenida}>¡Bienvenido a tareas pendientes!</Text>
      </View>
      <View style={styles.contenedorInput}>
        <Button title="Agregar" onPress={() => setModalVisible(true)} />
      </View>
      <FlatList
        data={tareas}
        renderItem={({ item, index }) => (
          <View style={styles.contenedorTarea}>
            <Text style={[styles.tarea, item.completada && styles.tareaCompletada]}>
              {item.texto}
            </Text>
            {item.descripcion ? <Text style={styles.descripcion}>{item.descripcion}</Text> : null}
            <View style={styles.contenedorBotones}>
              <TouchableOpacity onPress={() => alternarCompletada(index)}>
                <Text style={styles.botonCompletar}>{item.completada ? 'Desmarcar' : 'Completar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarTarea(index)}>
                <Text style={styles.botonEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Tarea</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Nombre de la tarea..."
              value={tarea}
              onChangeText={setTarea}
            />
            <TextInput
              style={styles.inputModal}
              placeholder="Descripción (opcional)..."
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <View style={styles.modalButtons}>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.buttonAdd]} onPress={agregarTarea}>
                <Text style={styles.textStyle}>Agregar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#fff',
  },
  encabezado: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    height: 150,
    alignItems: 'center',
    paddingTop: 30,
  },
  textoEncabezado: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  contenedorBienvenida: {
    padding: 20,
    alignItems: 'center',
  },
  textoBienvenida: {
    fontSize: 18,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contenedorInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flex: 1,
    marginRight: 10,
  },
  contenedorTarea: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tarea: {
    fontSize: 18,
  },
  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  contenedorBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botonCompletar: {
    color: 'green',
    marginRight: 10,
  },
  botonEliminar: {
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
  },
  inputModal: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#f44336',
  },
  buttonAdd: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

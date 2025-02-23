import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface HorizontalSelectionModalProps<T> {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: T) => void;
  values: T[];
  getLabel: (value: T) => string;
  title: string;
}

function HorizontalSelectionModal<T>({
  visible,
  onClose,
  onSelect,
  values,
  getLabel,
  title
}: HorizontalSelectionModalProps<T>) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>{title}</Text>
        <ScrollView>
          <View style={styles.itemContainer}>
            {values.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => {
                    onSelect(item);
                    onClose();
                    }}
                >
                    <Text style={styles.text}>{getLabel(item)}</Text>
                </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemWrapper: {
    margin: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#BFA58A',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    margin: 5,
  },
  text: {
    fontSize: 16,
  }
});

export default HorizontalSelectionModal;

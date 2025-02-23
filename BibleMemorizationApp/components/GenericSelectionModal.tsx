import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';

interface GenericSelectionModalProps<T> {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: T) => void;
  values: T[];
  t: (key: string) => string;
  getLabel: (value: T) => string;
  headerLabels?: string[];
  maxPerColumn?: number;
  title?: string;
  renderItem: (item: T, onSelect: (value: T) => void) => React.ReactNode;
}

function GenericSelectionModal<T>({
  visible,
  onClose,
  onSelect,
  values = [],
  t,
  getLabel,
  headerLabels,
  maxPerColumn = 20,
  title
}: GenericSelectionModalProps<T>) {
  const screenWidth = Dimensions.get('window').width;
  const numColumns = Math.ceil(values.length / maxPerColumn);
  const columnWidth = (screenWidth - 60) / numColumns; // 40 for padding

  const renderColumn = ({ item, index }: { item: T[]; index: number }) => (
    <View style={[styles.column, {width: columnWidth}]}>
      {headerLabels && headerLabels[index] && (
        <Text style={styles.columnHeader}>{headerLabels[index]}</Text>
      )}
      {item.map((value, i) => (
        <TouchableOpacity
            key={i}
            style={styles.item}
            onPress={() => {
                onSelect(value);
                onClose();
            }}
        >
        <Text style={styles.itemText}>{getLabel(value)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const columnData = Array.from({ length: numColumns }, (_, i) => 
    values.slice(i * maxPerColumn, (i + 1) * maxPerColumn)
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
    <SafeAreaView style={styles.modalSafeArea}>
      <View style={styles.modalView}>
        {title && <Text style={styles.modalTitle}>{title}</Text>}
        <FlatList
            data={columnData}
            renderItem={renderColumn}
            keyExtractor={(_, index) => index.toString()}
            numColumns={numColumns}
            contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalView: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20, // Add padding at the bottom
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    marginHorizontal: 5,
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  }
});

export default GenericSelectionModal;

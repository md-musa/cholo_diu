import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ScheduleTypeDropdown(props) {
  const { types, default: defaultType } = props;
  const [selectedType, setSelectedType] = useState(types[0]);
  const [open, setOpen] = useState(false);
  const [buttonLayout, setButtonLayout] = useState(null);
  const buttonRef = useRef(null);

  const openDropdown = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setButtonLayout({ x, y, width, height });
        setOpen(true);
      });
    }
  };

  return (
    <View style={{ zIndex: 1000 }}>
      {/* Dropdown Button */}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.button}
        onPress={openDropdown} // measure and open
      >
        <Text style={styles.buttonText}>{defaultType}</Text>
        <MaterialIcons name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      {buttonLayout && open && (
        <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setOpen(false)} // close on tap outside
          >
            <View
              style={[
                styles.dropdown,
                {
                  top: buttonLayout.y + buttonLayout.height, // below button
                  left: buttonLayout.x, // align left
                  width: buttonLayout.width, // same width as button
                },
              ]}
            >
              <FlatList
                data={types}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedType(item);
                      setOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#6366f1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

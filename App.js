import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [items, setItems] = useState([]);  
  const [text, setText] = useState("");    
  const [editingIndex, setEditingIndex] = useState(null);

  // Load items from storage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save items to storage whenever updated
  useEffect(() => {
    saveData();
  }, [items]);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("items", JSON.stringify(items));
    } catch (error) {
      console.log("Error saving data", error);
    }
  };

  

  const loadData = async () => {
    try {
      const storedItems = await AsyncStorage.getItem("items");
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.log("Error loading data", error);
    }
  };

  // Create or Update
  const addItem = () => {
    if (text.trim() === "") return;

    if (editingIndex !== null) {
      const updated = [...items];
      updated[editingIndex] = text;
      setItems(updated);
      setEditingIndex(null);
    } else {
      setItems([...items, text]);
    }
    setText("");
  };

  // Delete
  const deleteItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Edit
  const editItem = (index) => {
    setText(items[index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>CRUD with Local Storage</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter item"
        value={text}
        onChangeText={setText}
      />

      <Button title={editingIndex !== null ? "Update" : "Add"} onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>{item}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => editItem(index)} style={styles.edit}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteItem(index)} style={styles.delete}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  buttons: { flexDirection: "row" },
  edit: { marginRight: 10, backgroundColor: "#f0ad4e", padding: 5, borderRadius: 5 },
  delete: { backgroundColor: "#d9534f", padding: 5, borderRadius: 5 },
});

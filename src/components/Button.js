import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function Button({ title, outline, ...props }) {
  return (
    <TouchableOpacity
      {...props}
      style={outline ? styles.outline : styles.container}
    >
      <Text style={outline ? styles.textOutline : styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f23434",
  },
  outline: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#000",
    borderWidth: 3,
    borderColor: "#f23434",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  textOutline: {
    color: "#f23434",
    fontWeight: "bold",
    fontSize: 16,
  },
});

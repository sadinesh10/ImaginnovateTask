import React from "react";
import { Text, View, StyleSheet } from "react-native";
import WeatherGeter from "./screen/WeatherGeter";

const App = () => {
  return (
    <View style={styles.container}>
      <WeatherGeter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,            
    backgroundColor: '#FFFFFF', 
  },
});

export default App;

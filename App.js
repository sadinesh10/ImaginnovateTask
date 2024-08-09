import React from "react";
import { Text, View, StyleSheet } from "react-native";
import WeatherForeCasting from "./screen/WeatherForeCastting";

const App = () => {
  return (
    <View style={styles.container}>
      <WeatherForeCasting/>
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

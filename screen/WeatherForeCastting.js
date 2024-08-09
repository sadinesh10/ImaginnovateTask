import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Snackbar from 'react-native-snackbar';
import axios from 'axios';
import { ModalLoader } from './components/ModalLoader';

const WeatherForeCasting = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const appId = '1635890035cbba097fd5c26c8ea672a1';

  const fetchCoordinatesByLocationName = async () => {
    Keyboard.dismiss();
    if (!query.trim()) {
      Snackbar.show({
        text: 'Please enter a city name.',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }
  
    setLoading(true);
    setForecast([]);
  
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: query,
            appid: appId,
          },
        },
      );
  
      const data = response.data;
      console.log('Geocoding response data:', data);
  
      if (data.length > 0) {
        const { lat, lon } = data[0];
        fetchWeatherForecast(lat, lon);
      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherForecast = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat: lat,
            lon: lon,
            appid: appId,
          },
        }
      );

      const data = response.data;
      console.log('Forecast response data:', data);

      const groupedData = groupForecastByDate(data.list);
      setForecast(groupedData);
    } catch (error) {
      handleFetchError(error);
    }finally {
      setLoading(false);
    }
  };

  const groupForecastByDate = (list) => {
    const forecastByDate = {};

    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0]; 

      if (!forecastByDate[date]) {
        forecastByDate[date] = item;
      }
    });

    return Object.values(forecastByDate);
  };
  
  const handleFetchError = (error) => {
    if (error.response && error.response.status === 404) {
      Snackbar.show({
        text: 'City not found. Please check the name and try again.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      console.error('Error fetching weather data:', error);
      Snackbar.show({
        text: 'Failed to fetch weather data. Please try again.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const renderForecastTable = () => {
    if (!forecast || forecast.length === 0) {
      return <Text style={styles.noDataText}>No forecast data available</Text>;
    }

    return forecast.map((item, index) => (
      <View key={index} style={styles.forecastBlock}>
        <View style={styles.firstRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{formatDate(item.dt_txt)}</Text>
        </View>
        <View style={styles.secondRow}>
          <View style={{ alignSelf: 'center' }}>
            <Text style={styles.label}>Temperature</Text>
          </View>
        </View>

        <View style={styles.secondRow}>
          <View style={styles.rowHalf}>
            <Text style={styles.label}>Min</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.rowHalf}>
            <Text style={styles.label}>Max</Text>
          </View>
        </View>
        <View style={styles.secondRow}>
          <View style={styles.rowHalf}>
            <Text style={styles.value}>{item.main.temp_min}°K</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.rowHalf}>
            <Text style={styles.value}>{item.main.temp_max}°K</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHalf}>
            <Text style={styles.label}>Pressure</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.rowHalf}>
            <Text style={styles.value}>{item.main.pressure} hPa</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowHalf}>
            <Text style={styles.label}>Humidity</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.rowHalf}>
            <Text style={styles.value}>{item.main.humidity}%</Text>
          </View>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weather in Your City</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter city name"
          value={query}
          onChangeText={(value)=>{
            setQuery(value)
          }}
          placeholderTextColor="orange"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={fetchCoordinatesByLocationName}
          disabled={loading}>
          <AntDesign name="questioncircle" size={20} color="white" />
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ModalLoader show={loading} />
      <ScrollView style={styles.forecastContainer}>
        {renderForecastTable()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'orange',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'orange',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    width: 200,
    color: 'orange',
    fontSize: 16,
  },
  button: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  forecastContainer: {
    marginTop: 20,
    width: '90%',
  },
  forecastBlock: {
    marginBottom: 15,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
  },
  firstRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'skyblue',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
  rowHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: 'black',
    height: '150%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    fontSize: 16,
    color: 'black',
  },
  noDataText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default WeatherForeCasting;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import Viagens from "../services/sqlite/Viagens";
import * as yup from "yup";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const { width } = Dimensions.get("window");

export default function ViagensRegister({ route, navigation }) {
  const {
    currentUserId,
    currentVeiculoId,
    currentVeiculoPlaca,
    currentVeiculoDescricao,
  } = route.params;

  const [origemLocation, setOrigemLocation] = useState({
    latitude: null,
    longitude: null,
    name: null,
  });

  const [destinoLocation, setDestinoLocation] = useState({
    latitude: null,
    longitude: null,
    name: null,
  });

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (granted) {
        const { coords } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } else {
        Alert.alert(
          "Viaje+",
          "Precisamos da sua permissão para utilizar a localização antes de continuar",
          [
            {
              text: "Ir para configurações",
              onPress: () => Linking.openURL("app-settings:"),
            },
            {
              text: "Cancelar",
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  Location.installWebGeolocationPolyfill();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.main}>
          <Formik>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
              touched,
              errors,
            }) => (
              <View>
                <Text style={styles.inputTitle}>
                  Veiculo: {currentVeiculoPlaca}, {currentVeiculoDescricao}
                </Text>

                <ScrollView
                  horizontal={true}
                  keyboardShouldPersistTaps="always"
                  listViewDisplayed={false}
                  snapToInterval={width}
                  // nestedScrollEnabled={true}
                  snapToAlignment={"start"}
                  scrollEventThrottle={16}
                  decelerationRate={"fast"}
                >
                  <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>Origem:</Text>
                    <TouchableOpacity
                      onPress={() =>
                        setOrigemLocation({
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                          name: "Minha localização",
                        })
                      }
                    >
                      <Text style={{ color: "#fff", bottom: 3 }}>
                        {"\n"}Usar localização atual
                        <Ionicons name="location" size={18} color="#fff" />
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: "80%",
                      }}
                    >
                      <GooglePlacesAutocomplete
                        placeholder={
                          origemLocation.name === "Minha localização"
                            ? "Minha localização"
                            : "De onde?"
                        }
                        onPress={(data, details = null) => {
                          const { geometry } = details;
                          const {
                            location: { lat: latitude, lng: longitude },
                          } = geometry;

                          setOrigemLocation({
                            latitude,
                            longitude,
                            name: data.structured_formatting.main_text,
                          });
                        }}
                        styles={{
                          textInput: {
                            fontSize: 20,
                            flex: 1,
                            borderBottomColor: "red",
                            borderBottomWidth: 3,
                          },
                          poweredContainer: {
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            borderBottomRightRadius: 7,
                            borderBottomLeftRadius: 7,
                            borderColor: "#fff",
                            borderTopWidth: 1,
                          },
                          row: {
                            backgroundColor: "#fff",
                            height: 40,
                            fontSize: 18,
                            flexDirection: "row",
                          },
                          separator: {
                            height: 0.5,
                            backgroundColor: "gray",
                          },
                        }}
                        minLength={2}
                        onFail={(error) => console.error(error)}
                        query={{
                          key: process.env.AUTOCOMPLETE_API_KEY,
                          language: "pt-br",
                          types: "(cities)",
                          components: "country:br",
                        }}
                        textInputProps={{
                          autoCapitalize: "none",
                          autoCorrect: false,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                      />
                    </View>
                  </View>

                  <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>Destino:</Text>
                    <Text>{"\n"}</Text>
                    <View
                      style={{
                        height: "80%",
                      }}
                    >
                      <GooglePlacesAutocomplete
                        placeholder="Para onde?"
                        onPress={(data, details = null) => {
                          const { geometry } = details;
                          const {
                            location: { lat: latitude, lng: longitude },
                          } = geometry;

                          setDestinoLocation({
                            latitude,
                            longitude,
                            name: data.structured_formatting.main_text,
                          });
                        }}
                        styles={{
                          textInput: {
                            fontSize: 20,
                            flex: 1,
                            borderBottomColor: "red",
                            borderBottomWidth: 3,
                          },
                          poweredContainer: {
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            borderBottomRightRadius: 7,
                            borderBottomLeftRadius: 7,
                            borderColor: "#fff",
                            borderTopWidth: 1,
                          },
                          row: {
                            backgroundColor: "#fff",
                            height: 40,
                            fontSize: 18,
                            flexDirection: "row",
                          },
                          separator: {
                            height: 0.5,
                            backgroundColor: "gray",
                          },
                        }}
                        minLength={2}
                        onFail={(error) => console.error(error)}
                        query={{
                          key: process.env.AUTOCOMPLETE_API_KEY,
                          language: "pt-br",
                          types: "(cities)",
                          components: "country:br",
                        }}
                        textInputProps={{
                          autoCapitalize: "none",
                          autoCorrect: false,
                        }}
                        fetchDetails={true}
                        enablePoweredByContainer={false}
                      />
                    </View>
                  </View>
                </ScrollView>
              </View>
            )}
          </Formik>
        </View>
      </TouchableWithoutFeedback>
      <Button
        title="Viajar"
        onPress={() => {
          if (origemLocation.name && destinoLocation.name) {
            Viagens.create({
              origemLat: origemLocation.latitude,
              origemLng: origemLocation.longitude,
              origemName: origemLocation.name,
              destinoLat: destinoLocation.latitude,
              destinoLng: destinoLocation.longitude,
              destinoName: destinoLocation.name,
              veiculoReference: currentVeiculoId,
            })
              .then((id) => {
                console.log("Viagens created with id: " + id);
                navigation.push("ViagensDetails", {
                  currentVeiculoId: currentVeiculoId,
                });
              })
              .catch((err) => console.log(err));
          } else Alert.alert("Selecione uma origem e destino");
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 5,
  },
  main: {
    flex: 1,
    justifyContent: "center",
  },
  containerInput: {
    borderColor: "#7a7a7a",
    borderRadius: 5,
    margin: 5,
    width: "100%",
    justifyContent: "center",
    flex: 1,
  },
  inputTitle: { fontSize: 16, color: "#7a7a7a", fontWeight: "bold" },
});

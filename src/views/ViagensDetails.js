import React, { useState, useEffect, useRef } from "react";
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
  Modal,
  Alert,
  Linking,
} from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Viagens from "../services/sqlite/Viagens";
import { FlatList } from "react-native-gesture-handler";
import { getPixelSize } from "../components/utils";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ViagensDetails({ route, navigation }) {
  const { currentVeiculoId } = route.params;
  const [listViagens, setListViagens] = useState([]);
  const [mapDetails, setMapDetails] = useState(null);
  const [durationDistance, setDurationDistance] = useState({
    duration: null,
    distance: null,
  });
  const mapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const response = await Viagens.findviagensByVeiculoId(currentVeiculoId);
      setListViagens(response);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => setMapDetails(item)}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          De {item.origemName} para {item.destinoName}
        </Text>

        <View
          style={{
            borderWidth: 1,
            borderColor: "#fff",
            borderRadius: 5,
            alignItems: "center",
            padding: 5,
          }}
        >
          <MaterialCommunityIcons name="map-search" size={24} color="#1d471c" />
          <Text style={{ color: "#fff" }}>Aperte para ver no mapa</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {listViagens.length > 0 ? (
        <>
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
            Minhas Viagens
          </Text>
          <FlatList
            data={listViagens}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
            Nenhuma viagem{"\n"}cadastrada ainda.
          </Text>
        </View>
      )}

      {mapDetails && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={mapDetails ? true : false}
          onRequestClose={() => setMapDetails(null)}
        >
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setMapDetails(null)}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              style={{
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#f23434",
                borderRadius: 100,
                margin: 5,
              }}
            >
              <MaterialCommunityIcons
                name="chevron-down"
                size={30}
                color="#f23434"
              />
            </TouchableOpacity>

            <Text style={{ textAlign: "center", color: "#fff" }}>
              Detalhes da Viagem:
            </Text>

            <View style={styles.modalMapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                initialRegion={{
                  latitude: mapDetails.origemLat,
                  longitude: mapDetails.origemLng,
                  latitudeDelta: 0.243,
                  longitudeDelta: 0.234,
                }}
                loadingEnabled={true}
                style={{ width: "100%", height: "100%" }}
              >
                <MapViewDirections
                  origin={{
                    latitude: mapDetails.origemLat,
                    longitude: mapDetails.origemLng,
                  }}
                  destination={{
                    latitude: mapDetails.destinoLat,
                    longitude: mapDetails.destinoLng,
                  }}
                  apikey={process.env.DIRECTIONS_API_KEY}
                  strokeWidth={5}
                  strokeColor="hotpink"
                  lineDashPattern={[0]}
                  onReady={(result) => {
                    setDurationDistance({
                      duration: result.duration,
                      distance: result.distance,
                    });
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        top: getPixelSize(50),
                        right: getPixelSize(50),
                        bottom: getPixelSize(50),
                        left: getPixelSize(50),
                      },
                    });
                  }}
                />
                <Marker
                  coordinate={{
                    latitude: mapDetails.origemLat,
                    longitude: mapDetails.origemLng,
                  }}
                  title={mapDetails.origemName}
                  pinColor={"red"}
                  identifier={"mk1"}
                />
                <Marker
                  coordinate={{
                    latitude: mapDetails.destinoLat,
                    longitude: mapDetails.destinoLng,
                  }}
                  title={mapDetails.destinoName}
                  pinColor={"green"}
                  identifier={"mk2"}
                />
              </MapView>
              <View style={styles.containerDescription}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  De
                  <Text style={styles.bold}>
                    {" "}
                    {mapDetails.origemName}{" "}
                  </Text>para{" "}
                  <Text style={styles.bold}>{mapDetails.destinoName}</Text>
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Duração:
                  <Text style={styles.bold}>
                    {" "}
                    {Math.floor(durationDistance.duration)}
                  </Text>{" "}
                  Min
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                  }}
                >
                  Distância:{" "}
                  <Text style={styles.bold}>
                    {Math.floor(durationDistance.distance)}
                  </Text>{" "}
                  Km
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 20,
  },

  modalMapContainer: {
    width: "100%",
    height: "50%",
    overflow: "hidden",
    flex: 1,
    backgroundColor: "#7a7a7a",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  containerDescription: {
    height: "50%",
    padding: 20,
  },
  modalView: {
    flex: 1,
    elevation: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderColor: "#f23434",
    backgroundColor: "#7a7a7a",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#f23434",
    backgroundColor: "#7a7a7a",
    padding: 10,
  },
  bold: { fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Veiculos from "../services/sqlite/Veiculos";
import User from "../services/sqlite/User";

export default function Home({ route, navigation }) {
  const [listVeiculos, setListVeiculos] = useState([]);
  const [userData, setUserData] = useState(null);
  const { currentUserId } = route.params;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const response = await Veiculos.findVeiculosByUserId(currentUserId);
      const responseUser = await User.find(currentUserId);
      setListVeiculos(response);
      setUserData(responseUser);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Viaje Mais",
      "Tem certeza que deseja excluir o carro?",
      [
        {
          text: "Sim",
          onPress: async () => {
            try {
              const response = await Veiculos.remove(id);
              if (listVeiculos.length == 1) setListVeiculos([]);
              await fetchData();
            } catch (error) {
              console.log(error);
            }
          },
        },
        {
          text: "Voltar",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.addVeiculo}
          onPress={() =>
            navigation.navigate("VeiculosRegister", {
              currentUserId: currentUserId,
            })
          }
        >
          <FontAwesome5 name="clipboard-list" size={24} color="#000" />
          <Text style={{ color: "#000", fontSize: 16 }}>
            {" "}
            Adicionar novo veículo +
          </Text>
        </TouchableOpacity>
      </View>
      {listVeiculos && listVeiculos.length > 0 && (
        <Text style={styles.subtitle}>Escolha um para iniciar a viagem:</Text>
      )}

      <ScrollView>
        <View style={styles.containerCards}>
          {listVeiculos && listVeiculos.length > 0 ? (
            listVeiculos.map((e, idx) => {
              return (
                <View key={e.id} style={styles.card}>
                  <View>
                    <Text style={styles.textCard}>{e.placa}</Text>
                    <Text style={styles.textCard}>{e.descricao}</Text>

                    <Text style={styles.textCard}>{e.combustivel}</Text>
                    <Text style={styles.textCard}>{e.tanque} L</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push("ViagensDetails", {
                          currentVeiculoId: e.id,
                        })
                      }
                      style={styles.cardButtons}
                    >
                      <MaterialCommunityIcons
                        name="map-search"
                        size={24}
                        color="#1d471c"
                      />
                      <Text style={styles.textCard}>Minhas{"\n"}Viagens</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ViagensRegister", {
                          currentVeiculoId: e.id,
                          currentVeiculoPlaca: e.placa,
                          currentVeiculoDescricao: e.descricao,
                          currentUserId: currentUserId,
                        })
                      }
                      style={styles.cardButtons}
                    >
                      <MaterialCommunityIcons
                        name="map-marker-plus"
                        size={24}
                        color="#1c3147"
                      />
                      <Text style={styles.textCard}>Nova{"\n"}Viagem</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(e.id)}
                      style={styles.cardButtons}
                    >
                      <FontAwesome5
                        name="car-crash"
                        size={24}
                        color="#591a1a"
                      />
                      <Text style={styles.textCard}>Apagar{"\n"}Veículo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                }}
              >
                Nenhum veículo cadastrado ainda.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    color: "#f23434",
    fontSize: 16,
    textAlign: "center",
  },
  addVeiculo: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "#f23434",
    backgroundColor: "#f23434",
    padding: 10,
    margin: 20,
    alignSelf: "center",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: "#f23434",
    backgroundColor: "#7a7a7a",
  },
  textCard: { textAlign: "center", color: "#fff" },
  cardButtons: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#fff",
    padding: 5,
    margin: 5,
    alignItems: "center",
  },
  containerCards: {
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
});

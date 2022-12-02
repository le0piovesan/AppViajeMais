import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import Veiculos from "../services/sqlite/Veiculos";
import { Picker } from "@react-native-picker/picker";
import * as yup from "yup";

const registerSchema = yup.object({
  placa: yup.string().required(),
  descricao: yup.string().required(),
  tanque: yup.number().required(),
});

export default function VeiculosRegister({ route, navigation }) {
  const { currentUserId } = route.params;
  const [combustivel, setCombustivel] = useState("Gasolina");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.main}>
              <Formik
                validationSchema={registerSchema}
                initialValues={{
                  placa: "",
                  descricao: "",
                  tanque: "",
                  combustivel: "Gasolina",
                }}
                onSubmit={({ placa, descricao, tanque }) => {
                  Veiculos.create({
                    placa,
                    descricao,
                    tanque,
                    combustivel: combustivel,
                    userReference: currentUserId,
                  })
                    .then((id) => {
                      console.log("Veiculos created with id: " + id);
                      navigation.navigate("Home", {
                        currentUserId: currentUserId,
                      });
                    })
                    .catch((err) => console.log(err));
                }}
              >
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
                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Placa:</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange("placa")}
                        onBlur={handleBlur("placa")}
                        value={values.placa}
                      />
                      {touched.placa && errors.placa ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Descrição:</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange("descricao")}
                        onBlur={handleBlur("descricao")}
                        value={values.descricao}
                      />
                      {touched.descricao && errors.descricao ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Capacidade tanque:</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <TextInput
                          style={styles.input}
                          onChangeText={handleChange("tanque")}
                          onBlur={handleBlur("tanque")}
                          value={values.tanque}
                          keyboardType="numeric"
                        />
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 20,
                            right: 25,
                            position: "absolute",
                          }}
                        >
                          L
                        </Text>
                      </View>
                      {touched.tanque && errors.tanque ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Tipo combustível:</Text>
                      <Picker
                        style={{
                          backgroundColor: "#7a7a7a",
                          color: "#fff",
                        }}
                        itemStyle={{ height: 50 }}
                        selectedValue={combustivel}
                        onValueChange={(itemValue, itemIndex) =>
                          setCombustivel(itemValue)
                        }
                      >
                        <Picker.Item label="Gasolina" value="Gasolina" />
                        <Picker.Item label="Etanol" value="Etanol" />
                        <Picker.Item label="Diesel" value="Diesel" />
                      </Picker>
                    </View>

                    <Button title="Cadastrar" onPress={handleSubmit} />
                  </View>
                )}
              </Formik>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "#f23434",
    fontSize: 16,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
  },
  containerInput: {
    borderColor: "#7a7a7a",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    margin: 5,
    width: "100%",
  },
  inputTitle: { fontSize: 16, color: "#7a7a7a", fontWeight: "bold" },
  input: {
    flex: 1,
    height: 35,
    marginRight: 10,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#7a7a7a",
    color: "#fff",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  checkbox: {
    margin: 15,
    height: 30,
    width: 30,
    borderRadius: 20,
  },
  errorText: {
    color: "crimson",
    textAlign: "right",
  },
});

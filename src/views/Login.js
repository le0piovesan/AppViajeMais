import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from "react-native";
import Button from "../components/Button";
import { Entypo } from "@expo/vector-icons";
import User from "../services/sqlite/User";
import { Formik } from "formik";
import * as yup from "yup";
import * as Network from "expo-network";

const loginSchema = yup.object({
  user: yup.string().required(),
  password: yup.string().required(),
});

export default function Login({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

  const internetConnection = async () => {
    const response = await Network.getNetworkStateAsync();
    if (!response.isConnected)
      Alert.alert(
        "Viaje Mais",
        "Para utilizar funcionalidades do mapa é necessário internet e permissões",
        [
          {
            text: "Ir para configurações",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Voltar",
          },
        ],
        { cancelable: false }
      );
  };

  useEffect(() => {
    internetConnection();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={require("../../assets/logo-viajemais-empty.png")}
              resizeMode="contain"
              style={{
                width: 150,
                height: 150,
                alignSelf: "center",
              }}
            />
            <View style={styles.main}>
              <Formik
                validationSchema={loginSchema}
                initialValues={{ user: "", password: "" }}
                onSubmit={async ({ user, password }) => {
                  try {
                    const response = await User.findByUserName(user);
                    const currentUser = response.find((u) => u.user === user);
                    if (
                      currentUser.user === user &&
                      currentUser.password === password
                    ) {
                      navigation.navigate("Home", {
                        currentUserId: currentUser.id,
                      });
                      setErrorUser(null);
                    } else setErrorUser("Senha incorreta");
                  } catch (err) {
                    setErrorUser("Usuário não existe");
                  }
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Login: </Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange("user")}
                        onBlur={handleBlur("user")}
                        value={values.user}
                      />
                    </View>
                    {touched.user && errors.user ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}

                    <View style={styles.containerInput}>
                      <Text style={styles.inputTitle}>Senha: </Text>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <TextInput
                          style={styles.input}
                          secureTextEntry={passwordVisible ? false : true}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                        />
                        <TouchableOpacity
                          onPress={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <Entypo name="eye" size={32} color="#f23434" />
                          ) : (
                            <Entypo
                              name="eye-with-line"
                              size={32}
                              color="#f23434"
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    {touched.password && errors.password ? (
                      <Text style={styles.errorText}>* Campo obrigatório</Text>
                    ) : null}
                    {errorUser && (
                      <Text
                        style={{
                          fontSize: 16,
                          color: "red",
                          textAlign: "center",
                        }}
                      >
                        {errorUser}
                      </Text>
                    )}
                    <Button title="Entrar" onPress={handleSubmit} />

                    <Button
                      title="Cadastre-se"
                      outline={true}
                      onPress={() => navigation.navigate("Register")}
                    />
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
    padding: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
  },
  subtitle: {
    color: "#f23434",
    fontSize: 16,
    textAlign: "center",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  containerInput: {
    borderColor: "#7a7a7a",
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 5,
  },
  inputTitle: { fontSize: 16, color: "#7a7a7a", fontWeight: "bold" },
  input: {
    flex: 1,
    height: 40,
    margin: 8,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#7a7a7a",
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "crimson",
  },
});

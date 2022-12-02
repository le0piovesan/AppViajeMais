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
} from "react-native";
import Button from "../components/Button";
import { Formik } from "formik";
import User from "../services/sqlite/User";
import { Entypo } from "@expo/vector-icons";
import * as yup from "yup";

const registerSchema = yup.object({
  user: yup.string().required(),
  password: yup.string().required(),
});

export default function Register({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.main}>
            <Formik
              validationSchema={registerSchema}
              initialValues={{ user: "", password: "" }}
              onSubmit={({ user, password }) => {
                User.create({ user, password })
                  .then((id) => {
                    console.log("User created with id: " + id);
                    navigation.navigate("Login");
                  })
                  .catch((err) => console.log(err));
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
                    <Text style={styles.inputTitle}>
                      Usuário{" "}
                      {touched.user && errors.user ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("user")}
                      onBlur={handleBlur("user")}
                      value={values.user}
                    />
                  </View>

                  <View style={styles.containerInput}>
                    <Text style={styles.inputTitle}>
                      Senha{" "}
                      {touched.password && errors.password ? (
                        <Text style={styles.errorText}>
                          * Campo obrigatório
                        </Text>
                      ) : null}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                        secureTextEntry={passwordVisible ? false : true}
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

                  <Button title="Cadastrar" onPress={handleSubmit} />
                </View>
              )}
            </Formik>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ textAlign: "center", color: "#fff" }}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    padding: 10,
    margin: 5,
  },
  inputTitle: { fontSize: 16, color: "#7a7a7a", fontWeight: "bold" },
  input: {
    flex: 1,
    height: 35,
    width: "100%",
    marginTop: 5,
    marginRight: 10,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#7a7a7a",
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "crimson",
    textAlign: "right",
  },
});

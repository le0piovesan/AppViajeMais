import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Páginas
import Login from "./src/views/Login";
import Register from "./src/views/Register";
import Home from "./src/views/Home";
import VeiculosRegister from "./src/views/VeiculosRegister";
import ViagensRegister from "./src/views/ViagensRegister";
import ViagensDetails from "./src/views/ViagensDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: "Login",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: "Criar uma conta",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Meus veículos",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="VeiculosRegister"
            component={VeiculosRegister}
            options={{
              title: "Adicionar veículo",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="ViagensRegister"
            component={ViagensRegister}
            options={{
              title: "Nova viagem",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          <Stack.Screen
            name="ViagensDetails"
            component={ViagensDetails}
            options={{
              title: "Histórico de Viagens",
              headerStyle: {
                backgroundColor: "#f23434",
              },
              headerTintColor: "#000",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      <StatusBar style="auto" />
    </>
  );
}

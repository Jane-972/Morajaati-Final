import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { Icons } from "../constants/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomMenu = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("role");
        if (role !== null) {
          setUserRole(role);
        }
      } catch (error) {
        console.error("Failed to load user role from AsyncStorage", error);
      }
    };

    getUserRole();
  }, []);

  const handleAccount = () => {
    if (userRole === "STUDENT") {
      router.push("./accountStudent");
    } else {
      router.push("/accountProf");
    }
  };
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.push("/courseList")}>
        <Image
          source={Icons.home}
          style={styles.iconStyles}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{router.push('./profList')}}>
        <Image
          source={Icons.professors}
          style={styles.iconStyles}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{router.push('./mylearning')}}>
        <Image
          source={Icons.courses}
          style={styles.iconStyles}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image
          source={Icons.chat}
          style={styles.iconStyles}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleAccount();
        }}
      >
        <Image
          source={Icons.account}
          style={styles.iconStyles}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 3,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  iconStyles: {
    width: 35,
    height: 35,
  },
});

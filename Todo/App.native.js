import React, { useState, useEffect } from "react"
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Keyboard, AppRegistry } from 'react-native';
import {
  Set_Encrypted_AsyncStorage,
  Get_Encrypted_AsyncStorage,
} from "react-native-encrypted-asyncstorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./App_Style.js"
import Tasks from "./src/components/task/Tasks.js"
import * as SQLite from "expo-sqlite";





export default function App() {

  const [task, setTask] = useState("");
  const [taskItems, setTaskItems] = useState([]);
  const DB = SQLite.openDatabase("UserDatabase.db");


  useEffect(() => {
    if (Platform.OS === "web") {
      console.log("web")
    }

    if (Platform.OS === "android") {
      console.log("android")
      DB.transaction((tx) => {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'", [], function (tx, res) {
          if (res.rows.length == 0) {
            tx.executeSql("DROP TABLE IF EXISTS tasks", []);
            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(35))", []);
          }
        }, (err) => console.log("err select: " + JSON.stringify(err, null, 4)));
      });

      DB.transaction((tx) => {
        tx.executeSql("SELECT * FROM tasks", [], (tx, res) => {
          setTaskItems(res.rows._array)
          console.log("records: " + JSON.stringify(res.rows._array, null, 3));
        })
      })

      // const getData = async () => {
      //   try {
      //     const data = await Get_Encrypted_AsyncStorage("object", "task", "123456")
      //     if (data !== null) {
      //       setTaskItems(data)
      //       console.log(taskItems)
      //     } else {
      //       console.log("girmedi")
      //     }
      //   } catch (error) {
      //     console.log(error)
      //   }
      // }
      // getData();
    }

  }, [])




  const handleAddTask = async () => {
    Keyboard.dismiss();
    const temp = [...taskItems, task];
    setTaskItems(temp)

    // Use Temp instead of directly Setting the UseState. Because the getter of Usestate hook will change after the render but we are assigning the value to the localstorage inside.
    // await Set_Encrypted_AsyncStorage("object", "task", temp, "123456")

    DB.transaction((tx) => {

      tx.executeSql("INSERT INTO tasks (name) VALUES (?)",
        [task],
        (res) => console.log("res insert: " + JSON.stringify(res, null, 4)),
        (err) => console.log("err insert: " + JSON.stringify(err, null, 4)));

      tx.executeSql("SELECT * FROM tasks",
        [],
        (tx, res) => { setTaskItems(res.rows._array) },
        (err) => console.log("err select: " + JSON.stringify(err, null, 4)));
    });

    setTask("");
    if (Platform.OS === "web") {
      console.log("Task set edildi - web")
    }

    if (Platform.OS === "android") {
      console.log("Task set edildi - android native")
    }

  }


  const handleDeleteTask = async (index) => {
    // setTaskItems(taskItems.filter(task => task.index !== index));
    // const temp = [...taskItems];
    // temp.splice(index, 1)
    // setTaskItems(temp)
    DB.transaction(
      (tx) => {
        tx.executeSql("DELETE FROM tasks WHERE id = ?;",
          [index],
          (res) => console.log("res delete: " + JSON.stringify(res, null, 4)),
          (err) => console.log("err delete: " + JSON.stringify(err, null, 4)));

        tx.executeSql("SELECT * FROM tasks",
          [],
          (tx, res) => { setTaskItems(res.rows._array) },
          (err) => console.log("err select: " + JSON.stringify(err, null, 4)));
      });
    // await Set_Encrypted_AsyncStorage("object", "task", temp, "123456")
  }


  return (
    <View style={styles.container}>

      <View style={styles.tasksWrapper}>

        <Text style={styles.sectionTitle}> Today's Tasks New App</Text>

        <View style={styles.items}>
          {/* This is where the tasks will go  */}
          {
            taskItems.map((task, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => handleDeleteTask(task.id)}>
                  <Tasks task={task} />
                </TouchableOpacity>
              )
            })
          }
        </View>

      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
        <TextInput style={styles.input} placeholder={"Write a Task"} onChangeText={text => setTask(text)} value={task} />

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

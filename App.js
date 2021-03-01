import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import Task from "./components/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    {children}
  </TouchableWithoutFeedback>
);

const setStorage = async ({ key, value }) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log("err :>> ", err);
  }
};

export default function App() {
  const [task, setTask] = useState("");
  const [taskItems, SetTaskItem] = useState([]);

  const getData = async () => {
    const value = await AsyncStorage.getItem("TASKS");

    if (value) {
      console.log("init value", value);
      SetTaskItem(JSON.parse(value));
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlerAddTask = () => {
    if (task.trim() === "") {
      return alert("Task is required !");
    }
    Keyboard.dismiss();

    SetTaskItem([...taskItems, task]);
    setStorage({
      key: "TASKS",
      value: JSON.stringify([...taskItems, task]),
    });
    setTask("");
  };

  const completeTask = (index) => {
    const itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setStorage({
      key: "TASKS",
      value: JSON.stringify(itemsCopy),
    });
    SetTaskItem(itemsCopy);
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>

          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((task, ix) => {
              return (
                <TouchableOpacity
                  key={ix}
                  onPress={() => {
                    return Alert.alert(
                      "Delete task",
                      "Are you sure",
                      [
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => completeTask(ix),
                        },
                      ],
                      { cancelable: false }
                    );
                    // completeTask(ix);
                  }}
                >
                  <Task text={task} />
                </TouchableOpacity>
              );
            })}
            {/* <Task text={"this is a task"} />
          <Task text={"this is a task"} /> */}
          </View>
        </View>
        {/* Write a task */}
        {/* {KeyboardAvoidingView} keyboard lên thì  input lên */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
          style={styles.writeTaskWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={"Write a task"}
            value={task}
            onChangeText={(text) => setTask(text)}
          />

          <TouchableOpacity onPress={handlerAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: { marginTop: 30 },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  addText: {},
});

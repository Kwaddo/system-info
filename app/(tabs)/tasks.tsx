import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskManager.RegisteredTask[]>([]);
  const [taskName, setTaskName] = useState("");
  const [interval, setInterval] = useState("60");

  const fetchTasks = async () => {
    try {
      const registeredTasks = await TaskManager.getRegisteredTasksAsync();
      setTasks(registeredTasks);
    } catch (error: any) {
      Alert.alert("Error", "Failed to fetch tasks: " + error.message);
    }
  };

  const defineTask = (name: string) => {
    TaskManager.defineTask(name, async ({ data, error }: TaskManager.TaskManagerTaskBody<any>) => {
      if (error) {
        console.error(`Error in task '${name}': ${error.message}`);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
      console.log(`Task '${name}' executed with data:`, data);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    });
  };

  const registerTask = async () => {
    if (!taskName || !interval) {
      Alert.alert("Error", "Please provide a valid task name and interval.");
      return;
    }

    try {
      const status = await BackgroundFetch.getStatusAsync();
      if (status !== BackgroundFetch.BackgroundFetchStatus.Available) {
        Alert.alert("Error", "Background fetch is not available on this device.");
        return;
      }

      defineTask(taskName);
      await BackgroundFetch.registerTaskAsync(taskName, {
        minimumInterval: parseInt(interval, 10),
      });

      Alert.alert("Success", `Task '${taskName}' registered with interval ${interval} seconds!`);
      setTaskName("");
      setInterval("60");
      fetchTasks();
    } catch (error: any) {
      Alert.alert("Error", "Failed to register task: " + error.message);
    }
  };

  const unregisterAllTasks = async () => {
    try {
      const registeredTasks = await TaskManager.getRegisteredTasksAsync();
      for (const task of registeredTasks) {
        await TaskManager.unregisterTaskAsync(task.taskName);
      }
      Alert.alert("Success", "All tasks unregistered!");
      fetchTasks();
    } catch (error: any) {
      Alert.alert("Error", "Failed to unregister tasks: " + error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  function formatMinimumInterval(interval: number): string {
    return `Minimum Interval: ${interval}S`;
  }
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for iOS or Android
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Registered Tasks</Text>
        <TextInput
          placeholder="Task Name"
          value={taskName}
          onChangeText={setTaskName}
          style={[styles.textInput, styles.lightBg, styles.lightText]}
          placeholderTextColor="#000000" // Black placeholder text
        />
        <TextInput
          placeholder="Interval (seconds)"
          value={interval}
          onChangeText={setInterval}
          keyboardType="numeric"
          style={[styles.textInput, styles.lightBg, styles.lightText]}
          placeholderTextColor="#000000" // Black placeholder text
        />
        <Button title="Register Task" onPress={registerTask} />
        <View style={{ height: 20 }} />
        <Button
          title="Unregister All Tasks"
          color="red"
          onPress={unregisterAllTasks}
        />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.taskName}
        renderItem={({ item }) => (
          <View style={[styles.lightBg, styles.taskItem]}>
            <Text style={[styles.text, styles.heading]}>{item.taskName}</Text>
            <Text style={styles.text}>
              {formatMinimumInterval(item.options.minimumInterval)}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.text, styles.centeredText]}>
            No tasks registered
          </Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingBottom: 20,
    width: "100%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  centeredText: {
    textAlign: "center",
  },
  lightBg: {
    backgroundColor: "#f5f5f5",
  },
  darkBg: {
    backgroundColor: "#1c1c1e",
  },
  lightText: {
    color: "#000000",
  },
  darkText: {
    color: "#ffffff",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  taskItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

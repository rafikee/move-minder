// Tracker.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View, Platform } from "react-native";
import {
  ListItem,
  Button,
  Text,
  Icon,
  SocialIcon,
  Dialog,
  Input,
} from "@rneui/themed";
// Import components from other files
import { getData, setData, Workout } from "./storageutil";
import { appStyles, colors, iconSizes } from "../assets/styles";

const MAX_LENGTH = 30; // maximum length of workout name
const ENTRY_LIMIT = 100; // maximum number of workouts

// this variable is passed from App.tsx to force a refresh of the data when it changes
interface TrackerProps {
  refreshData: boolean;
}

const Workouts: React.FC<TrackerProps> = ({ refreshData }) => {
  // List of workouts objects that we display
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  // List of previous workouts lists we use for undo
  const [previousWorkouts, setPreviousWorkouts] = useState<Workout[][]>([]); // new state variable to keep track of previous states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // we used this to keep track of which workout we are updating
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [inputDialogVisible, setInputDialogVisible] = useState<boolean>(false);
  const [inputDialogValue, setInputDialogValue] = useState<string>("");

  // When refreshdData is toggled load from storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getData();
        setWorkouts(result);
        setPreviousWorkouts([result]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [refreshData]);

  if (isLoading) {
    // Display loading indicator while data is being fetched
    return (
      <View style={appStyles.container}>
        <SocialIcon loading iconSize={iconSizes.loadingIconSize} />
      </View>
    );
  }

  // when the user presses undo, only allow undo if there are previous states
  const handleUndo = () => {
    if (previousWorkouts.length > 1) {
      // only undo if there are previous states
      const previousState = previousWorkouts[previousWorkouts.length - 2]; // get previous state
      setPreviousWorkouts(previousWorkouts.slice(0, -1)); // remove current state from previous states
      setData(previousState);
    }
  };

  const handleDeleteIcon = (id: number) => {
    console.log("Delete icon pressed for id:", id);
  };

  const showInputDialog = (workout: Workout) => {
    setSelectedWorkoutId(workout.id);
    setInputDialogValue(workout.name != "New entry" ? workout.name : "");
    setInputDialogVisible(true);
  };

  // the input dialog box
  const renderInputDialog = () => {
    return (
      <Dialog
        isVisible={inputDialogVisible}
        overlayStyle={appStyles.inputDialog}
      >
        <Input
          placeholder="New entry"
          defaultValue={inputDialogValue}
          autoFocus={true}
          autoCorrect={false}
          returnKeyType="done"
          enablesReturnKeyAutomatically={true} // only works on iOS
          maxLength={MAX_LENGTH}
          onSubmitEditing={(e: any) => {
            const value = e.nativeEvent.text;
            handleUpdate(selectedWorkoutId, value);
          }}
        />
      </Dialog>
    );
  };

  // handle the input dialog box when a user edits an entry or adds new one
  const handleUpdate = async (id: number | null, newName: string) => {
    if (!id) {
      // this sould never happen
      console.log("oops");
    } else {
      if (newName === "") {
        newName = "New entry";
      }
      const updatedItems = workouts.map((workout) =>
        workout.id === id ? { ...workout, name: newName } : workout
      );
      setWorkouts(updatedItems);
      const data = updatedItems.map((workout) => ({
        id: workout.id,
        name: workout.name,
        enabled: workout.enabled,
      }));
      setData(data);
    }
    setInputDialogVisible(false);
    setSelectedWorkoutId(null);
  };

  // Render the workouts
  const renderChapters = () => {
    // if there are no workouts display a message
    if (workouts.filter((workout) => workout.enabled).length === 0) {
      return (
        <View style={appStyles.container}>
          <Text style={appStyles.infoText}>Add workouts to start.</Text>
        </View>
      );
    }
    // render the list of workouts
    return workouts.map((workout) => (
      <View key={workout.id} style={{ flexDirection: "row" }}>
        <Icon
          name="delete"
          size={iconSizes.inputListIcons}
          color={colors.dark}
          onPress={() => {
            handleDeleteIcon(workout.id);
          }}
          style={{ padding: 10 }}
        />
        <ListItem containerStyle={[appStyles.itemConainer, appStyles.shadow]}>
          <ListItem.Title>{workout.name}</ListItem.Title>
          <Icon
            name="edit"
            size={iconSizes.inputListIcons}
            color={colors.dark}
            onPress={() => showInputDialog(workout)}
          />
        </ListItem>
      </View>
    ));
  };

  // Add a new item to the list
  const addNewItem = async () => {
    if (workouts.length < ENTRY_LIMIT) {
      const updatedItems = workouts.map((workout) => ({
        ...workout,
        enableInput: false,
      }));
      const newWorkoutId = updatedItems.length + 1;

      const newItem: Workout = {
        id: newWorkoutId,
        name: "New workout",
        enabled: true,
      };
      const newItems = [...updatedItems, newItem];
      setWorkouts(newItems);
      showInputDialog(newItem);
    } else {
      //setLimitDialogVisible(true);
    }
  };

  // button to add a new item
  const renderEntryButton = () => {
    return (
      <Button
        title="New workout"
        onPress={() => {
          addNewItem();
        }}
        type="clear"
        buttonStyle={{ borderColor: colors.dark }}
        titleStyle={appStyles.newEntryButtonText}
        icon={
          <Icon
            name="add-circle"
            size={iconSizes.inputListIcons}
            color={colors.dark}
          />
        }
      />
    );
  };

  // show the undo button if there are workouts
  const renderUndo = () => {
    if (workouts.filter((workout) => workout.enabled).length > 0) {
      return (
        <Button
          onPress={handleUndo}
          disabled={previousWorkouts.length < 2}
          type="clear"
          disabledStyle={{ opacity: 0.5 }}
        >
          <Icon
            name="undo"
            type="font-awesome"
            color={colors.light}
            size={iconSizes.headerIconSize}
          />
        </Button>
      );
    }
  };

  // render the header on the page
  const renderHeader = () => {
    return (
      <View style={appStyles.headerContainer}>
        <View style={[appStyles.header, appStyles.shadow]}>
          <View style={appStyles.container}>{renderUndo()}</View>
          <View style={appStyles.container}>
            <Text style={appStyles.headerTitle}>Workouts</Text>
          </View>
          <View style={appStyles.headerEmptySpace}></View>
        </View>
      </View>
    );
  };

  // render the calendar modal
  // we have one for ios and one for android
  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ScrollView style={appStyles.spacer}>
        {renderChapters()}
        <View style={appStyles.spacer}></View>
      </ScrollView>
      {renderEntryButton()}
      {renderInputDialog()}
    </View>
  );
};

export default Workouts;

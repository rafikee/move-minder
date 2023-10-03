// Input.tsx
import React, { useState, useEffect } from "react";
import { ListItem, Icon, Button, Dialog, Text, Input } from "@rneui/themed";
import { View, ScrollView } from "react-native";

// Import components from other files
import { setCustomData, getCustomData, updateFormat } from "./storageutil";
import { appStyles, colors, iconSizes } from "../assets/styles";

export interface Item {
  id: number; // this will be based on the sort order of the user and also the uniqueID
  name: string; // the name of the chapter, will be copied to transliteration
  enableInput: boolean; // to turn on or off the edit for each field
  review: boolean; // whether or not the user has reviewed this entry defaults to false
  date: Date | string; // the date of last review, defaults to "Not reviewed"
}

// when we press the done button here we need to close the overlay in edit.tsx
// this variable gets passed back there
interface InputComponentProps {
  onDone: () => void;
}

const ENTRY_LIMIT = 100; // how many entries can a user add in custom mode
const MAX_LENGTH = 20; // max length of input string for an entry

const InputComponent: React.FC<InputComponentProps> = ({ onDone }) => {
  // dialog box for new or editing an entry, turning it on and off
  const [inputDialogVisible, setInputDialogVisible] = useState<boolean>(false);
  // show or hide the dialog box for too many entries
  const [limitDialogVisible, setLimitDialogVisible] = useState<boolean>(false);
  // show or hide the dialog box for deleting an entry
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  // holds the users value that they put in the input dialog
  const [inputDialogValue, setInputDialogValue] = useState<string>("");
  // holds the index of the item that we are editing
  const [currentKey, setCurrentKey] = useState<number | null>(null);
  // list of items that the user created, some default values here as well
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      name: "New entry",
      enableInput: false,
      review: false,
      date: "Not reviewed",
    },
  ]);

  // Load once when the component is mounted, get custom data if it exists in async storage
  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateFormat(2);

        const result = await getCustomData();
        const data = result.map((item) => ({
          id: item.id,
          name: item.name,
          enableInput: false,
          date: item.date,
          review: item.review,
        }));
        setItems(data);
      } catch (error) {
        console.error("Error fetching data :(...", error);
      }
    };
    fetchData();
  }, []);

  // move an item up in the sort order
  const moveItemUp = async (index: number) => {
    if (index > 0) {
      const updatedItems = items.map((item) => ({
        ...item,
        enableInput: false,
      }));
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index - 1, 0, itemToMove);
      // Update IDs to maintain ascending order
      const updatedSortedItems = updatedItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setItems(updatedSortedItems);
      setCustomData(updatedSortedItems);
    }
  };

  // move an item down in the sort order
  const moveItemDown = async (index: number) => {
    const updatedItems = items.map((item) => ({
      ...item,
      enableInput: false,
    }));
    if (index < items.length - 1) {
      const itemToMove = updatedItems.splice(index, 1)[0];
      updatedItems.splice(index + 1, 0, itemToMove);
      // Update IDs to maintain ascending order
      const updatedSortedItems = updatedItems.map((item, idx) => ({
        ...item,
        id: idx + 1,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setItems(updatedSortedItems);
      setCustomData(updatedSortedItems);
    }
  };

  // Add a new item to the list
  const addNewItem = async () => {
    if (items.length < ENTRY_LIMIT) {
      const updatedItems = items.map((item) => ({
        ...item,
        enableInput: false,
      }));
      const newItemId = updatedItems.length + 1;

      const newItem: Item = {
        id: newItemId,
        name: "New entry",
        enableInput: true,
        review: false,
        date: "Not reviewed",
      };
      const newItems = [...updatedItems, newItem];
      setItems(newItems);
      showInputDialog(newItem);
    } else {
      setLimitDialogVisible(true);
    }
  };

  // Delete an item from the list once the user confirms
  const deleteItem = () => {
    const index = items.findIndex((item) => item.id === currentKey);
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    const updatedSortedItems = updatedItems.map((item, idx) => ({
      ...item,
      id: idx + 1,
      transliteration: item.name,
      total_verses: null,
      type: null,
    }));
    setItems(updatedSortedItems);
    setCustomData(updatedSortedItems);
    setDeleteDialogVisible(false);
    setCurrentKey(null);
  };

  // When the user clicks on the delete icon next to an item
  const handleDeleteIcon = async (id: number) => {
    setDeleteDialogVisible(true);
    setCurrentKey(id);
  };

  // Show the input dialog
  const showInputDialog = (item: Item) => {
    setCurrentKey(item.id);
    setInputDialogValue(item.name != "New entry" ? item.name : "");
    setInputDialogVisible(true);
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
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, name: newName } : item
      );
      setItems(updatedItems);
      const data = updatedItems.map((item) => ({
        id: item.id,
        name: item.name,
        review: item.review,
        date: item.date,
        transliteration: item.name,
        total_verses: null,
        type: null,
      }));
      setCustomData(data);
    }
    setInputDialogVisible(false);
    setCurrentKey(null);
  };

  // when the user is done editing
  const handleDone = async () => {
    const data = items.map((item) => ({
      id: item.id,
      name: item.name,
      review: item.review,
      date: item.date,
      transliteration: item.name,
      total_verses: null,
      type: null,
    }));
    setCustomData(data);
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
            handleUpdate(currentKey, value);
          }}
        />
      </Dialog>
    );
  };

  // when there are too many entries
  const renderLimitDialog = () => {
    return (
      <Dialog
        isVisible={limitDialogVisible}
        overlayStyle={appStyles.deleteLimitDialog}
        onBackdropPress={() => setLimitDialogVisible(false)}
      >
        <Dialog.Title title="Too many entries" />
        <Text>{`The maximum number of entries is: ` + ENTRY_LIMIT}</Text>
        <Dialog.Actions>
          <Dialog.Button
            title="OK"
            onPress={() => setLimitDialogVisible(false)}
          />
        </Dialog.Actions>
      </Dialog>
    );
  };

  // Dialog to delete
  const renderDeleteDialog = () => {
    return (
      <Dialog
        isVisible={deleteDialogVisible}
        onBackdropPress={() => {
          setDeleteDialogVisible(false), setCurrentKey(null);
        }}
        overlayStyle={appStyles.deleteLimitDialog}
      >
        <Dialog.Title title="Please confirm to delete" />
        <Text style={appStyles.spacer}>
          If you have a date associated with this in the tracker it will also be
          deleted.
        </Text>

        <Dialog.Actions>
          <Dialog.Button
            title="Delete"
            buttonStyle={{ backgroundColor: colors.delete }}
            titleStyle={{ color: colors.light, fontWeight: "bold" }}
            onPress={deleteItem}
            containerStyle={{ paddingLeft: 10 }}
          />
          <Dialog.Button
            title="Cancel"
            type="outline"
            buttonStyle={{ borderColor: colors.dark }}
            titleStyle={{ color: colors.dark }}
            onPress={() => {
              setDeleteDialogVisible(false);
              setCurrentKey(null);
            }}
          />
        </Dialog.Actions>
      </Dialog>
    );
  };

  // render the list of custom items
  const renderList = () => {
    return items.map((item, index) => (
      <View key={item.id} style={{ flexDirection: "row" }}>
        <Icon
          name="delete"
          size={iconSizes.inputListIcons}
          color={colors.dark}
          onPress={() => {
            handleDeleteIcon(item.id);
          }}
          style={{ padding: 10 }}
        />
        <ListItem containerStyle={[appStyles.itemConainer, appStyles.shadow]}>
          <ListItem.Title>{item.name}</ListItem.Title>
          <Icon
            name="edit"
            size={iconSizes.inputListIcons}
            color={colors.dark}
            onPress={() => showInputDialog(item)}
          />
        </ListItem>
        {index > 0 ? (
          <Icon
            name="expand-less"
            size={iconSizes.carotSize}
            color={colors.dark}
            onPress={() => moveItemUp(index)}
          />
        ) : (
          <View
            style={{ width: iconSizes.carotSize, height: iconSizes.carotSize }}
          /> // Empty place holder because we don't need top arrow
        )}
        {index < items.length - 1 ? (
          <Icon
            size={iconSizes.carotSize}
            color={colors.dark}
            name="expand-more"
            onPress={() => moveItemDown(index)}
          />
        ) : (
          <View
            style={{ width: iconSizes.carotSize, height: iconSizes.carotSize }}
          /> // Empty place holder because we don't need bottom arrow
        )}
      </View>
    ));
  };

  // button to add a new item
  const renderEntryButton = () => {
    return (
      <Button
        title="New entry"
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

  // done button to close the input component
  const renderDoneButton = () => {
    return (
      <Button
        containerStyle={appStyles.doneButtonContainer}
        color={colors.dark}
        radius={"sm"}
        onPress={() => {
          handleDone();
          onDone(); // Call the onDone function from props
        }}
      >
        Done
      </Button>
    );
  };

  return (
    <View style={{ alignItems: "center" }}>
      {renderInputDialog()}
      {renderLimitDialog()}
      {renderDeleteDialog()}
      <ScrollView style={{ maxHeight: 400 }}>{renderList()}</ScrollView>
      {renderEntryButton()}
      {renderDoneButton()}
    </View>
  );
};

export default InputComponent;

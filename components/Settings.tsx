// About.tsx
import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Button, Text, ButtonGroup } from "@rneui/themed";

// Import components from other files
import {
  updateDays,
  updateLang,
  getDays,
  getLang,
  clearData,
} from "./storageutil";
import { appStyles, colors } from "../assets/styles";

const Settings: React.FC = () => {
  // number of days for each color settings also stored in async storage
  const [orangeValue, setOrangeValue] = useState(7);
  const [redValue, setRedValue] = useState(14);
  // 0 is Arabic, 1 is English, also stored in async storage
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  // Flip and off for testing
  const TESTING = false;

  // Load the data when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result_days = await getDays();
        setOrangeValue(result_days.orange);
        setRedValue(result_days.red);
        const lang = await getLang();
        setSelectedLanguage(lang ? 0 : 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Increase/Decrease the number of days for each color
  const handleIncreaseOrange = () => {
    if (orangeValue < redValue - 1) {
      setOrangeValue(orangeValue + 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleDecreaseOrange = () => {
    if (orangeValue > 1) {
      setOrangeValue(orangeValue - 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleIncreaseRed = () => {
    if (redValue < 60) {
      setRedValue(redValue + 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  const handleDecreaseRed = () => {
    if (redValue > orangeValue + 1) {
      setRedValue(redValue - 1);
      updateDays({ orange: orangeValue, red: redValue });
    }
  };

  // if we are testing we want the ability to delete all data
  // Flip the switch at the top
  const renderMasterDelete = () => {
    if (TESTING) {
      return (
        <View>
          <View style={appStyles.divider} />
          <Button
            color="red"
            style={{ width: 200, alignSelf: "center" }}
            onPress={clearData}
          >
            Delete all data
          </Button>
        </View>
      );
    } else {
      return "";
    }
  };

  // render the header on the page
  const renderHeader = () => {
    return (
      <View style={appStyles.headerContainer}>
        <View style={[appStyles.header, appStyles.shadow]}>
          <View style={appStyles.headerEmptySpace}></View>
          <View style={appStyles.container}>
            <Text style={appStyles.headerTitle}>Info</Text>
          </View>
          <View style={appStyles.headerEmptySpace}></View>
        </View>
      </View>
    );
  };

  // render about content
  const renderAbout = () => {
    return (
      <View style={appStyles.textContainer}>
        <Text style={appStyles.headingText}>
          <Text style={{ fontStyle: "italic" }}>Muraja3a</Text> means review
          {"\n"}
        </Text>
        <Text style={appStyles.infoText}>
          Quran memorization is a rewarding practice, but it’s important to also
          review what we’ve memorized. This app is a simple way to keep track of
          your Quran review.{"\n"}
        </Text>
        <Text style={appStyles.headingText}>How do I use it?{"\n"}</Text>
        <Text style={appStyles.infoText}>
          In the <Text style={{ fontWeight: "bold" }}>Surahs</Text> tab, tap on
          each Surah you want to review regularly. This adds it to the Tracker.
          Tap again if you want to remove it.
          {"\n"}
          {"\n"}
          After you review a Surah, go into the{" "}
          <Text style={{ fontWeight: "bold" }}>Tracker</Text> tab and tap the
          Surah. This updates the last review to the current date.{"\n"}
          {"\n"}Tap the date if you want to correct it to a custom date. Hold
          down the Surah if you want to clear the date.{"\n"}
        </Text>
        <Text style={appStyles.headingText}>Color Coding{"\n"}</Text>
        <Text style={appStyles.infoText}>
          In the <Text style={{ fontWeight: "bold" }}>Tracker</Text>, Surahs
          will remain{" "}
          <Text style={{ fontWeight: "bold", color: "green" }}>green</Text> as
          long as you review them regularly. If you start to slack off, they
          will turn{" "}
          <Text style={{ fontWeight: "bold", color: colors.infoOrange }}>
            orange
          </Text>{" "}
          and eventually to{" "}
          <Text style={{ fontWeight: "bold", color: colors.infoRed }}>red</Text>
          .
        </Text>
      </View>
    );
  };

  // render color coding settings
  const renderColorCoding = () => {
    return (
      <View style={appStyles.textContainer}>
        <Text style={appStyles.headingText}>
          Customize the color coding based on your Quran review plan.
          {"\n"}
        </Text>
        <View style={appStyles.colorCodeContainer}>
          <Button
            title="-"
            titleStyle={appStyles.buttonText}
            onPress={handleDecreaseOrange}
            buttonStyle={appStyles.button}
            color={colors.infoOrange}
          />
          <Button
            title="+"
            titleStyle={appStyles.buttonText}
            onPress={handleIncreaseOrange}
            color={colors.infoOrange}
            buttonStyle={appStyles.button}
          />
          <Text style={appStyles.infoText}>
            Surah turns <Text style={{ fontWeight: "bold" }}>orange</Text> after{" "}
            <Text style={{ fontWeight: "bold" }}>
              {orangeValue} {orangeValue > 1 ? "days" : "day"}
            </Text>
          </Text>
        </View>
        <View style={appStyles.colorCodeContainer}>
          <Button
            title="-"
            titleStyle={appStyles.buttonText}
            onPress={handleDecreaseRed}
            buttonStyle={appStyles.button}
            color={colors.infoRed}
          />
          <Button
            title="+"
            titleStyle={appStyles.buttonText}
            onPress={handleIncreaseRed}
            color={colors.infoRed}
            buttonStyle={appStyles.button}
          />
          <Text style={appStyles.infoText}>
            Surah turns <Text style={{ fontWeight: "bold" }}>red</Text> after{" "}
            <Text style={{ fontWeight: "bold" }}>
              {redValue} {redValue > 1 ? "days" : "day"}
            </Text>
          </Text>
        </View>
        <Text style={{ fontStyle: "italic" }}>
          *Note that you cannot set the orange value greater than the red value.
        </Text>
      </View>
    );
  };

  // render language selector
  const renderLanguageSelector = () => {
    return (
      <View style={appStyles.textContainer}>
        <Text style={appStyles.headingText}>
          Display langauge for chapter names
        </Text>
        <ButtonGroup
          buttons={["Arabic", "English"]}
          selectedIndex={selectedLanguage}
          textStyle={appStyles.buttonGroupText}
          onPress={(value) => {
            setSelectedLanguage(value);
            updateLang(value === 0 ? true : false);
          }}
          containerStyle={appStyles.buttonSelector}
          selectedButtonStyle={{ backgroundColor: colors.dark }}
          selectedTextStyle={{ color: colors.light }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      <ScrollView style={appStyles.spacer}>
        {renderAbout()}
        <View style={appStyles.divider} />
        {renderColorCoding()}
        <View style={appStyles.divider} />
        {renderLanguageSelector()}
        {renderMasterDelete()}
        <View style={appStyles.spacer} />
      </ScrollView>
    </View>
  );
};

export default Settings;

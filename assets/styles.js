// styles.js
import { StyleSheet } from "react-native";

// COLORS
export const colors = {
  dark: "#26547C",
  light: "#FCFCFC",
  pink: "#EF476F",
  sunglow: "##FFD166",
  emerald: "#06D6A0",
  tabPressed: "black",
  infoOrange: "orange",
  infoRed: "red",
  shortTimeAgo: "#FFD3A3",
  longTimeAgo: "#ffbaba",
  good: "#c9d5b5",
  neutral: "#eaddcf",
  buttonClick: 0.5,
  delete: "#C34A2C",
};

// ICON SIZES
export const iconSizes = {
  tabIconSize: 20,
  headerIconSize: 25,
  loadingIconSize: 100,
  inputListIcons: 20,
  carotSize: 40,
};

// FONTS
export const fonts = {
  tabTextSize: 12,
  infoHeadingSize: 16,
  infoTextSize: 16,
  headerTitleSize: 20,
  buttonTextSize: 20,
  buttonGroupTextSize: 16,
};

// BORDERS
export const borders = {
  width: 0.5,
  buttonRadius: 9,
  paddingSize: 20,
};

export const appStyles = StyleSheet.create({
  // HEADER
  safeAreaView: {
    backgroundColor: colors.dark,
    flex: 1,
  },
  headerContainer: {
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: borders.width,
    backgroundColor: colors.dark,
  },
  headerEmptySpace: {
    flex: 1,
    minHeight: 35,
  },
  headerTitle: {
    fontSize: fonts.headerTitleSize,
    fontWeight: "bold",
    color: colors.light,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    paddingVertical: 10,
  },
  // TAB BAR
  tabView: {
    flex: 1,
    backgroundColor: colors.light,
  },
  textPressed: {
    fontSize: fonts.tabTextSize,
    color: colors.tabPressed,
    fontWeight: "bold",
  },
  textNotPressed: {
    fontSize: fonts.tabTextSize,
    color: colors.light,
    fontWeight: "bold",
  },
  tabArea: {
    backgroundColor: colors.dark,
    borderTopWidth: borders.width,
    overflow: "hidden",
  },
  // TRACKER / EDIT
  chapter: {
    paddingVertical: 5,
    paddingHorizontal: borders.paddingSize,
    borderRadius: borders.buttonRadius,
  },
  chapterTitle: {
    flex: 1,
    textAlign: "right",
  },
  chapterDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  chapterContainer: {
    borderRadius: borders.buttonRadius,
    padding: 8,
  },
  // SETTINGS
  settingsContainer: {
    minHeight: 200,
    maxHeight: 700,
    width: 350,
    borderRadius: borders.buttonRadius,
    backgroundColor: colors.light,
  },
  doneButton: {
    borderRadius: borders.buttonRadius,
    width: 75,
  },
  doneButtonContainer: {
    alignSelf: "center",
    width: 75,
    paddingVertical: 10,
  },
  settingsText: {
    fontSize: fonts.infoTextSize,
    alignSelf: "center",
  },
  // INPUT
  inputDialog: {
    borderRadius: borders.buttonRadius,
    backgroundColor: colors.light,
    paddingBottom: 0,
    paddingTop: 10,
    paddingHorizontal: 5,
  },
  deleteLimitDialog: {
    borderRadius: borders.buttonRadius,
    backgroundColor: colors.light,
  },
  itemConainer: {
    padding: 5,
    width: 200,
    height: 30,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  newEntryButtonText: {
    fontSize: fonts.infoTextSize,
    color: colors.dark,
    paddingHorizontal: 5,
  },
  // INFO PAGE
  textContainer: {
    flex: 1,
    paddingHorizontal: borders.paddingSize,
  },
  headingText: {
    fontSize: fonts.infoHeadingSize,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoText: {
    fontSize: fonts.infoTextSize,
  },
  button: {
    borderRadius: borders.buttonRadius,
    width: 40,
    marginRight: 10,
  },
  buttonText: {
    color: colors.light,
    fontSize: fonts.buttonTextSize,
    fontWeight: "bold",
  },
  colorCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  buttonSelector: {
    marginTop: 10,
    maxWidth: 220,
    alignSelf: "center",
    backgroundColor: colors.light,
    marginVertical: 10,
  },
  buttonGroupText: {
    fontSize: fonts.buttonGroupTextSize,
    color: colors.dark,
  },
  divider: {
    height: 3,
    backgroundColor: colors.dark,
    marginVertical: borders.paddingSize,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});

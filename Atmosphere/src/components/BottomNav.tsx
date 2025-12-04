import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

type AppMode = "left" | "right";

const NAV_MODE_KEY = "navMode";

const leftModeTabs = [
  { id: "home", icon: "home", label: "Home", route: "Home" },
  { id: "search", icon: "magnify", label: "Search", route: "Search" },
  { id: "reels", icon: "filmstrip", label: "Reels", route: "Reels" },
  { id: "profile", icon: "account", label: "Profile", route: "Profile" },
];

const rightModeTabs = [
  { id: "launch", icon: "rocket", label: "Launch", route: "Launch" },
  { id: "trade", icon: "trending-up", label: "Trade", route: "Trade" },
  { id: "opportunities", icon: "briefcase", label: "Opportunities", route: "Opportunities" },
  { id: "meetings", icon: "calendar", label: "Meetings", route: "Meetings" },
];

const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [appMode, setAppMode] = useState<AppMode>("left");
  const [lastLeftPage, setLastLeftPage] = useState<string>(leftModeTabs[0].route);
  const [lastRightPage, setLastRightPage] = useState<string>(rightModeTabs[0].route);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NAV_MODE_KEY);
        if (stored === "left" || stored === "right") {
          setAppMode(stored);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(NAV_MODE_KEY, appMode);
      } catch (e) {
        // ignore
      }
    })();
  }, [appMode]);

  useEffect(() => {
    const name = route.name as string | undefined;
    if (!name) return;
    if (leftModeTabs.some((t) => t.route === name)) setLastLeftPage(name);
    if (rightModeTabs.some((t) => t.route === name)) setLastRightPage(name);
  }, [route.name]);

  const tabs = appMode === "left" ? leftModeTabs : rightModeTabs;

  const handleTabPress = (tabRoute: string) => {
    // navigate by route name — assumes screens use these names
    // If your app uses different names, update the `route` fields above to match.
    // @ts-ignore
    navigation.navigate(tabRoute);
  };

  const toggleMode = () => {
    if (appMode === "left") {
      setAppMode("right");
      handleTabPress(lastRightPage);
    } else {
      setAppMode("left");
      handleTabPress(lastLeftPage);
    }
  };

  const shouldHideMobileNav = false; // customize if there are screens that should hide the nav

  const isTabActive = (tabRoute: string) => {
    const current = route.name as string | undefined;
    if (!current) return false;
    return current === tabRoute;
  };

  if (shouldHideMobileNav) return null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {tabs.slice(0, 2).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.route)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={isTabActive(tab.route) ? "#ffffff" : "#9aa0a6"}
            />
            {/* optional label
            <Text style={[styles.label, isTabActive(tab.route) && styles.activeLabel]}>{tab.label}</Text>
            */}
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={toggleMode} style={styles.toggle} activeOpacity={0.8}>
          <View style={[styles.toggleTrack]}>
            <View style={[styles.toggleThumb, appMode === "left" ? styles.thumbLeft : styles.thumbRight]} />
          </View>
        </TouchableOpacity>

        {tabs.slice(2, 4).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(tab.route)}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={24}
              color={isTabActive(tab.route) ? "#ffffff" : "#9aa0a6"}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10,10,10,0.92)",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: "#9aa0a6",
    marginTop: 2,
  },
  activeLabel: {
    color: "#fff",
  },
  toggle: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTrack: {
    width: 56,
    height: 30,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 4,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#1f6fff",
  },
  thumbLeft: {
    alignSelf: "flex-start",
    marginLeft: 4,
  },
  thumbRight: {
    alignSelf: "flex-end",
    marginRight: 4,
  },
});

export default BottomNav;

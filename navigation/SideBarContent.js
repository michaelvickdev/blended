import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import { Icon } from '../components/Icon';
import { Colors } from '../config';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-paper';

import { useTheme, Avatar, Drawer } from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { signOut } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

export function SideBarContent(props) {
  const paperTheme = useTheme();

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[Colors.themeFirst, Colors.themeSecond]}
    >
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 20,
              marginBottom: 30,
            }}
          >
            <Avatar.Image
              source={{
                uri: 'https://randomuser.me/api/portraits/med/men/65.jpg',
              }}
              size={65}
            />
            <View style={{ flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  bold={true}
                  heading={true}
                  style={{ fontSize: 16, marginVertical: 12, marginRight: 6 }}
                >
                  j_doe
                </Text>
                <MaterialIcons name="verified" size={24} color="blue" />
              </View>
              <Text bold={true} heading={true} style={{ fontSize: 14 }}>
                Monthly Plan
              </Text>
              <Button
                color={Colors.white}
                textColor={Colors.black}
                mode="contained"
                uppercase={false}
                compact
                style={{ marginTop: 16, alignSelf: 'center', borderRadius: 10 }}
              >
                Cancel Subscription
              </Button>
            </View>
          </View>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={Colors.darkRed} size={size} />
          )}
          label={() => (
            <Text
              heading={true}
              bold={true}
              style={{ color: Colors.darkRed, fontSize: 16 }}
            >
              Sign Out
            </Text>
          )}
          onPress={() => {
            signOut();
          }}
          options={{
            drawerActiveTintColor: Colors.darkRed,
            drawerInactiveTintColor: Colors.darkRed,
          }}
        />
      </Drawer.Section>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

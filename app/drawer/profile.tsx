import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../../src/context/AppContext";
import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const { darkMode } = useContext(AppContext);
  const navigation = useNavigation<any>();

  const theme = darkMode ? dark : light;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.cardBg }]}
      edges={['top']}
    >
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

        <View style={[styles.header, {
          backgroundColor: theme.cardBg,
          borderBottomColor: theme.cardBorder
        }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => (navigation as any).openDrawer?.()}
              style={styles.iconBtn}
            >
              <Ionicons name="menu" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
          </View>
        </View>
        <View style={styles.content}>
          
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../src/assets/images/profile.jpeg")}
              style={styles.avatar}
            />
          </View>

          <View style={[styles.infoCard, { 
            backgroundColor: theme.cardBg, 
            borderColor: theme.accent 
          }]}>
            <Text style={[styles.name, { color: theme.text }]}>Maureen Alexandria</Text>
            <Text style={[styles.nim, { color: theme.subText }]}>NIM: 00000107632</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Ionicons name="book-outline" size={20} color={theme.subText} />
              <Text style={[styles.infoText, { color: theme.text }]}>IF670-ALEN</Text>
            </View>    

            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color={theme.subText} />
              <Text style={[styles.infoText, { color: theme.text }]}>
                maureen.alexandria@student.umn.ac.id
              </Text>
            </View>       

            <View style={styles.infoRow}>
              <Ionicons name="school-outline" size={20} color={theme.subText} />
              <Text style={[styles.infoText, { color: theme.text }]}>
                Universitas Multimedia Nusantara
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const light = {
  bg: "#FAF7F2",
  cardBg: "#FFFFFF",
  cardBorder: "#E8E0D5",
  text: "#1A1A1A",
  subText: "#9A8878",
  accent: "#C9703D",
};

const dark = {
  bg: "#1A1612",
  cardBg: "#26211C",
  cardBorder: "#3A3330",
  text: "#F5EFE6",
  subText: "#9A8C7E",
  accent: "#E8935A",
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 4,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "800", 
    letterSpacing: 0.3 
  },
  iconBtn: { padding: 6 },

  content: { 
    flex: 1, 
    padding: 16 
  },

  avatarContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#C9703D",
  },

  infoCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    elevation: 3,
  },
  name: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  nim: { fontSize: 15, marginBottom: 16 },
  divider: { 
    height: 1, 
    backgroundColor: "#eee", 
    marginVertical: 16,
    opacity: 0.6 
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  infoText: { fontSize: 15, flex: 1 },
});
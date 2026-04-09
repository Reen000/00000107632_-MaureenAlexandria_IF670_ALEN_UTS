import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../../src/context/AppContext";
import { useNavigation } from "@react-navigation/native";

export default function Wishlist() {
  const { 
    wishlist, 
    setWishlist, 
    setCart, 
    darkMode, 
    cart,
    toggleDark 
  } = useContext(AppContext);

  const navigation = useNavigation<any>();
  const theme = darkMode ? dark : light;

  const totalCartItems = cart.reduce((sum: number, p: any) => sum + (p.qty || 1), 0);

  const removeItem = (id: any) => {
    setWishlist((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const moveToCart = (item: any) => {
    setCart((prev: any) => {
      const existing = prev.find((p: any) => p.id === item.id);
      if (existing) {
        return prev.map((p: any) => 
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    removeItem(item.id);
  };

 const renderCard = ({ item }: { item: any }) => (
  <View style={[styles.card, { 
    backgroundColor: theme.cardBg, 
    borderColor: theme.accent 
  }]}>

    <View style={styles.cardInner}>
      <View style={styles.imgWrapper}>
        <Image 
          source={item.image} 
          style={styles.productImg} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.cardBody}>
        
        <View style={[styles.favBadge, { backgroundColor: theme.accent }]}>
          <Text style={styles.favBadgeText}>⭐ Fav</Text>
        </View>

        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: theme.accent }]}>
          ${item.price}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => moveToCart(item)}
            style={[styles.cartBtn, { backgroundColor: theme.accent }]}
          >
            <Ionicons name="cart-outline" size={16} color="#fff" />
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#E05555" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Wishlist</Text>
        </View>

      </View>

      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your wishlist is empty</Text>
          <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
            You haven't saved any items yet
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("index")}
            style={[styles.shopBtn, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.countText, { color: theme.subText }]}>
              {wishlist.length} saved item(s)
            </Text>
          }
        />
      )}
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
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "800", 
    letterSpacing: 0.3 
  },
  iconBtn: {
    padding: 6,
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 11,
  },

  listContent: { 
    padding: 14, 
    paddingBottom: 100 
  },
  countText: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 12,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgWrapper: {
    position: "relative",
  },
  productImg: {
    width: 110,
    height: 110,
    backgroundColor: "#ffffff",
  },
  favBadge: {
  position: "absolute",
  top: 8,
  right: 10,        
  zIndex: 10,
  borderRadius: 8,
  paddingHorizontal: 6,
  paddingVertical: 2,
},
  favBadgeText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "700" 
  },

  cardBody: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  name: { 
    fontSize: 14, 
    fontWeight: "700" 
  },
  price: { 
    fontSize: 15, 
    fontWeight: "800" 
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  cartBtnText: { 
    color: "#fff", 
    fontSize: 13, 
    fontWeight: "700" 
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 72 },
  emptyTitle: { fontSize: 20, fontWeight: "800" },
  emptySubtitle: { 
    fontSize: 14, 
    textAlign: "center", 
    lineHeight: 20 
  },
  shopBtn: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 20,
  },
  shopBtnText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 15 
  },
});
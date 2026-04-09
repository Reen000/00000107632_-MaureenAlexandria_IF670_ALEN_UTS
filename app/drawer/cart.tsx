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

export default function Cart() {
  const {
    cart,
    setCart,
    history,
    setHistory,
    generateID,
    darkMode,
    toggleDark
  } = useContext(AppContext);

  const navigation = useNavigation<any>();
  const theme = darkMode ? dark : light;

  const updateQty = (id: any, delta: number) => {
    setCart((prev: any) =>
      prev
        .map((item: any) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item: any) => item.qty > 0)
    );
  };

  const removeItem = (id: any) => {
    setCart((prev: any) => prev.filter((item: any) => item.id !== id));
  };

  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;

    const transaction = {
      id: generateID(),
      items: cart,
      total,
      date: new Date().toISOString(),
    };

    setHistory((prev: any) => [...prev, transaction]);
    setCart([]);

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "index" }],
      });
    }, 400);
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={[
      styles.card,
      {
        backgroundColor: theme.cardBg,
        borderColor: theme.accent
      }
    ]}>
      <Image source={item.image} style={styles.productImg} resizeMode="cover" />

      <View style={styles.cardBody}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.price, { color: theme.accent }]}>
          ${item.price}
        </Text>

        <View style={styles.quantityRow}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={() => updateQty(item.id, -1)}
              style={[styles.qtyBtn, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}
            >
              <Ionicons name="remove" size={18} color={theme.accent} />
            </TouchableOpacity>

            <Text style={[styles.qtyText, { color: theme.text }]}>{item.qty}</Text>

            <TouchableOpacity
              onPress={() => updateQty(item.id, 1)}
              style={[styles.qtyBtn, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}
            >
              <Ionicons name="add" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={22} color="#E05555" />
          </TouchableOpacity>
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
            <Text style={[styles.headerTitle, { color: theme.text }]}>Cart</Text>
          </View>

        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
              There are no items in your cart yet
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("index")}
              style={[styles.shopBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={renderCartItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={[styles.countText, { color: theme.subText }]}>
                  {cart.length} item(s) in cart
                </Text>
              }
            />

            <View style={[styles.totalContainer, {
              backgroundColor: theme.cardBg,
              borderTopColor: theme.accent
            }]}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: theme.subText }]}>Total</Text>
                <Text style={[styles.totalPrice, { color: theme.accent }]}>
                  ${total.toLocaleString('en-US')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={checkout}
                style={[styles.checkoutBtn, { backgroundColor: theme.accent }]}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutBtnText}>Checkout Now</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
  iconBtn: { padding: 6, position: "relative" },

  listContent: {
    padding: 14,
    paddingBottom: 200
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12
  },

  card: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    marginBottom: 12,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  productImg: { width: 110, height: 110 },

  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "700", marginBottom: 8 },

  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
    textAlign: "center",
  },
  removeBtn: { padding: 6 },

  totalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 34,
    borderTopWidth: 1.5,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  totalLabel: { fontSize: 15, fontWeight: "600" },
  totalPrice: { fontSize: 20, fontWeight: "800" },

  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 17,
    borderRadius: 20,
  },
  checkoutBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
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
  emptySubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  shopBtn: {
    marginTop: 12,
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 20,
  },
  shopBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
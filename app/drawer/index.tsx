import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from "react-native-swiper";
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../../src/context/AppContext";
import { useNavigation } from "@react-navigation/native";

type Category = "All" | "Pastries" | "Beverages";

export default function Home() {
  const { products, cart, setCart, toggleWishlist, isInWishlist, darkMode, toggleDark } =
    useContext(AppContext);
  const navigation = useNavigation<any>();

  const [activeFilter, setActiveFilter] = useState<Category>("All");

  const addToCart = (item: any) => {
    const existing = cart.find((p: any) => p.id === item.id);
    if (existing) {
      setCart((prev: any) =>
        prev.map((p: any) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setCart((prev: any) => [...prev, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id: any, delta: number) => {
    setCart((prev: any) =>
      prev
        .map((item: any) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item: any) => item.qty > 0)
    );
  };

  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price * (item.qty || 1), 0);

  const theme = darkMode ? dark : light;

  const totalCartItems = cart.reduce((sum: number, p: any) => sum + (p.qty || 1), 0);

  const sortItems = (list: any[]) =>
    [...list].sort((a, b) => {
      const aF = isInWishlist(a.id);
      const bF = isInWishlist(b.id);
      if (aF && !bF) return -1;
      if (!aF && bF) return 1;
      return 0;
    });

  const pastries = sortItems(products.filter((p: any) => p.category === "Pastries"));
  const beverages = sortItems(products.filter((p: any) => p.category === "Beverages"));

  const showPastries = activeFilter === "All" || activeFilter === "Pastries";
  const showBeverages = activeFilter === "All" || activeFilter === "Beverages";

  const filters: Category[] = ["All", "Pastries", "Beverages"];
  const filterEmoji: Record<Category, string> = {
    All: "📋",
    Pastries: "🥐",
    Beverages: "🥤",
  };

  const renderCard = (item: any) => {
    const isFav = isInWishlist(item.id);
    const cartItem = cart.find((p: any) => p.id === item.id);
    return (
      <View
        key={item.id}
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBg,
            borderColor: isFav ? theme.accent : theme.cardBorder,
          },
        ]}
      >
        {isFav && (
          <View style={[styles.favBadge, { backgroundColor: theme.accent }]}>
            <Text style={styles.favBadgeText}>⭐ Fav</Text>
          </View>
        )}
        <Image source={item.image} style={styles.productImg} resizeMode="contain" />
        <View style={styles.cardBody}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={[styles.price, { color: theme.accent }]}>${item.price}</Text>
          <View style={styles.row}>
            {cartItem ? (
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, -1)}
                  style={[styles.qtyBtn, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}
                >
                  <Ionicons name="remove" size={16} color={theme.accent} />
                </TouchableOpacity>

                <Text style={[styles.qtyText, { color: theme.text }]}>{cartItem.qty}</Text>

                <TouchableOpacity
                  onPress={() => updateQty(item.id, 1)}
                  style={[styles.qtyBtn, { backgroundColor: theme.cardBg, borderColor: theme.accent }]}
                >
                  <Ionicons name="add" size={16} color={theme.accent} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => addToCart(item)}
                style={[styles.addBtn, { backgroundColor: theme.accent }]}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => toggleWishlist(item)}>
              <Ionicons
                name={isFav ? "star" : "star-outline"}
                size={24}
                color={isFav ? "#FFD700" : theme.subText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderGrid = (items: any[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(
        <View key={i} style={styles.gridRow}>
          {renderCard(items[i])}
          {items[i + 1] ? renderCard(items[i + 1]) : <View style={styles.cardEmpty} />}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.cardBg }]}
      edges={['top']}
    >
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

        <View style={[styles.header, { backgroundColor: theme.cardBg, borderBottomColor: theme.cardBorder }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => (navigation as any).openDrawer?.()}
              style={styles.iconBtn}
            >
              <Ionicons name="menu" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.storeName, { color: theme.text }]}>Home</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleDark} style={styles.iconBtn}>
              <Ionicons
                name={darkMode ? "sunny" : "moon"}
                size={21}
                color={darkMode ? "#FFD700" : "#666"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("cart")}
            >
              <Ionicons name="cart-outline" size={24} color={theme.text} />
              {totalCartItems > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                  <Text style={styles.badgeText}>
                    {totalCartItems > 99 ? "99+" : totalCartItems}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={styles.swiperWrapper}>
            <Swiper
              autoplay
              loop
              autoplayTimeout={3}
              height={210}
              dotStyle={styles.dot}
              activeDotStyle={[styles.dot, { backgroundColor: "#fff", width: 16 }]}
              paginationStyle={{ bottom: 10 }}
            >
              {[
                require("../../src/assets/images/banner1.png"),
                require("../../src/assets/images/banner1.png"),
                require("../../src/assets/images/banner1.png"),
                require("../../src/assets/images/banner1.png"),
                require("../../src/assets/images/banner1.png"),
              ].map((src, index) => (
                <View key={index} style={{ flex: 1 }}>
                  <Image
                    source={src}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          </View>

          <View style={[styles.filterRow, { backgroundColor: theme.bg }]}>
            {filters.map((f) => {
              const active = activeFilter === f;
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setActiveFilter(f)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? theme.accent : theme.cardBg,
                      borderColor: active ? theme.accent : theme.cardBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, { color: active ? "#fff" : theme.subText }]}>
                    {filterEmoji[f]} {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {showPastries && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>🥐</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Pastries</Text>
                  <View style={[styles.sectionLine, { backgroundColor: theme.accent }]} />
                </View>
                <Text style={[styles.sectionCount, { color: theme.subText }]}>
                  {pastries.length} items
                </Text>
              </View>
              <View style={styles.grid}>{renderGrid(pastries)}</View>
            </View>
          )}

          {showBeverages && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionEmoji}>🥤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Beverages</Text>
                  <View style={[styles.sectionLine, { backgroundColor: theme.accent }]} />
                </View>
                <Text style={[styles.sectionCount, { color: theme.subText }]}>
                  {beverages.length} items
                </Text>
              </View>
              <View style={styles.grid}>{renderGrid(beverages)}</View>
            </View>
          )}

          <View style={{ height: cart.length > 0 ? 160 : 40 }} />
        </ScrollView>

        {cart.length > 0 && (
          <View style={[styles.totalContainer, {
            backgroundColor: theme.cardBg,
            borderTopColor: theme.accent
          }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.subText }]}>Total</Text>
              <Text style={[styles.totalPriceText, { color: theme.accent }]}>
                ${totalPrice.toLocaleString('en-US')}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("cart")}
              style={[styles.checkoutBtn, { backgroundColor: theme.accent }]}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>View Cart</Text>
              <Ionicons name="cart" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
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
  storeName: { fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
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

  swiperWrapper: { height: 210 },
  bannerImage: { width: "100%", height: 210 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.45)",
    marginHorizontal: 3,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontWeight: "700", fontSize: 13 },

  section: { marginBottom: 10, paddingHorizontal: 14 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionEmoji: { fontSize: 22 },
  sectionTitle: { fontSize: 17, fontWeight: "800", marginBottom: 4 },
  sectionLine: { height: 2.5, borderRadius: 99, width: "100%" },
  sectionCount: { fontSize: 12, fontWeight: "600" },

  grid: { gap: 10 },
  gridRow: { flexDirection: "row", gap: 10 },
  cardEmpty: { flex: 1 },
  card: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  favBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  favBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  productImg: {
    width: "100%",
    height: 110,
    backgroundColor: "#ffffff",
  },
  cardBody: { padding: 10 },
  name: { fontSize: 13, fontWeight: "700", marginBottom: 2 },
  price: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 32
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

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
  totalPriceText: { fontSize: 20, fontWeight: "800" },

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

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
});
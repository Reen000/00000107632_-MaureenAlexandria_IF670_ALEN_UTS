import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../../src/context/AppContext";
import { useNavigation } from "@react-navigation/native";

export default function History() {
  const { history, darkMode } = useContext(AppContext);
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const theme = darkMode ? dark : light;

  const filteredHistory = history
    .filter((item: any) => {
      if (!item || !item.id) return false;
      return item.id.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a: any, b: any) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0;
      const dateB = b?.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  const renderHistoryItem = ({ item }: { item: any }) => {
    const formattedDate = item?.date
      ? new Date(item.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : "-";

    const totalItems = item.items?.length || 0;
    const isExpanded = expandedIds.includes(item.id);
    const visibleItems = isExpanded ? item.items : item.items?.slice(0, 3);

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => toggleExpand(item.id)}
        style={[styles.card, { 
          backgroundColor: theme.cardBg, 
          borderColor: theme.accent 
        }]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.transactionId, { color: theme.subText }]}>
              #{item.id}
            </Text>
            <Text style={[styles.dateText, { color: theme.subText }]}>
              {formattedDate}
            </Text>
          </View>
          <Text style={[styles.totalPrice, { color: theme.accent }]}>
            ${item.total?.toLocaleString('en-US') || 0}
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {visibleItems?.map((product: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={product.image}
                style={styles.smallImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                  {product?.name}
                </Text>
                <Text style={[styles.itemDetail, { color: theme.subText }]}>
                  {product?.qty} × ${product?.price}
                </Text>
                {product?.note ? (
                  <Text style={[styles.itemNote, { color: theme.subText }]}>
                    Note: {product.note}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
          {totalItems > 3 && !isExpanded && (
            <Text style={[styles.moreItems, { color: theme.subText }]}>
              +{totalItems - 3} more item(s) (tap to view details)
            </Text>
          )}
          {isExpanded && (
            <Text style={[styles.moreItems, { color: theme.subText, textAlign: 'center' }]}>
              Close details
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
            <Text style={[styles.headerTitle, { color: theme.text }]}>History</Text>
          </View>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No History</Text>
            <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
              You haven't made any purchases yet
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
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={theme.subText} style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, {
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                  borderColor: theme.accent
                }]}
                placeholder="Search transaction ID..."
                placeholderTextColor={theme.subText}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <FlatList
              data={filteredHistory}
              keyExtractor={(item: any) => item.id.toString()}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 14,
  },
  searchIcon: {
    position: "absolute",
    left: 16,
    zIndex: 10
  },
  searchInput: {
    flex: 1,
    paddingLeft: 48,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
  },

  listContent: { padding: 14, paddingBottom: 80 },

  card: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    marginBottom: 14,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  transactionId: { fontSize: 13, fontWeight: "600" },
  dateText: { fontSize: 12, marginTop: 4 },
  totalPrice: { fontSize: 18, fontWeight: "800" },

  itemsContainer: { padding: 14 },
  itemRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center"
  },
  smallImage: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 12
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14.5, fontWeight: "600" },
  itemDetail: { fontSize: 12.5 },
  itemNote: { 
    fontSize: 12, 
    fontStyle: "italic", 
    marginTop: 4 
  },

  moreItems: {
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 8
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
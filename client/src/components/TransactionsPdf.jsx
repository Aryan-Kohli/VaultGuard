import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import React from "react";

export default function TransactionsPdf({ transactions, myaddress }) {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      backgroundColor: "#FFFFFF",
    },
    header: {
      textAlign: "center",
      marginBottom: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      fontFamily: "Helvetica-Bold", // Stylish font
      color: "#4A90E2", // Vibrant blue
      marginBottom: 5,
    },
    tagline: {
      fontSize: 14,
      fontStyle: "italic",
      color: "#6B8E23", // Olive green
      marginBottom: 10,
    },
    address: {
      fontSize: 14,
      color: "#F76C6C", // Soft red
      marginBottom: 20,
    },
    transactionsContainer: {
      marginTop: 10,
    },
    transactionRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
      paddingBottom: 10,
      borderBottom: "1px solid #ddd",
    },
    index: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#4A90E2", // Blue for index numbers
      marginRight: 10,
    },
    transactionDetail: {
      fontSize: 12,
      color: "#333", // Dark gray
      flex: 1,
    },
    transactionTimestamp: {
      marginLeft: 10,
      fontSize: 10,
      color: "#888", // Light gray
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>VAULTGUARD</Text>
          <Text style={styles.tagline}>Decentralized File Storage System</Text>
          <Text style={styles.address}>Account Number: {myaddress}</Text>
        </View>

        {/* Transactions */}
        <View style={styles.transactionsContainer}>
          {transactions.map((transaction, index) => (
            <View key={index} style={styles.transactionRow}>
              <Text style={styles.transactionDetail}>
                <Text style={styles.index}>{index + 1}.</Text>
                {transaction[0] || "No details available"}
              </Text>
              <Text style={styles.transactionTimestamp}>
                {new Date(transaction[1]).toLocaleString() || "N/A"}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}

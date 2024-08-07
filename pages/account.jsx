import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Text, Button } from "react-native-paper";
import ChangePackageModal from "../components/Changepackage";
import Confirmpayment from "../components/Confirmpayment";
import Makepayment from "../components/Makepayment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuspendAccountModal from "../components/Suspendaccount";
import ChangeWiFiModal from "../components/Changewifi";

const Accounts = () => {
  const [modals, setModals] = useState({
    makePaymentVisible: false,
    confirmPaymentVisible: false,
    changePackageVisible: false,
    suspendAccountVisible: false,
    changeWiFiVisible: false,
  });

  const [currentAccount, setCurrentAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    setLoading(true);
    setError(null);
    try {
      const domain = await AsyncStorage.getItem("userdomain");
      const token = await AsyncStorage.getItem("userToken");
      if (!domain) {
        Alert.alert("Error", "Domain not found in local storage.");
        setLoading(false);
        return;
      }

      const response = await fetch(`https://${domain}/api/customer/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch account data");
      }

      const data = await response.json();
      if (Array.isArray(data.data)) {
        setTimeout(() => {
          setAccounts(data.data);
          setLoading(false);
        }, 2000);
        ToastAndroid.show(data.message, ToastAndroid.LONG);
      } else {
        Alert.alert("Error", "Unexpected data format.");
        setLoading(false);
      }
    } catch (error) {
      setError("Failed to fetch account data");
      setLoading(false);
    }
  };

  const handleModalClose = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleModalOpen = (modalName, account = null) => {
    setCurrentAccount(account);
    setModals((prev) => ({ ...prev, [modalName]: true }));
  };

  const handlePaymentSubmit = () => {
    handleModalClose("makePaymentVisible");
  };

  const handleSuspendSubmit = () => {
    handleModalClose("suspendAccountVisible");
    fetchAccountData();
  };

  const handleConfirmPaymentSubmit = () => {
    handleModalClose("confirmPaymentVisible");
  };

  const handleChangePackageSubmit = (newPackage) => {
    handleModalClose("changePackageVisible");
  };

  const handleChangeWiFiSubmit = () => {
    handleModalClose("changeWiFiVisible");
  };

  const updateAccountStatus = (accountNumber, suspended) => {
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) =>
        account.account_number === accountNumber
          ? { ...account, status: suspended ? "suspended" : "active" }
          : account
      )
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchAccountData} style={styles.reloadButton}>
            Reload
          </Button>
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0077b6" />
      ) : (
        accounts &&
        accounts.map((account, index) => (
          <View key={index} style={styles.accountContainer}>
            <Text style={styles.accountNumber}>
              ACCOUNT NUMBER:{" "}
              <Text style={styles.accountNumberHighlight}>
                {account.account_number}
              </Text>
            </Text>
            <Text style={styles.label}>
              EXPIRY: <Text style={styles.value}>{account.expiry}</Text>
            </Text>
            <Text style={styles.label}>
              TYPE: <Text style={styles.value}>{account.account_type}</Text>
            </Text>
            <Text style={styles.label}>
              STATUS: <Text style={styles.value}>{account.status}</Text>
            </Text>
            <Text style={styles.label}>
              PACKAGE: <Text style={styles.value}>{account.package}</Text>
            </Text>
            <Text style={styles.label}>
              AVAILABLE BALANCE:{" "}
              <Text style={styles.value}>{account.balance || "N/A"}</Text>
            </Text>
            <Text style={styles.label}>
              LOCATION:{" "}
              <Text style={styles.value}>{account.location || "N/A"}</Text>
            </Text>

            <Button
              mode="contained"
              style={styles.confirmButton}
              onPress={() => handleModalOpen("confirmPaymentVisible", account)}
            >
              Confirm Payment
            </Button>
            <Button
              mode="contained"
              style={styles.paymentButton}
              onPress={() => handleModalOpen("makePaymentVisible", account)}
            >
              Make Payment
            </Button>
            <Button
              mode="contained"
              style={styles.changePackageButton}
              onPress={() => handleModalOpen("changePackageVisible", account)}
            >
              Change Package
            </Button>
            <Button
              mode="contained"
              style={[
                styles.suspendAccountButton,
                {
                  backgroundColor:
                    account.status === "suspended" ? "#00ff00" : "#ff0000",
                },
              ]}
              onPress={() => handleModalOpen("suspendAccountVisible", account)}
            >
              {account.status === "suspended"
                ? "Unsuspend Account"
                : "Suspend Account"}
            </Button>

            {account.account_type !== "hotspot" && (
              <Button
                mode="contained"
                style={styles.changeWiFiButton}
                onPress={() => handleModalOpen("changeWiFiVisible", account)}
              >
                Change WiFi
              </Button>
            )}
          </View>
        ))
      )}

      <Makepayment
        visible={modals.makePaymentVisible}
        onClose={() => handleModalClose("makePaymentVisible")}
        onSubmit={handlePaymentSubmit}
        accountId={currentAccount ? currentAccount.id : null}
        accountNumber={currentAccount ? currentAccount.account_number : null}
      />

      <Confirmpayment
        visible={modals.confirmPaymentVisible}
        onClose={() => handleModalClose("confirmPaymentVisible")}
        onSubmit={handleConfirmPaymentSubmit}
      />

      <ChangePackageModal
        visible={modals.changePackageVisible}
        onClose={() => handleModalClose("changePackageVisible")}
        onSubmit={handleChangePackageSubmit}
        accountId={currentAccount ? currentAccount.id : null}
        accountNumber={currentAccount ? currentAccount.account_number : null}
        account_type={currentAccount ? currentAccount.account_type : null}
      />

      <SuspendAccountModal
        visible={modals.suspendAccountVisible}
        onClose={() => handleModalClose("suspendAccountVisible")}
        onSubmit={handleSuspendSubmit}
        accountNumber={currentAccount ? currentAccount.account_number : null}
        isSuspended={
          currentAccount ? currentAccount.status === "suspended" : false
        }
        onUpdateAccountStatus={updateAccountStatus}
      />

      <ChangeWiFiModal
        visible={modals.changeWiFiVisible}
        onClose={() => handleModalClose("changeWiFiVisible")}
        onSubmit={handleChangeWiFiSubmit}
        accountId={currentAccount ? currentAccount.id : null}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
  },
  accountContainer: {
    padding: 10,
    backgroundColor: "#2E97C0",
    borderRadius: 8,
    marginBottom: 10,
    width: "90%",
  },
  accountNumber: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  accountNumberHighlight: {
    color: "yellow",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 2,
  },
  value: {
    fontWeight: "normal",
    color: "yellow",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "gray",
  },
  paymentButton: {
    marginTop: 10,
    backgroundColor: "#008000",
  },
  changePackageButton: {
    marginTop: 10,
    backgroundColor: "#ff8c00",
  },
  suspendAccountButton: {
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  changeWiFiButton: {
    marginTop: 10,
    backgroundColor: "#00BFFF",
  },
  errorContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  reloadButton: {
    backgroundColor: "#0077b6",
  },
});

export default Accounts;

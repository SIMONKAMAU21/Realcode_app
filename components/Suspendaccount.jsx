import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";

const SuspendAccountModal = ({
  visible,
  onClose,
  accountNumber,
  isSuspended,
  onUpdateAccountStatus,
}) => {
  const handleSuspendAccountSubmit = async () => {
    try {
      const domain = await AsyncStorage.getItem("userdomain");
      const token = await AsyncStorage.getItem("userToken");

      if (!domain || !token) {
        Alert.alert("Error", "Missing domain or token.");
        return;
      }

      const endpoint = isSuspended
        ? `https://${domain}/api/unsuspend/account`
        : `https://${domain}/api/suspend/account`;


      const response = await axios.post(
        endpoint,
        { account_number: accountNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (response.data.success) {
        ToastAndroid.show(
          isSuspended ? response.data.message : response.data.message,
          ToastAndroid.SHORT
        );
        onUpdateAccountStatus(accountNumber, !isSuspended);
        onClose();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to suspend account. " + error.message);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {isSuspended ? "Unsuspend Account" : "Suspend Account"}
          </Text>
          <Text style={styles.modalText}>
            Are you sure you want to {isSuspended ? "unsuspend" : "suspend"}{" "}
            this account?
          </Text>
          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              style={styles.cancelButton}
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              style={styles.submitButton}
              onPress={handleSuspendAccountSubmit}
            >
              {isSuspended ? "Unsuspend" : "Suspend"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#808080",
  },
  submitButton: {
    backgroundColor: "#ff0000",
  },
});

export default SuspendAccountModal;

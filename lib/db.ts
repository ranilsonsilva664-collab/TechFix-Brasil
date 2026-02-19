import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    Timestamp,
    getDocs
} from "firebase/firestore";
import { db } from "./firebase";
import { ServiceOrder, FixedExpense, InventoryItem } from "../types";

// Collection names
const CUSTOMERS_COL = "customers";
const ORDERS_COL = "serviceOrders";
const EXPENSES_COL = "fixedExpenses";
const INVENTORY_COL = "inventory";

// Helpers to get user-scoped collection path
const getUserCollection = (userId: string, collectionName: string) => {
    return collection(db, "users", userId, collectionName);
};

// Helper to remove undefined values (required for Firestore)
const cleanData = (data: any) => {
    const clean: any = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            clean[key] = data[key];
        }
    });
    return clean;
};

export const dbService = {
    // Customers
    subscribeCustomers: (userId: string, callback: (data: any[]) => void) => {
        const q = query(getUserCollection(userId, CUSTOMERS_COL), orderBy("name"));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            callback(data);
        });
    },

    addCustomer: async (userId: string, customer: any) => {
        try {
            return await addDoc(getUserCollection(userId, CUSTOMERS_COL), {
                ...cleanData(customer),
                createdAt: Timestamp.now()
            });
        } catch (error) {
            console.error("Error adding customer:", error);
            throw error;
        }
    },

    updateCustomer: async (userId: string, id: string, updates: any) => {
        try {
            const docRef = doc(db, "users", userId, CUSTOMERS_COL, id);
            return await updateDoc(docRef, cleanData(updates));
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    },

    deleteCustomer: async (userId: string, id: string) => {
        const docRef = doc(db, "users", userId, CUSTOMERS_COL, id);
        return deleteDoc(docRef);
    },

    // Service Orders
    subscribeOrders: (userId: string, callback: (data: ServiceOrder[]) => void) => {
        const q = query(getUserCollection(userId, ORDERS_COL), orderBy("createdAt", "desc"));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as ServiceOrder[];
            callback(data);
        });
    },

    addOrder: async (userId: string, order: Omit<ServiceOrder, "id">) => {
        try {
            return await addDoc(getUserCollection(userId, ORDERS_COL), {
                ...cleanData(order),
                createdAt: Timestamp.now().toDate().toISOString() // Keep ISO for compatibility
            });
        } catch (error) {
            console.error("Error adding order:", error);
            throw error;
        }
    },

    updateOrder: async (userId: string, id: string, updates: Partial<ServiceOrder>) => {
        try {
            const docRef = doc(db, "users", userId, ORDERS_COL, id);
            return await updateDoc(docRef, cleanData(updates));
        } catch (error) {
            console.error("Error updating order:", error);
            throw error;
        }
    },

    deleteOrder: async (userId: string, id: string) => {
        const docRef = doc(db, "users", userId, ORDERS_COL, id);
        return deleteDoc(docRef);
    },

    // Inventory
    subscribeInventory: (userId: string, callback: (data: InventoryItem[]) => void) => {
        const q = query(getUserCollection(userId, INVENTORY_COL));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as InventoryItem[];
            callback(data);
        });
    },

    addInventoryItem: async (userId: string, item: Omit<InventoryItem, "id">) => {
        try {
            return await addDoc(getUserCollection(userId, INVENTORY_COL), cleanData(item));
        } catch (error) {
            console.error("Error adding item:", error);
            throw error;
        }
    },

    updateInventoryItem: async (userId: string, id: string, updates: Partial<InventoryItem>) => {
        try {
            const docRef = doc(db, "users", userId, INVENTORY_COL, id);
            return await updateDoc(docRef, cleanData(updates));
        } catch (error) {
            console.error("Error updating item:", error);
            throw error;
        }
    },

    deleteInventoryItem: async (userId: string, id: string) => {
        const docRef = doc(db, "users", userId, INVENTORY_COL, id);
        return deleteDoc(docRef);
    },

    // Expenses
    subscribeExpenses: (userId: string, callback: (data: FixedExpense[]) => void) => {
        const q = query(getUserCollection(userId, EXPENSES_COL));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as FixedExpense[];
            callback(data);
        });
    },

    addExpense: async (userId: string, expense: Omit<FixedExpense, "id">) => {
        try {
            return await addDoc(getUserCollection(userId, EXPENSES_COL), cleanData(expense));
        } catch (error) {
            console.error("Error adding expense:", error);
            throw error;
        }
    },

    deleteExpense: async (userId: string, id: string) => {
        const docRef = doc(db, "users", userId, EXPENSES_COL, id);
        return deleteDoc(docRef);
    }
};

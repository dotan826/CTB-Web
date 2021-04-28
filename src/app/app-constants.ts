
/**
 * Development
 */
export const FRONT_END_URL = "http://localhost:4200/";
export const BACK_END_URL = "http://localhost:3080/";


/**
 * Login Constants
 */
export const APP_USER_ID = "CHECK_THE_BILL_USER_ID";
export const GUEST_USER_ID = "607a03a9823fc0eda4146f6f";


/**
 * Database
 */
export const REVENUE_COLLECTION_NAME = "Revenue";
export const EXPENSE_COLLECTION_NAME = "Expense";






/**
 * Else
 */

export interface SignInExistUser {
    email: string;
    password: string;
}

export interface SignInNewUser {
    name: string;
    email: string;
    password: string;
}

export interface UserDetails {
    _id: string;
    name: string;
    occupation?: string;
    picture?: string;
}

export interface RevenueItem {
    _id: string;
    _uid: string;
    category: string;
    name: string;
    january?: number;
    february?: number;
    march?: number;
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
    notes?: string;
  }

export interface ExpenseItem {
    _id: string;
    _uid: string;
    category: string;
    name: string;
    january?: number;
    february?: number;
    march?: number;
    april?: number;
    may?: number;
    june?: number;
    july?: number;
    august?: number;
    september?: number;
    october?: number;
    november?: number;
    december?: number;
    notes?: string;
}


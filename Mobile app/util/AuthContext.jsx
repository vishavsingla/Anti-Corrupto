import { createContext, useContext, useState, useEffect } from "react";
import { deleteSessionToken, getSessionToken } from "./tokenStore";
import { fetchUserDetails, isSessionValid, logoutUser } from "./authApi";
import * as SplashScreen from "expo-splash-screen";
import { ToastAndroid } from "react-native";

SplashScreen.preventAutoHideAsync();

const AuthContext = createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(null);
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const checkUserAuth = async () => {
			try {
				const sessionToken = await getSessionToken();
				if (!sessionToken) {
					setAuthState(false);
					return;
				}

				const sessionValid = await isSessionValid(sessionToken);
				if (!sessionValid) {
					setAuthState(false);
					ToastAndroid.show(
						"Session expired, Please login again",
						ToastAndroid.SHORT
					);
				} else {
					const userDetails = await fetchUserDetails(sessionToken);
					console.log("User userDetails.data in Context: ", userDetails.data);

					if (userDetails && userDetails.data) {
						setUserData(userDetails.data);
						setAuthState(true);
					} else {
						setAuthState(false);
					}
				}
			} catch (error) {
				ToastAndroid.show("Error checking authentication.", ToastAndroid.SHORT);
				setAuthState(false);
			}
		};

		checkUserAuth();
		console.log("User userData in Context state: ", userData);
	}, []);

	useEffect(() => {
		if (authState !== null) {
			SplashScreen.hideAsync();
		}
	}, [authState]);

	const logOut = () => {
		setAuthState(false);
		logoutUser();
		deleteSessionToken();
	};

	const logIn = () => {
		setAuthState(true);
	};

	return (
		<AuthContext.Provider value={{ authState, logIn, logOut, userData }}>
			{children}
		</AuthContext.Provider>
	);
}

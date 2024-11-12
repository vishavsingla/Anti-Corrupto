import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	View,
	Text,
	useColorScheme,
	TextInput,
	Pressable,
	TouchableOpacity,
	Image,
} from "react-native";
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { Collapsible } from "./Collapsible";
import { MotiView, MotiText } from "moti";
import { Skeleton } from "moti/skeleton";
import { AndroidButton } from "./AndroidButton";
import { getInquiryLandsById, updateInquiryStatus } from "../util/landInquiry";
import { fetchUserEmail } from "@/util/authApi";

interface Inquiry {
	name: string;
	email: string;
	status: string;
	clientId: string;
	inquiryId: string;
	contact: string;
}

interface Props {
	closeSheet: () => void;
	refresh: () => void;
	landId: string;
}
type Ref = BottomSheet;

const LandBuyersSheet = forwardRef<Ref, Props>((props, ref) => {
	const snapPoints = useMemo(() => ["80%", "95%"], []);

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		console.log("BottomSheet:", index);
		if (index === -1) {
			// setInquiries(null);
		}
	}, []);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
		),
		[]
	);

	const colorScheme = useColorScheme();
	const colors = {
		foreground: colorScheme === "dark" ? "#999999" : "#5f5f5f",
		background: colorScheme === "dark" ? "#151718" : "#ffffff",
		text: colorScheme === "dark" ? "#ffffff" : "#000000",
		button: colorScheme === "dark" ? "#4a4a4a" : "#5f5f5f",
		textInputBG: colorScheme === "dark" ? "#3a3a3a" : "#a7a7a7",
	};

	const colorMode = colorScheme == "dark" ? "dark" : "light";

	const [inquiries, setInquiries] = useState<Inquiry[] | null>(null);

	const handleApproval = async (inquiryId: String) => {
		try {
			const response = await updateInquiryStatus(inquiryId, "APPROVED");
			if (response.status === 200) console.log(response);
			else {
				console.log(response);
			}
		} catch (error) {
			console.error("Error approving land:", error);
		}
	};

	useEffect(() => {
		console.log("landId in sheet:", props.landId);
		console.log("inquiries in sheet:", inquiries);
	}, [inquiries, props.landId]);

	useEffect(() => {
		console.log("landId in bottomsheet:", props.landId);
		const filterClientsByLand = async (landId: String) => {
			const inquiryData = await getInquiryLandsById(landId);
			const clients = await Promise.all(
				inquiryData.map(
					async (inquiry: { clientId: any; id: any; status: any }) => {
						const clientData = await fetchUserEmail(inquiry.clientId);
						return {
							clientId: inquiry.clientId,
							inquiryId: inquiry.id,
							status: inquiry.status,
							email: clientData?.data?.email ?? "",
							name: clientData?.data?.name ?? "",
						};
					}
				)
			);
			setInquiries(clients);
			return clients;
		};

		filterClientsByLand(props.landId);
	}, []);

	return (
		<BottomSheet
			snapPoints={snapPoints}
			index={0}
			ref={ref}
			onChange={handleSheetChanges}
			enableOverDrag={false}
			enablePanDownToClose={true}
			backdropComponent={renderBackdrop}
			handleIndicatorStyle={{
				backgroundColor: colors.foreground,
			}}
			backgroundStyle={{
				backgroundColor: colors.background,
			}}
			style={{
				overflow: "hidden",
				borderTopRightRadius: 20,
				borderTopLeftRadius: 20,
			}}
		>
			{/* Skeleton view with fade-out animation */}
			<MotiView
				animate={{ opacity: inquiries ? 0 : 1 }}
				transition={{ type: "timing", duration: 500 }}
				style={{
					position: "absolute",
					width: "100%",
					zIndex: inquiries ? 0 : 1,
				}}
			>
				<BottomSheetScrollView
					showsVerticalScrollIndicator={false}
					style={{ flex: 1, padding: 24, paddingTop: 10 }}
				>
					{Array.from({ length: 5 }).map((_, i) => (
						<MotiView
							key={i}
							style={{
								flexDirection: "row",
								width: "100%",
								gap: 8,
								marginTop: 28,
							}}
						>
							<Skeleton colorMode={colorMode} radius="round" height={75} width={75} />
							<MotiView style={{ height: 16 }} />
							<MotiView style={{ flex: 1 }}>
								<Skeleton colorMode={colorMode} width={"100%"} />
								<MotiView style={{ height: 8 }} />
								<Skeleton colorMode={colorMode} width={"70%"} />
							</MotiView>
						</MotiView>
					))}
				</BottomSheetScrollView>
			</MotiView>

			{/* Data view with fade-in animation */}
			<MotiView
				animate={{ opacity: inquiries ? 1 : 0 }}
				transition={{ type: "timing", duration: 800 }}
				style={{ flex: 1, zIndex: inquiries ? 1 : 0 }}
			>
				{inquiries && inquiries?.length > 0 ? (
					<>
						<ThemedText type="subtitle" className="p-8 py-4 ">
							{inquiries.length}{" "}
							{inquiries.length !== 1 ? "people interested" : "person interested"}
						</ThemedText>

						<BottomSheetScrollView
							showsVerticalScrollIndicator={false}
							style={{
								flex: 1,
								padding: 24,
								paddingTop: 10,
							}}
						>
							{inquiries.map((item, index) => (
								<Collapsible
									titlerender={() => (
										<ThemedView className="flex-row">
											<Image
												source={{
													uri: "https://st4.depositphotos.com/9998432/22812/v/450/depositphotos_228123692-stock-illustration-person-gray-photo-placeholder-man.jpg",
												}}
												style={{ width: 70, height: 70, borderRadius: 35 }}
											/>
											<ThemedView className="pl-4 justify-center">
												<ThemedText type="defaultSemiBold">{item.name}</ThemedText>
												<ThemedText type="small">
													Status: <ThemedText type="link">{item.status}</ThemedText>
												</ThemedText>
											</ThemedView>
										</ThemedView>
									)}
									key={index}
								>
									<ThemedText type="small" className="pb-1">
										Hi! I would like to buy this land. Please let me know the details.
									</ThemedText>
									<ThemedText type="small" className="py-2 font-semibold">
										Contact Details:
									</ThemedText>
									<ThemedText type="link">+91 9781454594</ThemedText>
									<ThemedText type="link">{item.email}</ThemedText>

									{item.status === "PENDING" ? (
										<AndroidButton
											onPress={() => {
												handleApproval(item.inquiryId);
											}}
											style={undefined}
											innerStyle={undefined}
											className="rounded-lg mt-6 bg-[#0a7ea4]"
										>
											<Text className="text-center text-white">Approve</Text>
										</AndroidButton>
									) : null}
								</Collapsible>
							))}
							<View style={{ padding: 50 }}></View>
						</BottomSheetScrollView>
					</>
				) : (
					// Message when no buyers are available
					<View
						style={{
							flex: 1,
							marginBottom: 150,
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<ThemedText
							type="subtitle"
							style={{ color: colorMode == "dark" ? "#aeaeae" : "#4a4a4a" }}
						>
							No buyers yet...
						</ThemedText>
					</View>
				)}
			</MotiView>
		</BottomSheet>
	);
});

export default LandBuyersSheet;

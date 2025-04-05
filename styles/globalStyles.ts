import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        margin: 20,
        width: 'auto',
        alignItems: 'center',
        borderRadius: 50,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loginBackground: {
        flex: 1,
        resizeMode: "cover",
    },
    loginOverlay: {
        flex: 1,
        backgroundColor: "rgba(7, 24, 50, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    loginButton: {
        backgroundColor: "#10B981",
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 50,
        alignItems: "center",
        marginTop: 40,
        fontFamily: "Lato",
    },
    loginLogoContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 70,
    },
    loginLogo: {
        width: 75,
        height: 75,
    },
    loginContainer: {
        width: "60%",
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: "center",
        marginBottom: 80
    },
    loginTitle: {
        color: "white",
        marginBottom: 20,
        fontFamily: "Lato",
        fontSize: 22,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 26,
    },
    loginInputContainer: {
        width: "100%",
        marginBottom: 10,
    },
    loginInput: {
        width: "100%",
        padding: 15,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 25,
        marginBottom: 15,
        textAlign: "left",
        fontFamily: "Lato",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    loginInputLabel: {
        color: "#FFF",
        fontFamily: "Lato",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 14,
        paddingBottom: 8,
    },
    loginPasswordWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 15,
    },
    loginPasswordInput: {
        flex: 1,
        paddingVertical: 15,
        textAlign: "left",
        fontFamily: "Lato",
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '400',
    },
    loginIcon: {
        padding: 10,
    },
    patientContainer: {
        flex: 1,
        backgroundColor: '#F8FBFF',
        padding: 20,
    },
    patientNoDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "gray",
        marginTop: 20,
    },
    homepagePatientList: {
        marginRight: 20,
        paddingRight: 0,
    },
    homepageEmergency: {
        marginTop: 20,
        padding: 10,
    },
    settingsContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#F8FBFF',
        height: '100%',
    },
    profileScreenContainer: {
        width: '100%',
        flex: 1,
        backgroundColor: 'transparent',
    },
    profileScreenLoadingOverlay: {
        display: "flex",
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    profileScreenImageWrapper: {
        marginLeft: -30,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileScreenImageContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    profileScreenImage: {
        width: 120,
        height: 120,
        marginBottom: 10,
        borderRadius: 200,
        borderWidth: 6,
        borderColor: "#CEE8F2",
        alignItems: "center",
        backgroundColor: "#FFF",
        boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    },
    profileScreenCaregiverName: {
        color: 'white',
        fontSize: 16,
        paddingTop: 6,
    },
    profileScreenCaregiver: {
        color: 'white',
        fontSize: 12,
        paddingBottom: 6,
        paddingTop: 6,
    },
    profileScreenChangeImageText: {
        color: '#CEE8F2',
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#CEE8F2',
        padding: 10,
        borderRadius: 24,
    },
    profileScreenDetailsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: 400,
        backgroundColor: '#F8FBFF',
    },
    profileScreenDetailText: {
        display: 'flex',
        columnGap: 35,
        fontSize: 16,
        marginBottom: 15,
        color: '#424242',

    },
    profileScreenDetailText1: {
        fontSize: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E2E2',
        paddingTop: 10,
        marginBottom: 20,
        color: '#424242',
        fontStyle: 'italic',
        marginRight: 20,
    },
    profileScreenDetailText2: {
        fontSize: 16,
        paddingTop: 10,
        marginBottom: 20,
        color: '#424242',
        fontStyle: 'italic',
    },
    profileScreenDetailText3: {
        fontSize: 16,
        marginBottom: 20,
        color: '#424242',
    },
    profileScreenBackgroundImage: {
        width: "110%",
        height: 308,
        padding: 0,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    profileScreenIcons: {
        height: 16,
        paddingTop: 1,
    },


});

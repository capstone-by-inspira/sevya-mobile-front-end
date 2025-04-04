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

});

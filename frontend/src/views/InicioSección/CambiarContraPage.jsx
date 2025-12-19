import { Box } from "@mui/material";
import Header from "../../components/Header";
import CambiarContraModal from "./CambiarContraModal";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../../components/UserContext";




const CambiarContraPage = () => {
    const { user } = useUser();
    const [openCambioContra, setOpenCambioContra] = useState(false);

    useEffect(() => {
        if (user?.requiresPasswordChange) {
            setOpenCambioContra(true);
        }
    }, [user]);

    return (
        <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>

            {!openCambioContra && <Header />}

            <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>


                <CambiarContraModal
                    open={openCambioContra}
                    mandatory
                    onClose={() => { }}
                    onSuccess={() => setOpenCambioContra(false)}
                />
            </Box>
        </Box>
    );
};

export default CambiarContraPage;

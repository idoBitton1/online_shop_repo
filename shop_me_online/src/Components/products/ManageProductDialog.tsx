import React from "react";

//material ui
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";

interface MyProps {
    is_open: boolean,
    toggleDialog: () => void
}

export const ManageProductDialog: React.FC<MyProps> = ({is_open, toggleDialog}) => {

    return (
        <Dialog open={is_open} onClose={toggleDialog} fullWidth>
            <DialogTitle>
                <Typography
                    fontSize={25}
                    borderBottom={1}
                    borderColor={"lightgray"}
                    gutterBottom>
                    Add Product
                </Typography>
            </DialogTitle>

            <DialogContent></DialogContent>
        </Dialog>
    );
}
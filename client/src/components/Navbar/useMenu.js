import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import React, {useState} from "react";
import {Badge, IconButton, Menu, MenuItem} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import BLAvatar from "./BLAvatar";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {logout as logUserOut} from "../../actions/authActions";

export const useMenu = () => {
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const history = useHistory();

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = "primary-search-account-menu";

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            {user ? (
                <MenuItem
                    onClick={() => {
                        handleMenuClose();
                        logout();
                    }}
                >
                    Logout
                </MenuItem>
            ) : (
                <MenuItem onClick={handleMenuClose}>
                    Login
                </MenuItem>
            )}
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 2 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={2} color="error">
                        <NotificationsIcon/>
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    {user ? (
                        <BLAvatar name={user.name} src={user?.imageUrl}/>
                    ) : (
                        <AccountCircle/>
                    )}
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const logout = () => {
        dispatch(logUserOut());
        history.push("/login");
    };

    return {
        user,
        menuId,
        mobileMenuId,
        handleMobileMenuOpen,
        handleProfileMenuOpen,
        renderMenu,
        renderMobileMenu
    };
};
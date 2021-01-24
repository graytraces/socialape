import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

//MUI stuff
import {
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Badge,
} from "@material-ui/core";

//Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

//Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";
import relativeTime from "dayjs/plugin/relativeTime";

const Notifications = (props) => {
  const [anchorElement, setAnchorElement] = useState(null);

  const handleOpen = (event) => {
    setAnchorElement(event.target);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const onMenuOpened = () => {
    let unreadNotificationsIds = props.notifications
      .filter((not) => !not.read)
      .map((not) => not.notificationId);
    props.markNotificationsRead(unreadNotificationsIds);
  };
  const notifications = props.notifications;
  const anchorEl = anchorElement;

  dayjs.extend(relativeTime);

  let notificationsIcon;
  if (notifications && notifications.length > 0) {
    let unreadNotificationLength = notifications.filter(
      (not) => not.read === false
    ).length;
    unreadNotificationLength > 0
      ? (notificationsIcon = (
          <Badge badgeContent={unreadNotificationLength} color="secondary">
            <NotificationsIcon />
          </Badge>
        ))
      : (notificationsIcon = <NotificationsIcon />);
  } else {
    notificationsIcon = <NotificationsIcon />;
  }

  let notificationsMarkup =
    notifications && notifications.length > 0 ? (
      notifications.map((not) => {
        const verb = not.type === "like" ? "liked" : "commented on";
        const time = dayjs(not.createdAt).fromNow();
        const iconColor = not.read ? "primary" : "secondary";
        const icon =
          not.type === "like" ? (
            <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
          ) : (
            <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
          );
        return (
          <MenuItem key={not.createdAt} onClick={handleClose}>
            {icon}
            <Typography
              component={Link}
              color="default"
              variant="body1"
              to={`/users/${not.recipient}/scream/${not.screamId}`}
            >
              {not.sender} {verb} your scream {time}
            </Typography>
          </MenuItem>
        );
      })
    ) : (
      <MenuItem onClick={handleClose}>
        You have no notifications yet
      </MenuItem>
    );

  return (
    <Fragment>
      <Tooltip placement="top" title="Notifications">
        <IconButton
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={handleOpen}
        >
          {notificationsIcon}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        onEntered={onMenuOpened}
      >
        {notificationsMarkup}
      </Menu>
    </Fragment>
  );
};

const mapStatToProps = (state) => ({
  notifications: state.user.notifications,
});

const mapActionsToProps = {
  markNotificationsRead,
};

Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
};
export default connect(mapStatToProps, mapActionsToProps)(Notifications);

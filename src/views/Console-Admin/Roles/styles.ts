
// Have to change the style this an exemple for ts error

import {makeStyles} from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
    appbar: {
        backgroundColor: "#232E6A"
    },
    avatar: {
      color: "white",
      backgroundColor: "#5BC5F2",
      height: "30px",
      width: "30px",
      fontSize: "1rem",
      marginLeft: "-5px",
      display: "flex",
      overflow: "hidden",
      position: "relative",
      alignItems: "center",
      flexShrink: 0,
      lineHeight: 1,
      borderRadius: "50%",
      justifyContent: "center",
    },
    logoutIcon: {
      width: "15px",
      fill: "#5BC5F2",
    },
    listIcon: {
      minWidth: "35px",
    },
    logoIcon: {
      width: 150,
    },
    topBarButton: {
      color: "#FFF",
      margin: '0 12px',
      height: '100%',
      borderRadius: 0
    },
    activeButton: {
      borderBottom: '2px solid #5BC5F2',
      '& span': {
        marginTop: 2
      }
    }
}))

export default useStyles
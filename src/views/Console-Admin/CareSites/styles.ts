import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
    title: {
      borderBottom: "1px solid #D0D7D8",
      width: "100%",
      paddingTop: "80px",
      paddingBottom: "20px",
      marginBottom: "40px",
    },
    button : {
      backgroundColor: '#5BC5F2',
      color: "#FFF",
      borderRadius: 25,
      width: 125,
      margin: "24px 8px 24px 0"
    },
    bottomBar: {
      justifyContent: "flex-end",
      position: "fixed", 
      bottom: 0,
      backgroundColor: "#E6F1FD"
    }
  }));

export default useStyles
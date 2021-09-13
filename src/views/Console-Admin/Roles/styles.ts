import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
  title: {
    borderBottom: "1px solid #D0D7D8",
    width: "100%",
    paddingTop: "80px",
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  alert: {
    position: "fixed",
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
}))

export default useStyles

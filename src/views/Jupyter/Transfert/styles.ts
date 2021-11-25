import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
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
  validateButton: {
    width: "125px",
    backgroundColor: "#5BC5F2",
    color: "#FFF",
    borderRadius: "25px",
    "&:hover": {
      backgroundColor: "#499cbf",
    },
    alignSelf: "end",
    marginTop: 16,
  },
}))

export default useStyles

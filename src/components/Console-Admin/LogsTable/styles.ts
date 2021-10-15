import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
  jsonDisplay: {
    maxHeight: 100,
    backgroundColor: "#F5F2F1",
    width: "100%",
    overflowY: "scroll",
    wordWrap: "break-word",
    padding: 8,
  },
  swaggerMethod: {
    padding: "2px 12px",
    color: "#FFF",
    fontWeight: 700,
    borderRadius: 3,
  },
}))

export default useStyles

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
  dialog: {
    width: 800,
  },
  title: {
    " & h2": {
      fontSize: 18,
      fontFamily: "'Montserrat', sans-serif",
      color: "#0063AF",
      textTransform: "none",
      lineHeight: 2,
    },
  },
  filter: {
    marginBottom: 24,
  },
  infoIcon: {
    height: 20,
    margin: "0 5px -5px 0",
  },
  buttons: {
    backgroundColor: "#5BC5F2",
    color: "#FFF",
    borderRadius: 25,
    height: 50,
    margin: "4px 0",
  },
  table: {
    minWidth: 650,
  },
  tableHead: {
    height: 42,
    backgroundColor: "#D1E2F4",
    textTransform: "uppercase",
  },
  tableHeadCell: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0063AF",
    padding: "0 20px",
  },
  tableBodyRows: {
    height: 50,
    "&:nth-of-type(even)": {
      backgroundColor: "#FAF9F9",
    },
    "&:hover": {
      cursor: "pointer",
    },
  },
}))

export default useStyles

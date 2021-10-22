import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
  dialog: {
    width: 500,
  },
  filter: {
    marginBottom: 24,
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
  datePickers: {
    margin: "1em 0 1em 1em",
  },
  dateLabel: {
    width: "auto",
    marginRight: 8,
  },
  dateError: {
    color: "#f44336",
  },
  clearDate: {
    padding: 0,
    minWidth: 34,
    width: 34,
    maxWidth: 34,
  },
}))

export default useStyles

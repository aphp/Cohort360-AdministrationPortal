import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(() => ({
  title: {
    borderBottom: "1px solid #D0D7D8",
    width: "100%",
    paddingTop: "80px",
    paddingBottom: "20px",
    marginBottom: "20px",
  },
  filterButton: {
    backgroundColor: "#5BC5F2",
    color: "#FFF",
    borderRadius: 25,
    height: 40,
    fontSize: 14,
    marginBottom: 12,
  },
  filterChip: {
    margin: "0 6px 12px 6px",
    "&:last-child": {
      marginRight: 0,
    },
  },
}))

export default useStyles

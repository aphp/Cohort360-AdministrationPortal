import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
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
      height: 80,
      "&:nth-of-type(even)": {
        backgroundColor: "#FAF9F9",
      },
      "&:hover": {
        cursor: "pointer",
      },
    },
    loadingSpinnerContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    pagination: {
      margin: "10px 0",
      float: "right",
      "& button": {
        backgroundColor: "#fff",
        color: "#5BC5F2",
      },
      "& .MuiPaginationItem-page.Mui-selected": {
        color: "#0063AF",
        backgroundColor: "#FFF",
      },
    },
    alert: {
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: 100
    },
    roleColumn: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    infoIcon: {
      margin: "0 8px"
    },
    tooltip: {
    maxWidth: 500
    }
  })
);

export default useStyles;

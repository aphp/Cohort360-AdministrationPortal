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
    searchButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25,
      height: 50
    },
    chips: {
      margin: '0 6px 12px 6px',
      '&:last-child': {
        marginRight: 0
      }
    }
  })
);

export default useStyles;

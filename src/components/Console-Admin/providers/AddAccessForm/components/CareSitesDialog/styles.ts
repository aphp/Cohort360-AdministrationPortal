import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "calc(100% - 84px)",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      overflow: "auto",
    },
    dialog: {
      height: "calc(100% - 50px)"
    },
    title: {
      ' & h2': {
        fontSize: 18,
        fontFamily: "'Montserrat', sans-serif",
        color: '#0063AF',
        textTransform: 'none',
        lineHeight: 2
      }
    }
  })
);

export default useStyles;

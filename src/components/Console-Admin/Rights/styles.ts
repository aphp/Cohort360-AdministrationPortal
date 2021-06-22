import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    searchButton: {
      backgroundColor: '#5BC5F2',
      color: '#FFF',
      borderRadius: 25,
      height: 50,
      margin: '4px 0'
    },
    title: {
      margin: "12px 0"
    },
    alert: {
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: 100
    }
  })
);

export default useStyles;

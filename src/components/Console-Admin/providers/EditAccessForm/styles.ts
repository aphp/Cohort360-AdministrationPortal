import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  dialog: {
    width: 500
  },
  title: {
    ' & h2': {
      fontSize: 18,
      fontFamily: "'Montserrat', sans-serif",
      color: '#0063AF',
      textTransform: 'none',
      lineHeight: 2
    }
  },
  filter: {
    marginBottom: 24
  },
  datePickers: {
    margin: '1em 0 1em 1em'
  },
  label: {
    width: 'auto',
    marginRight: 8
  },
  error: {
    color: '#f44336'
  },
  clearDate: {
    padding: 0,
    minWidth: 34,
    width: 34,
    maxWidth: 34
  },
  buttonLabel: {
    display: 'inline'
  },
  infoIcon: {
    height: 20,
    margin: "0 5px -5px 0"
  }
}))

export default useStyles

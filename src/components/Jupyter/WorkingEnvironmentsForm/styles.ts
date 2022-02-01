import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  dialogTitle: {
    ' & h2': {
      fontSize: '18px',
      fontFamily: "'Montserrat', sans-serif",
      color: '#0063AF',
      textTransform: 'none',
      lineHeight: 2
    }
  },
  button: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 30,
    marginBottom: 12
  }
}))

export default useStyles

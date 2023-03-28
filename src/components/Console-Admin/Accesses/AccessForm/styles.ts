import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles(() => ({
  dialog: {
    width: 500
  },
  dialogTitle: {
    fontSize: 18,
    fontFamily: "'Montserrat', sans-serif",
    color: '#0063AF',
    textTransform: 'none',
    lineHeight: 2
  },
  button: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    height: 30
  },
  filter: {
    marginBottom: 24
  },
  error: {
    color: '#f44336'
  },
  infoIcon: {
    height: 20,
    margin: '0 5px -5px 0'
  }
}))

export default useStyles

import makeStyles from '@mui/styles/makeStyles'

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
  infoIcon: {
    height: 20,
    margin: '0 5px -5px 0'
  }
}))

export default useStyles

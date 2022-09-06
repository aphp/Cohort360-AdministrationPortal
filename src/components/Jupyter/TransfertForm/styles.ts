import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    margin: '1em',
    backgroundColor: 'white'
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
  validateButton: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    '&:hover': {
      backgroundColor: '#499cbf'
    },
    marginBottom: '4px 0'
  },
  list: {
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRadius: 4,
    maxHeight: 300,
    minHeight: 200,
    overflow: 'auto'
  },
  infoIcon: {
    height: 20,
    margin: '0 5px -5px 0'
  },
  radioGroup: {
    flexDirection: 'row',
    margin: '8px 1em 1em'
  }
}))

export default useStyles

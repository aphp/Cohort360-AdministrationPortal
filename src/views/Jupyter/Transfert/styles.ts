import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    margin: '1em',
    backgroundColor: 'white'
  },
  title: {
    borderBottom: '1px solid #D0D7D8',
    width: '100%',
    paddingTop: '80px',
    paddingBottom: '20px',
    marginBottom: '20px'
  },
  validateButton: {
    width: '125px',
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: '25px',
    '&:hover': {
      backgroundColor: '#499cbf'
    },
    alignSelf: 'end',
    marginBottom: 16
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
  }
}))

export default useStyles

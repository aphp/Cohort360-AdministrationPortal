import makeStyles from '@mui/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    margin: '1em',
    backgroundColor: 'white'
  },
  title: {
    borderBottom: '1px solid #D0D7D8',
    width: '100%',
    paddingTop: 80,
    paddingBottom: 20,
    marginBottom: 20
  },
  validateButton: {
    width: 125,
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
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
  },
  radioGroup: {
    flexDirection: 'row',
    margin: '8px 1em 1em'
  },
  selectAll: {
    marginRight: '2em',
    '& span': {
      fontWeight: 800
    }
  }
}))

export default useStyles

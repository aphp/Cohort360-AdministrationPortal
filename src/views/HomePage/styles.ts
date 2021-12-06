import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  title: {
    width: '100%',
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 32
  },
  box: {
    boxShadow: theme.shadows[1],
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    padding: 12
  },
  linkButton: {
    backgroundColor: '#5BC5F2',
    color: '#FFF',
    borderRadius: 25,
    width: '100%',
    marginBottom: 8,
    fontSize: 14
  }
}))

export default useStyles

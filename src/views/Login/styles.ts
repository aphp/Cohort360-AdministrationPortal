import { makeStyles } from '@material-ui/core/styles'

import BackgroundLogin from '../../assets/images/connect-croped-light.jpg'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    width: '100vw',
    boxSizing: 'border-box'
  },
  container: {
    height: '80%',
    width: '80%',
    margin: 'auto',
    boxShadow: theme.shadows[8],
    borderRadius: 6
  },
  rightPanel: {
    backgroundColor: '#FAFAFA',
    borderRadius: '0 6px 6px 0'
  },
  logo: {
    marginBottom: theme.spacing(2)
  },
  bienvenue: {
    fontSize: '15px'
  },
  image: {
    backgroundImage: `url(${BackgroundLogin})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '6px 0 0 6px'
  },
  form: {
    width: '100%',
    margin: theme.spacing(5, 0, 1)
  },
  submit: {
    marginTop: theme.spacing(2),
    backgroundColor: '#5BC5F2',
    color: 'white',
    height: '50px',
    width: '185px',
    borderRadius: '25px'
  },
  mention: {
    marginTop: '8px'
  }
}))

export default useStyles

import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useHistory } from "react-router-dom";
// import { AxiosError } from "axios";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import logo from "../../assets/images/logo1.png";
import { authenticate } from '../../services/authentication'
import { ErrorDialogProps } from '../../types'
// import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
// import { getLoginCsrfToken, submitLogin } from "services/authentication";
// import { LoginAction } from "reducers/me";
// import { buildPartialUser } from "services/userService";

import useStyles from "./styles"

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, setErrorLogin }) => {
  const _setErrorLogin = () => {
    if (setErrorLogin && typeof setErrorLogin === "function") {
      setErrorLogin(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>
          Votre code APH ou votre mot de passe est incorrect
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={_setErrorLogin}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

const Login = () => {
//   const history = useHistory();
  const classes = useStyles();
//   const dispatch = useDispatch();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorLogin, setErrorLogin] = useState<boolean>(false);

//   const [hasCsrfCookie, setHasCsrfCookie] = React.useState(false);
//   if (!hasCsrfCookie) {
//     getLoginCsrfToken()
//       .then((res: any) => {
//         console.log("Got csrf cookie", res);
//         setHasCsrfCookie(true);
//       })
//       .catch((err: AxiosError) => {
//         console.error("Error while getting csrf cookie", err);
//       });
//   }

//   const login = async () => {
//     try {
//       if (!username || !password) return setErrorLogin(true);

//       const response = await submitLogin(username, password);
//       console.log("Received from login: ", response);

//       if (!response) return setErrorLogin(true);
//       const { status, data } = response;

//       if (status === 200) {
//         dispatch({
//           type: "LOGIN",
//           payload: buildPartialUser(data.provider),
//         } as LoginAction);
//         localStorage.setItem(ACCES_TOKEN, data.tokens.access);
//         localStorage.setItem(REFRESH_TOKEN, data.tokens.refresh);

//         history.push("/home");
//       } else {
//         setErrorLogin(true);
//       }
//     } catch (err) {
//       setErrorLogin(true);
//     }
//   };

//   const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     login();
//   };

  const login = async () => {
    try {
      if (!username || !password) return setErrorLogin(true)

      const response = await authenticate(username, password)
      if (!response) return setErrorLogin(true)

      const { status, data = {} } = response
      if (status === 200) {
        // localStorage.setItem(ACCESS_TOKEN, data.jwt.access)
        // localStorage.setItem(REFRESH_TOKEN, data.jwt.refresh)
        console.log(`response`, response)
      } else {
        setErrorLogin(true)
      }
    } catch (err) {
      setErrorLogin(true)
    }
  }

  const _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };


  return (
    <>
      <Grid container component="main" className={classes.root}>
        <Grid item xs={false} sm={6} md={6} className={classes.image} />

        <Grid
          container
          item
          xs={12}
          sm={6}
          md={6}
          // elevation={6}
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.rightPanel}
        >
          <Grid
            container
            item
            xs={8}
            lg={6}
            direction="column"
            alignItems="center"
          >
            <img className={classes.logo} src={logo} alt="Logo Cohort360" />

            <Typography color="primary" className={classes.bienvenue}>
              Bienvenue ! Connectez-vous.
            </Typography>

            <form className={classes.form} noValidate onSubmit={_onSubmit}>
              <Grid container item direction="column" alignItems="center">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="Identifiant"
                  label="Identifiant"
                  name="Identifiant"
                  autoComplete="Identifiant"
                  autoFocus
                  onChange={(event) => setUsername(event.target.value)}
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="Votre mot de passe"
                  label="Votre mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                />

                <Button
                  disabled={!username || !password}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Connexion
                </Button>
              </Grid>

              {/* <Box mt={10} alignItems="center">
                <Footer />
              </Box> */}
            </form>
          </Grid>
        </Grid>
      </Grid>

      <ErrorDialog open={errorLogin !== false} setErrorLogin={setErrorLogin} />
    </>
  );
};

export default Login;
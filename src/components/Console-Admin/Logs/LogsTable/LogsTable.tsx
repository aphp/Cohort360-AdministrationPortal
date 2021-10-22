import React from "react"
import moment from "moment"

import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core"

import { Log } from "types"

import useStyles from "./styles"

type LogsTableProps = {
  loading: boolean
  logs?: Log[]
}

const LogsTable: React.FC<LogsTableProps> = ({ loading, logs }) => {
  const classes = useStyles()

  const setSwaggerMethodColor = (method?: string) => {
    switch (method) {
      case "GET":
        return "#61AFFE"
      case "DELETE":
        return "#F93E3E"
      case "PATCH":
        return "#50E3C2"
      case "POST":
        return "#49CC90"
      default:
        return "#FFF"
    }
  }

  return (
    <Grid container justify="center">
      {loading ? (
        <CircularProgress size={30} />
      ) : logs && logs.length > 0 ? (
        logs.map((log: Log) => {
          return (
            <Grid
              container
              component={Paper}
              style={{ padding: 12, marginBottom: 8 }}
            >
              <Grid
                container
                item
                justify="flex-start"
                xs={6}
                direction="column"
              >
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    {log.user_details?.provider_name}
                  </Typography>
                  <Typography>&nbsp;- {log.user}</Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Date :
                  </Typography>
                  <Typography>
                    &nbsp;
                    {log.requested_at
                      ? moment(log.requested_at).format("DD/MM/YYYY")
                      : "-"}
                  </Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    URL :
                  </Typography>
                  <Typography>&nbsp;{log.path}</Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Vue :
                  </Typography>
                  <Typography>&nbsp;{log.view}</Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Adresse IP:
                  </Typography>
                  <Typography>&nbsp;{log.remote_addr}</Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Hôte :
                  </Typography>
                  <Typography>&nbsp;{log.host}</Typography>
                </div>
              </Grid>
              <Grid
                container
                item
                xs={6}
                direction="column"
                alignItems="flex-end"
              >
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    ID :
                  </Typography>
                  <Typography>&nbsp;{log.id}</Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography
                    variant="h3"
                    style={{
                      lineHeight: 2,
                      backgroundColor: setSwaggerMethodColor(log.method),
                    }}
                    className={classes.swaggerMethod}
                  >
                    {log.method}
                  </Typography>
                  <Typography>
                    &nbsp;- {log.view_method?.toLocaleUpperCase()}
                  </Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography
                    variant="h3"
                    style={{
                      lineHeight: 2,
                      color:
                        log.status_code && log.status_code < 300
                          ? "#00A255"
                          : "#ED6D91",
                    }}
                  >
                    {log.status_code}
                  </Typography>
                </div>
                <div className={classes.divCentered}>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Temps de réponse :
                  </Typography>
                  <Typography>&nbsp;{log.response_ms}ms</Typography>
                </div>
              </Grid>
              <Grid
                container
                item
                direction="column"
                alignItems="flex-start"
                className={classes.separator}
              >
                <Typography variant="h3" style={{ lineHeight: 2 }}>
                  Data :
                </Typography>
                <Typography align="left" className={classes.jsonDisplay}>
                  {log.data}
                </Typography>
              </Grid>
              <Grid container item direction="column" alignItems="flex-start">
                <Typography variant="h3" style={{ lineHeight: 2 }}>
                  Réponse :
                </Typography>
                <Typography align="left" className={classes.jsonDisplay}>
                  {log.response}
                </Typography>
              </Grid>
              {log.errors && (
                <Grid container item>
                  <Typography variant="h3" style={{ lineHeight: 2 }}>
                    Erreurs :
                  </Typography>
                  <Typography align="left" className={classes.jsonDisplay}>
                    {log.errors}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )
        })
      ) : (
        <Grid
          container
          component={Paper}
          style={{ padding: 12, marginBottom: 8 }}
          justify="center"
        >
          <Typography align="center">Aucun résultat à afficher.</Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default LogsTable

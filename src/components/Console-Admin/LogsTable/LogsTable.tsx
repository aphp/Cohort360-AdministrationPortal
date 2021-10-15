import React, { useEffect, useState } from "react"

import { Grid, Paper, Typography } from "@material-ui/core"

import useStyles from "./styles"
import { Log } from "types"
import { getLogs } from "services/Console-Admin/logsService"
import moment from "moment"
import { _logs } from "./test"

const LogsTable: React.FC = () => {
  const classes = useStyles()
  const [logs, setLogs] = useState<Log[] | null>(null)

  useEffect(() => {
    const _getLogs = async () => {
      try {
        // const logsResp = await getLogs()

        // setLogs(logsResp)
        setLogs(_logs)
      } catch (error) {
        console.error("Erreur lors de la récupération des logs", error)
      }
    }

    _getLogs()
  }, []) // eslint-disable-line

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
    <Grid container justify="flex-end">
      {logs &&
        logs.length > 0 &&
        logs.map((log: Log) => {
          return (
            <Grid
              container
              component={Paper}
              style={{ padding: 12, marginBottom: 8 }}
            >
              {/* <Grid
                container
                item
                justify="flex-start"
                xs={6}
                direction="column"
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    {log.user_details?.provider_name}
                  </Typography>
                  <Typography>&nbsp;- {log.user}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Date :
                  </Typography>
                  <Typography>
                    &nbsp;
                    {log.requested_at
                      ? moment(log.requested_at).format("DD/MM/YYYY")
                      : "-"}
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    URL :
                  </Typography>
                  <Typography>&nbsp;{log.path}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Vue :
                  </Typography>
                  <Typography>&nbsp;{log.view}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Adresse IP :
                  </Typography>
                  <Typography>&nbsp;{log.remote_addr}</Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Hôte :
                  </Typography>
                  <Typography>&nbsp;{log.host}</Typography>
                </div>
              </Grid> */}
              {/* <Grid container item xs={6} direction="column">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    align="right"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    ID :
                  </Typography>
                  <Typography>&nbsp;{log.id}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    align="right"
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    align="right"
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    align="right"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Temps de réponse :
                  </Typography>
                  <Typography>&nbsp;{log.response_ms}ms</Typography>
                </div>
              </Grid> */}
              <Grid
                container
                item
                direction="column"
                alignItems="flex-start"
                style={{ marginTop: 16 }}
              >
                <Typography align="left" variant="h3" style={{ lineHeight: 2 }}>
                  Data :
                </Typography>
                <Typography align="left" className={classes.jsonDisplay}>
                  {log.data}
                </Typography>
              </Grid>
              <Grid container item direction="column" alignItems="flex-start">
                <Typography align="left" variant="h3" style={{ lineHeight: 2 }}>
                  Réponse :
                </Typography>
                <Typography align="left" className={classes.jsonDisplay}>
                  {log.response}
                </Typography>
              </Grid>
              {log.errors && (
                <Grid container item>
                  <Typography
                    align="left"
                    variant="h3"
                    style={{ lineHeight: 2 }}
                  >
                    Erreurs:
                  </Typography>
                  <Typography align="left" className={classes.jsonDisplay}>
                    {log.errors}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )
        })}
    </Grid>
  )
}

export default LogsTable

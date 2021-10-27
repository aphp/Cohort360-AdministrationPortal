import React, { useEffect, useState } from "react"

import { Button, Chip, Grid, Typography } from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"

import LogsFilters from "components/Console-Admin/Logs/LogsFilters/LogsFilters"
import LogsTable from "components/Console-Admin/Logs/LogsTable/LogsTable"

import { getLogs } from "services/Console-Admin/logsService"
import { Log, LogsFiltersObject } from "types"

import FilterListIcon from "@material-ui/icons/FilterList"

import useStyles from "./styles"
import moment from "moment"

const filtersDefault = {
  user: null,
  httpMethod: [],
  statusCode: [],
  afterDate: null,
  beforeDate: null,
  access: null,
  careSite: { careSiteId: null, careSiteName: null },
}

const Logs: React.FC = () => {
  const classes = useStyles()

  const search = window.location.search
  const user = new URLSearchParams(search).get("user")
  const access = new URLSearchParams(search).get("access")
  const careSiteId = new URLSearchParams(search).get("careSiteId")
  const careSiteName = new URLSearchParams(search).get("careSiteName")

  const [loading, setLoading] = useState(false)
  const [openFilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState<LogsFiltersObject>({
    ...filtersDefault,
    user: user,
    access: access,
    careSite: { careSiteId: careSiteId, careSiteName: careSiteName },
  })
  const [logs, setLogs] = useState<Log[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const _getLogs = async () => {
    try {
      setLoading(true)

      const logsResp = await getLogs(filters, page)

      setLogs(logsResp?.logs)
      setTotal(logsResp?.total)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des logs", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    _getLogs()
  }, [filters, page]) // eslint-disable-line

  const handleDeleteChip = (filterName: string, value?: any) => {
    const _filters = { ...filters }

    switch (filterName) {
      case "user":
      case "afterDate":
      case "beforeDate":
      case "access":
        _filters[filterName] = null
        break
      case "careSite":
        _filters["careSite"] = { careSiteId: null, careSiteName: null }
        break
      case "httpMethod":
      case "statusCode":
        _filters[filterName] = _filters[filterName].filter(
          (item) => item !== value
        )
        break
    }

    setFilters(_filters)
  }

  return (
    <>
      <Grid container direction="column">
        <Grid container justify="center">
          <Grid container item xs={12} sm={9} justify="flex-end">
            <Typography variant="h1" color="primary" className={classes.title}>
              Liste des logs
            </Typography>

            <Button
              variant="contained"
              disableElevation
              startIcon={<FilterListIcon height="15px" fill="#FFF" />}
              className={classes.filterButton}
              onClick={() => setOpenFilters(true)}
            >
              Filtrer
            </Button>

            <Grid container item justify="flex-end">
              {filters.user && (
                <Chip
                  className={classes.filterChip}
                  label={`Utilisateur : ${filters.user}`}
                  onDelete={() => handleDeleteChip("user")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.httpMethod.length > 0 &&
                filters.httpMethod.map((method) => (
                  <Chip
                    className={classes.filterChip}
                    label={`Méthode : ${method}`}
                    onDelete={() => handleDeleteChip("httpMethod", method)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              {filters.statusCode.length > 0 &&
                filters.statusCode.map((code) => (
                  <Chip
                    className={classes.filterChip}
                    label={`Code : ${code}`}
                    onDelete={() => handleDeleteChip("statusCode", code)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              {filters.afterDate && (
                <Chip
                  className={classes.filterChip}
                  label={`Après le : ${moment(filters.afterDate).format(
                    "DD/MM/YYYY"
                  )}`}
                  onDelete={() => handleDeleteChip("afterDate")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.beforeDate && (
                <Chip
                  className={classes.filterChip}
                  label={`Avant le : ${moment(filters.beforeDate).format(
                    "DD/MM/YYYY"
                  )}`}
                  onDelete={() => handleDeleteChip("beforeDate")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.access && (
                <Chip
                  className={classes.filterChip}
                  label={`Accès : ${filters.access}`}
                  onDelete={() => handleDeleteChip("access")}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.careSite.careSiteId && (
                <Chip
                  className={classes.filterChip}
                  label={`Périmètre : ${filters.careSite.careSiteName
                    ?.split(".")
                    .join(" ")}`}
                  onDelete={() => handleDeleteChip("careSite")}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Grid>

            <LogsTable loading={loading} logs={logs} />
            <Pagination
              className={classes.pagination}
              count={Math.ceil(total / 100)}
              shape="rounded"
              onChange={(event, page: number) => setPage(page)}
              page={page}
            />
          </Grid>
        </Grid>
      </Grid>

      {openFilters && (
        <LogsFilters
          filters={filters}
          onChangeFilters={setFilters}
          onClose={() => setOpenFilters(false)}
        />
      )}
    </>
  )
}

export default Logs

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as QueryString from "query-string";
import useRouter from "use-react-router";

import {
  Button,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  TextField,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Autocomplete from "@material-ui/lab/Autocomplete";

import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { ProfilesTreeRow } from "types";

import SearchBar from "../../SearchBar/SearchBar";
import AddUserDialog from "../AddProviderDialog/AddProviderDialog";

import useStyles from "./styles";
import { submitGetProfiles } from "services/providersService";

type ProvidersTableProps = {
  profiles?: any;
  loading?: boolean;
  // page: number;
  rowsPerPage?: number;
};

// const userToRow = (user: Partial<User>): ProfilesTreeRow => ({
//   id: user.providerId?.toString() || "",
//   objectId: user.providerId?.toString() || "",
//   firstName: user.firstName || "",
//   lastName: user.lastName || "",
//   email: user.email || "",
//   providerSourceValue: user.providerSourceValue || "",
// });

const ProvidersTable: React.FC<ProvidersTableProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history } = useRouter();

  const columns = [
    {
      label: "Identifiant APH",
      code: "providerSourceValue",
    },
    {
      label: "Nom",
      code: "lastName",
    },
    {
      label: "Prénom",
      code: "firstName",
    },
    {
      label: "Email",
      code: "email",
    },
  ];

  const searchOptions = [
    {
      label: "Identifiant APH",
      code: "providerSourceValue",
    },
    {
      label: "Nom",
      code: "lastName",
    },
    {
      label: "Prénom",
      code: "firstName",
    },
    {
      label: "Email",
      code: "email",
    },
  ];

  const [profiles, setProfiles] = useState(undefined);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(true);
  const [orderBy, setOrderBy] = useState<string>("lastName");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [searchInput, setSearchInput] = useState("");
  const [searchBy, setSearchBy] = useState(searchOptions[1]);

  const [open, setOpen] = useState(false);

  const rowsPerPage = 50;

  console.log(`orderBy`, orderBy);
  console.log(
    `window.location.search`,
    QueryString.parse(window.location.search)
  );
  console.log(`page`, page);
  console.log(`total`, total);
  console.log(`searchBy`, searchBy);

  useEffect(() => {
    setData();
  }, [orderBy, orderDirection, searchInput]); // eslint-disable-line

  const setData = () => {
    getData(orderBy, orderDirection, page);
  };

  // @ts-ignore
  console.log(`profiles`, profiles);

  const getData = async (
    orderBy: string,
    orderDirection: string,
    page?: number
  ) => {
    setLoading(true);
    submitGetProfiles()
      .then((resp) => {
        if (resp) {
          setProfiles(resp);
        }

        console.log(`resp`, resp);

        return resp;
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const createSortHandler = (property: any) => (
    event: React.MouseEvent<unknown>
  ) => {
    const isAsc: boolean = orderBy === property && orderDirection === "asc";
    const _orderDirection = isAsc ? "desc" : "asc";

    setOrderDirection(_orderDirection);
    setOrderBy(property);
    // onSearchPatient(property, _orderDirection);
  };

  const handleChangeAutocomplete = (
    event: React.ChangeEvent<{}>,
    value: { label: string; code: string } | null
  ) => {
    if (value) setSearchBy(value);
  };

  return (
    <Grid container justify="flex-end">
      <Grid
        container
        item
        justify="space-between"
        style={{ margin: "12px 0" }}
        alignItems="center"
      >
        <Button
          variant="contained"
          disableElevation
          startIcon={<PersonAddIcon height="15px" fill="#FFF" />}
          className={classes.searchButton}
          onClick={() => setOpen(true)}
        >
          Nouvel utilisateur
        </Button>
        <Grid container item xs={6} justify="flex-end" alignItems="center">
          <Autocomplete
            options={searchOptions}
            getOptionLabel={(option) => option.label}
            onChange={handleChangeAutocomplete}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rechercher par..."
                variant="outlined"
              />
            )}
            value={searchBy}
            style={{ width: "200px" }}
          />
          <SearchBar searchInput={searchInput} onChangeInput={setSearchInput} />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column) => (
                <TableCell
                  sortDirection={
                    orderBy === column.code ? orderDirection : false
                  }
                  align="center"
                  className={classes.tableHeadCell}
                >
                  <TableSortLabel
                    active={orderBy === column.code}
                    direction={orderBy === column.code ? orderDirection : "asc"}
                    onClick={createSortHandler(column.code)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <div className={classes.loadingSpinnerContainer}>
                    <CircularProgress size={50} />
                  </div>
                </TableCell>
              </TableRow>
            ) : // @ts-ignore
            !profiles ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography className={classes.loadingSpinnerContainer}>
                    Aucun résultat à afficher
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              // @ts-ignore
              profiles.map((profile: any) => {
                return (
                  profile && (
                    <TableRow
                      key={profile.id}
                      className={classes.tableBodyRows}
                      hover
                      onClick={() => window.open(`/users/${profile.id}`)}
                    >
                      <TableCell align="center">
                        {/* {profile.providerSourceValue} */}
                        {profile.provider_source_value}
                      </TableCell>
                      <TableCell align="center">
                        {/* {profile.lastName} */}
                        {profile.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {/* {profile.firstName} */}
                        {profile.firstname}
                      </TableCell>
                      <TableCell align="center">{profile.email}</TableCell>
                    </TableRow>
                  )
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        className={classes.pagination}
        count={Math.ceil(total / rowsPerPage)}
        shape="rounded"
        // onChange={onChangePage}
        page={page}
      />

      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={() => setOpen(false)}
      />
    </Grid>
  );
};

export default ProvidersTable;

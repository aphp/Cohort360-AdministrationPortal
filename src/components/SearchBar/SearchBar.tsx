import React from 'react'

import { Grid, IconButton, InputAdornment, InputBase } from '@mui/material'

import ClearIcon from '@mui/icons-material/Clear'
import { ReactComponent as SearchIcon } from '../../assets/icones/search.svg'

import useStyles from './styles'

type SearchBarProps = {
  searchInput: string
  onChangeInput: (searchInput: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ searchInput, onChangeInput }) => {
  const classes = useStyles()

  const handleChangeInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChangeInput(event.target.value)
  }

  const handleClearInput = () => {
    onChangeInput('')
  }

  return (
    <Grid item container alignItems="center" className={classes.searchBar}>
      <InputBase
        placeholder="Rechercher"
        className={classes.input}
        value={searchInput}
        onChange={handleChangeInput}
        endAdornment={
          searchInput && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearInput} size="large">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <IconButton type="submit" aria-label="search" size="large">
        <SearchIcon fill="#ED6D91" height="15px" />
      </IconButton>
    </Grid>
  )
}

export default SearchBar

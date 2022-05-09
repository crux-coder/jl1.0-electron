import React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { visuallyHidden } from "@mui/utils";
import { CSVLink } from "react-csv";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "ranking",
    align: 'center',
    disablePadding: false,
    label: "Rank",
  },
  {
    id: "base_url",
    align: 'left',
    disablePadding: false,
    label: "Base URL",
  },
  {
    id: "title",
    align: 'left',
    disablePadding: false,
    label: "Page title",
  },
  {
    id: "snippet",
    align: 'left',
    disablePadding: false,
    label: "Result Snippet",
  },
  {
    id: "date",
    align: 'center',
    disablePadding: false,
    label: "Date",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box component="span" sx={visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </Box>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, selected, setSelected, rows, setRows, searchResults, openImportModal } = props;
  const [csvData, setCsvData] = React.useState([]);

  React.useEffect(() => {
    setCsvData(rows.map((result) => {
      return {
        position: result.position,
        title: result.title,
        link: result.link,
        displayed_link: result.displayed_link,
        snippet: result.snippet,
        date: result.date

      }
    }));
  }, [rows]);

  const handleDeleteRows = () => {
    setRows(rows.filter((row) => {
      return !selected.find((el) => el === row.title);
    }));
    setSelected([]);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <Button sx={{ mr: 1 }} variant="contained" size="small" color="error" onClick={handleDeleteRows} endIcon={<DeleteIcon />} >DELETE</Button>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
        </Typography>
        </>
      ) : (
          <>
            <Typography sx={{ flex: "1 1 100%" }} id="tableTitle">
              <Typography>
                Search Query: {searchResults.param.q}
              </Typography>
              <Typography>
                Location: {searchResults.param.location}
              </Typography>
            </Typography>
          </>
        )}
      {numSelected == 0 && (
        <>
          <CSVLink separator={";"} style={{ textDecoration: 'none' }} data={csvData} filename={`${searchResults.param.q}-${searchResults.param.location}.csv`}>
            <Button sx={{ textDecoration: 'none', ml: 1, whiteSpace: 'noWrap' }} variant="contained" endIcon={<CloudDownloadIcon />}>
              Download CSV
            </Button>
          </CSVLink>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
export default function DataTable({ searchResults, openImportModal }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState(searchResults?.data?.organic_results || {});

  React.useEffect(() => {
    setRows(searchResults.data.organic_results);
  }, [searchResults])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const followLink = (link) => {
    shell.openExternal(link);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper square sx={{ width: "100%" }}>
        <EnhancedTableToolbar
          rows={rows}
          searchResults={searchResults}
          setRows={setRows}
          selected={selected}
          setSelected={setSelected}
          numSelected={selected.length}
          openImportModal={openImportModal}
        />
        <TableContainer>
          <Table aria-labelledby="tableTitle" size={"small"}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.title);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.title}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row.title)}
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">{row.position}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ width: 130 }}
                      >
                        <Tooltip title={row.link}>
                          <Button size="small" endIcon={<OpenInNewIcon fontSize="small" />} href={row.link} target="_blank">
                            Open link
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        <Tooltip title={row.title}>
                          <Typography noWrap sx={{ fontWeight: 500, fontSize: 14 }}>
                            {row.title}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">
                        <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                          {row.snippet}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography noWrap sx={{ fontWeight: 500, fontSize: 14 }}>
                          {row.date ? row.date : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box >
  );
}

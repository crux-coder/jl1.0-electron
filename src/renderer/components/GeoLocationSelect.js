import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Autocomplete, Divider, Typography } from "@mui/material";
import Locations from "../assets/locations";
import PropTypes from "prop-types";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import { VariableSizeList } from "react-window";

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {dataSet[1]}
    </Typography>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });

  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

ListboxComponent.propTypes = {
  children: PropTypes.node,
};

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function GeoLocationSelect({ locations, setLocations, errors, setErrors }) {
  const theme = useTheme();

  const handleReset = () => {
    setLocations(["United States"]);

    delete errors.locations;
    setErrors(errors);
  };

  const handleDelete = (value) => {
    setLocations(locations.filter((location) => {
      return location !== value;
    }));
  };

  const handleChange = (event, value) => {
    setLocations(value);
    delete errors.locations;
    setErrors(errors);
  };
  return (
    <Card square>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Geographic Location
        </Typography>
        <Divider />
        <Autocomplete
          id="demo-multiple-chip"
          fullWidth
          multiple
          disableListWrap
          PopperComponent={StyledPopper}
          ListboxComponent={ListboxComponent}
          sx={{ mt: 1, mb: 0.5, borderRadius: 0 }}
          size="small"
          margin="dense"
          options={Locations}
          value={locations}
          onChange={handleChange}
          renderInput={(params) => <TextField
            error={errors.locations?.toString()}
            helperText={errors.locations && 'You must have at least one location selected.'} {...params} />}
          renderTags={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} onDelete={() => handleDelete(value)} />
              ))}
            </Box>
          )}
          renderOption={(props, option) => [props, option]}
        />
      </CardContent>
      <CardActions>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
          <Button
            onClick={handleReset}
            variant="outlined"
            color="error"
            size="small"
          >
            reset to default
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

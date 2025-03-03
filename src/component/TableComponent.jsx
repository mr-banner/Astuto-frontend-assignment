import React, { useState, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { tableData, tableSchema } from "../constant/tableConstant";
import {
  Chip,
  Avatar,
  Typography,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const TableComponent = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const handleSearch = (e) => {
    setSearchName(e.target.value.toLowerCase());
  };

  const handleRoleChange = (event) => {
    setSelectedRoles(event.target.value);
  };

  const filteredData = useMemo(() => {
    return tableData
      .filter((row) => row.profile.name.toLowerCase().includes(searchName))
      .filter(
        (row) => selectedRoles.length === 0 || selectedRoles.includes(row.role)
      );
  }, [searchName, selectedRoles]);

  const columns = useMemo(
    () =>
      tableSchema.map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        sortingFn: col.accessorKey === "age" ? "alphanumeric" : undefined,
        Cell: ({ row }) => {
          const value = row.original[col.accessorKey];

          if (col.type === "profile") {
            return (
              <Box display="flex" alignItems="center">
                <Avatar
                  src={value.img}
                  sx={{ width: 32, height: 32, marginRight: 1 }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {value.name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {value.username}
                  </Typography>
                </Box>
              </Box>
            );
          }

          if (col.type === "badge") {
            return <Chip label={value} color="primary" size="small" />;
          }

          if (col.type === "tags") {
            return value.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{ marginRight: 0.5 }}
              />
            ));
          }

          return value;
        },
      })),
    []
  );

  return (
    <Box>
      <Box display="flex justify-content-between" position="relative" left="81.4%">
        <TextField
          label="Search Name"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Filter</InputLabel>
          <Select
            multiple
            value={selectedRoles}
            onChange={handleRoleChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {[
              "Software Engineer",
              "Data Scientist",
              "UI/UX Designer",
              "Project Manager",
            ].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={filteredData}
        enableSorting
        enablePagination
        positionPagination="bottom"
      />
    </Box>
  );
};

export default TableComponent;

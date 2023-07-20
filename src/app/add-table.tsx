'use client'
import { useState } from 'react';

export default function AddTable() {
  interface Column {
    name: string;
    dataType: string;
  }
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([{ name: '', dataType: '' }]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(tableName);
    columns.forEach((column) => {
      console.log(column.name);
      console.log(column.dataType);
    });

    event.preventDefault();
    // TODO: Handle form submission
  };

  const handleTableNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableName(event.target.value);
  };
  const handleColumnNameChange = (event: React.ChangeEvent<HTMLInputElement>, index:number) => {
    const newColumns = [...columns];
    newColumns[index].name = event.target.value;
    setColumns(newColumns);
  };

  const handleDataTypeChange = (event: React.ChangeEvent<HTMLInputElement>, index:number) => {
    const newColumns = [...columns];
    newColumns[index].dataType = event.target.value;
    setColumns(newColumns);
  };
  const handleAddRow = () => {
    setColumns([...columns, { name: '', dataType: '' }]);
  };
  const handleDeleteRow = (index: number) => {
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };


  return (
    <div>
      <h1>Add a Table</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Table Name:
          <input type="text" value={tableName} onChange={handleTableNameChange} />
        </label>
        <table>
          <thead>
            <tr>
              <th>Column Name</th>
              <th>Data Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {columns.map((column, index) => (
              <tr key={index}>
                <td>
                  <input type="text" value={column.name} onChange={(event) => handleColumnNameChange(event, index)} />
                </td>
                <td>
                <select value={column.dataType} onChange={(event) => handleDataTypeChange(event, index)}>
                    <option value="INT">INT</option>
                    <option value="VARCHAR">VARCHAR</option>
                    <option value="TEXT">TEXT</option>
                    <option value="DATE">DATE</option>
                    <option value="DATETIME">DATETIME</option>
                  </select>
                </td>
                <td>
                  <button type="button" onClick={() => handleDeleteRow(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={handleAddRow}>Add Row</button>
        <button type="submit">Create Table</button>
      </form>
    </div>
  );
}
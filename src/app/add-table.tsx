'use client'
import { useState } from 'react';

export default function AddTable() {
  interface Column {
    name: string;
    dataType: string;
  }
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([{ name: '', dataType: '' }]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    if (tableName === '' || columns.some((column) => column.name === '' || column.dataType === '')) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    console.log(tableName);
    columns.forEach((column) => {
      console.log(column.name);
      console.log(column.dataType);
    });

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

  const handleDataTypeChange = (event: React.ChangeEvent<HTMLSelectElement>, index:number) => {
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
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
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
                    <option value=""></option>
                    <option value="DOUBLE">Decimal</option>
                    <option value="INT">Integer</option>
                    <option value="VARCHAR">String</option>
                    <option value="TEXT">Text</option>
                    <option value="DATE">Date</option>
                    <option value="DATETIME">Date/Time</option>
                    <option value="BOOLEAN">True/False</option>
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
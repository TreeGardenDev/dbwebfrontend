'use client'
import { useState } from 'react';
import '@component/app/globals.css';
import { count } from 'console';

export default function AddTable() {
  interface Column {
    name: string;
    dataType: string;
  }
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([{ name: '', dataType: '' }]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    if (tableName === '' || columns.some((column) => column.name === '' || column.dataType === '')) {
      setErrorMessage('Please fill out all fields.');
      return;
    }
    console.log(tableName);
    
    let countArray=[];
    for (let i=0; i<columns.length; i++){

      let string="col"+(i+1).toString();
      console.log(string);
      countArray.push(string);
    }
    const columnsArray = columns.map((column) => column.name);
    const typesArray = columns.map((column) => column.dataType);

    const jsonObject = {
      columns: [Object.fromEntries(countArray.map((column,index) => [column, columnsArray[index]]))],
      types: [Object.fromEntries(countArray.map((column, index) => [column, typesArray[index]]))],

    }
    let database="testfrontend";
    let json = JSON.stringify(jsonObject);
    console.log(json);
    let gpsval="false";
    //let storedApiKey = localStorage.getItem('apiKey');
    let storedApiKey="CEF7698E34DEBFB3BA467410EF57DC54932A828BDE93729730DC9FB396218631";


    const url = `http://localhost:8080/createtable/${database}&table=${tableName}&gps=${gpsval}&apikey=${storedApiKey}`;
    console.log(url); 
  // Send the HTTP request with the JSON body
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json,
    });

    if (response.ok) {
      console.log('Table created successfully!');
    } else {
      console.error('Failed to create table:', response.statusText);
    }
  } catch (error) {
    console.error('Failed to create table:', error);
  }
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
                    <option value="VARCHAR(255)">String</option>
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